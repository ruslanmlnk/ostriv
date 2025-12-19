import crypto from 'crypto'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '')

const sign = (privateKey: string, data: string) =>
  crypto
    .createHash('sha1')
    .update(`${privateKey}${data}${privateKey}`, 'utf8')
    .digest('base64')

const mapLiqPayStatus = (status: string): 'paid' | 'pending' | 'failed' | 'refunded' => {
  const normalized = (status || '').toLowerCase()

  if (['success', 'sandbox', 'subscribed', 'hold_wait'].includes(normalized)) return 'paid'
  if (['reversed'].includes(normalized)) return 'refunded'
  if (['failure', 'error', 'expired', 'unsubscribed'].includes(normalized)) return 'failed'

  return 'pending'
}

export const POST = async (request: Request) => {
  const privateKey = process.env.LIQPAY_PRIVATE_KEY
  if (!privateKey) {
    return Response.json({ error: 'LIQPAY_PRIVATE_KEY не задано' }, { status: 500 })
  }

  let data = ''
  let signature = ''

  const contentType = request.headers.get('content-type') || ''
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const form = await request.formData()
    data = String(form.get('data') || '')
    signature = String(form.get('signature') || '')
  } else {
    const json = (await request.json().catch(() => null)) as any
    data = String(json?.data || '')
    signature = String(json?.signature || '')
  }

  if (!data || !signature) {
    return Response.json({ error: 'Очікуються поля data та signature' }, { status: 400 })
  }

  const expected = sign(privateKey, data)
  if (signature !== expected) {
    return Response.json({ error: 'Невірний signature' }, { status: 400 })
  }

  let payload: Record<string, unknown> | null = null
  try {
    const decoded = Buffer.from(data, 'base64').toString('utf8')
    payload = JSON.parse(decoded) as Record<string, unknown>
  } catch {
    return Response.json({ error: 'Не вдалося розпарсити callback payload' }, { status: 400 })
  }

  const orderId = payload?.order_id ?? payload?.orderId
  if (!orderId) {
    return Response.json({ error: 'order_id відсутній' }, { status: 400 })
  }

  const statusValue = payload.status
  const actionValue = payload.action
  const liqpayStatus = typeof statusValue === 'string' ? statusValue : ''
  const action = typeof actionValue === 'string' ? actionValue : ''
  const nextPaymentStatus = mapLiqPayStatus(liqpayStatus)
  const now = new Date().toISOString()

  try {
    const payloadClient = await getPayload({ config: configPromise })

    const id = typeof orderId === 'number' ? String(orderId) : String(orderId)

    const existing = await payloadClient
      .findByID({
        collection: 'orders',
        id,
        overrideAccess: true,
      })
      .catch(() => null)

    const currentPaymentStatus =
      typeof (existing as any)?.paymentStatus === 'string' ? ((existing as any).paymentStatus as string) : undefined

    const resolvedPaymentStatus =
      currentPaymentStatus === 'paid' && nextPaymentStatus !== 'refunded' ? 'paid' : nextPaymentStatus

    const updateData: Record<string, unknown> = {
      paymentProvider: 'liqpay',
      paymentStatus: resolvedPaymentStatus,
      liqpay: {
        status: liqpayStatus || undefined,
        action: action || undefined,
        paymentId: payload?.payment_id ? String(payload.payment_id) : undefined,
        transactionId: payload?.transaction_id ? String(payload.transaction_id) : undefined,
        errCode: payload?.err_code ? String(payload.err_code) : undefined,
        errDescription: payload?.err_description ? String(payload.err_description) : undefined,
        lastCallbackAt: now,
        raw: payload,
      },
    }

    if (resolvedPaymentStatus === 'paid') {
      updateData.status = 'paid'
      updateData.paidAt = (existing as any)?.paidAt || now
    }

    const updated = await payloadClient.update({
      collection: 'orders',
      id,
      data: updateData,
      overrideAccess: true,
    })

    const baseUrl =
      process.env.NEXT_PUBLIC_CMS_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL
    const adminUrl =
      baseUrl && updated?.id ? `${normalizeBaseUrl(String(baseUrl))}/admin/collections/orders/${updated.id}` : undefined

    return Response.json({ ok: true, orderId: updated?.id, paymentStatus: resolvedPaymentStatus, adminUrl })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('LiqPay callback update order error:', message)
    return Response.json({ error: 'Не вдалося оновити замовлення', details: message }, { status: 500 })
  }
}
