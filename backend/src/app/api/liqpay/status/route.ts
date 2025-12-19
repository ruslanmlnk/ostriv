import crypto from 'crypto'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const LIQPAY_REQUEST_URL = 'https://www.liqpay.ua/api/request'

const sign = (privateKey: string, data: string) =>
  crypto
    .createHash('sha1')
    .update(`${privateKey}${data}${privateKey}`, 'utf8')
    .digest('base64')

const toBase64 = (value: string) => Buffer.from(value, 'utf8').toString('base64')

const mapLiqPayStatus = (status: string): 'paid' | 'pending' | 'failed' | 'refunded' => {
  const normalized = (status || '').toLowerCase()

  if (['success', 'sandbox', 'subscribed', 'hold_wait'].includes(normalized)) return 'paid'
  if (['reversed'].includes(normalized)) return 'refunded'
  if (['failure', 'error', 'expired', 'unsubscribed'].includes(normalized)) return 'failed'

  return 'pending'
}

async function syncOrderFromLiqPayStatus(orderId: string) {
  const publicKey = process.env.LIQPAY_PUBLIC_KEY
  const privateKey = process.env.LIQPAY_PRIVATE_KEY

  if (!publicKey || !privateKey) {
    return { ok: false as const, status: 500, body: { error: 'LiqPay keys are not configured.' } }
  }

  const payload: Record<string, unknown> = {
    public_key: publicKey,
    version: '3',
    action: 'status',
    order_id: orderId,
  }

  if ((process.env.LIQPAY_SANDBOX || '').trim() === '1') {
    payload.sandbox = 1
  }

  const data = toBase64(JSON.stringify(payload))
  const signature = sign(privateKey, data)

  const form = new URLSearchParams()
  form.set('data', data)
  form.set('signature', signature)

  const liqpayRes = await fetch(LIQPAY_REQUEST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
    cache: 'no-store',
  })

  const liqpayJson = (await liqpayRes.json().catch(() => null)) as Record<string, unknown> | null

  if (!liqpayRes.ok || !liqpayJson) {
    return {
      ok: false as const,
      status: 502,
      body: { error: 'Failed to fetch LiqPay status.', details: liqpayJson },
    }
  }

  const liqpayStatus = typeof liqpayJson.status === 'string' ? liqpayJson.status : ''
  const action = typeof liqpayJson.action === 'string' ? liqpayJson.action : ''
  const nextPaymentStatus = mapLiqPayStatus(liqpayStatus)
  const now = new Date().toISOString()

  const payloadClient = await getPayload({ config: configPromise })

  const existing = await payloadClient
    .findByID({
      collection: 'orders',
      id: orderId,
      overrideAccess: true,
    })
    .catch(() => null)

  if (!existing) {
    return { ok: false as const, status: 404, body: { error: 'Order not found.' } }
  }

  const currentPaymentStatus =
    typeof (existing as any).paymentStatus === 'string' ? ((existing as any).paymentStatus as string) : undefined

  const resolvedPaymentStatus =
    currentPaymentStatus === 'paid' && nextPaymentStatus !== 'refunded' ? 'paid' : nextPaymentStatus

  const updateData: Record<string, unknown> = {
    paymentProvider: 'liqpay',
    paymentStatus: resolvedPaymentStatus,
    liqpay: {
      status: liqpayStatus || undefined,
      action: action || undefined,
      paymentId: liqpayJson.payment_id ? String(liqpayJson.payment_id) : undefined,
      transactionId: liqpayJson.transaction_id ? String(liqpayJson.transaction_id) : undefined,
      errCode: liqpayJson.err_code ? String(liqpayJson.err_code) : undefined,
      errDescription: liqpayJson.err_description ? String(liqpayJson.err_description) : undefined,
      lastCallbackAt: now,
      raw: liqpayJson,
    },
  }

  if (resolvedPaymentStatus === 'paid') {
    updateData.status = 'paid'
    updateData.paidAt = (existing as any).paidAt || now
  }

  const updated = await payloadClient.update({
    collection: 'orders',
    id: orderId,
    data: updateData,
    overrideAccess: true,
  })

  return {
    ok: true as const,
    status: 200,
    body: {
      ok: true,
      orderId: updated?.id,
      paymentStatus: resolvedPaymentStatus,
      liqpayStatus,
      liqpayAction: action,
    },
  }
}

export const GET = async (request: Request) => {
  const url = new URL(request.url)
  const orderId = url.searchParams.get('orderId') || url.searchParams.get('order_id')

  if (!orderId) {
    return Response.json({ error: 'orderId is required.' }, { status: 400 })
  }

  try {
    const result = await syncOrderFromLiqPayStatus(String(orderId))
    return Response.json(result.body, { status: result.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return Response.json({ error: 'Failed to sync order from LiqPay.', details: message }, { status: 500 })
  }
}

export const POST = async (request: Request) => {
  let json: any = null
  try {
    json = await request.json()
  } catch {
    // ignore
  }

  const orderId = json?.orderId ?? json?.order_id
  if (!orderId) {
    return Response.json({ error: 'orderId is required.' }, { status: 400 })
  }

  try {
    const result = await syncOrderFromLiqPayStatus(String(orderId))
    return Response.json(result.body, { status: result.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return Response.json({ error: 'Failed to sync order from LiqPay.', details: message }, { status: 500 })
  }
}

