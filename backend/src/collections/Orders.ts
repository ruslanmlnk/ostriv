import type { CollectionConfig } from 'payload'
import { parse } from 'graphql'

const isCreateOrderMutation = (query: unknown) => {
  if (typeof query !== 'string' || !query.trim()) return false
  try {
    const document = parse(query)
    return document.definitions.some((definition) => {
      if (definition.kind !== 'OperationDefinition') return false
      if (definition.operation !== 'mutation') return false
      return definition.selectionSet.selections.some((selection) => {
        if (selection.kind !== 'Field') return false
        return selection.name.value === 'createOrder'
      })
    })
  } catch {
    return false
  }
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['status', 'paymentStatus', 'total', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true

      const method = typeof req.method === 'string' ? req.method.toUpperCase() : ''
      const url =
        typeof (req as any).originalUrl === 'string'
          ? (req as any).originalUrl
          : typeof req.url === 'string'
            ? req.url
            : ''

      if (method === 'POST' && url.includes('/api/orders')) return true
      if (method === 'POST' && url.includes('/api/graphql') && isCreateOrderMutation((req as any).body?.query)) {
        return true
      }

      return false
    },
    create: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        if (!data) return data

        const nextData: Record<string, unknown> = { ...data }
        const paymentMethod = typeof nextData.paymentMethod === 'string' ? nextData.paymentMethod : undefined
        const paymentStatus = typeof nextData.paymentStatus === 'string' ? nextData.paymentStatus : undefined

        if (operation === 'create') {
          if (!nextData.paymentProvider && paymentMethod === 'card') {
            nextData.paymentProvider = 'liqpay'
          }

          if (paymentMethod === 'card' && (!paymentStatus || paymentStatus === 'unpaid')) {
            nextData.paymentStatus = 'pending'
          } else if (!paymentStatus) {
            nextData.paymentStatus = 'unpaid'
          }
        }

        if (nextData.paymentStatus === 'paid' && !nextData.paidAt && !(originalDoc as any)?.paidAt) {
          nextData.paidAt = new Date().toISOString()
        }

        if (nextData.paymentStatus === 'paid' && nextData.status !== 'paid') {
          nextData.status = 'paid'
        }

        return nextData
      },
    ],
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Processing', value: 'processing' },
        { label: 'Paid', value: 'paid' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'warehouse',
      type: 'text',
      required: true,
    },
    {
      name: 'deliveryMethod',
      type: 'text',
    },
    {
      name: 'paymentMethod',
      type: 'text',
      required: true,
    },
    {
      name: 'paymentStatus',
      type: 'select',
      label: 'Статус оплати',
      defaultValue: 'unpaid',
      options: [
        { label: 'Не оплачено', value: 'unpaid' },
        { label: 'Очікується оплата', value: 'pending' },
        { label: 'Оплачено', value: 'paid' },
        { label: 'Помилка / Відхилено', value: 'failed' },
        { label: 'Повернено', value: 'refunded' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'paymentProvider',
      type: 'select',
      label: 'Платіжний провайдер',
      options: [{ label: 'LiqPay', value: 'liqpay' }],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'paidAt',
      type: 'date',
      label: 'Дата оплати',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'liqpay',
      type: 'group',
      label: 'LiqPay',
      admin: {
        readOnly: true,
        condition: (_, siblingData) =>
          siblingData?.paymentProvider === 'liqpay' || siblingData?.paymentMethod === 'card',
      },
      fields: [
        {
          name: 'status',
          type: 'text',
          label: 'Статус LiqPay',
        },
        {
          name: 'action',
          type: 'text',
          label: 'Action',
        },
        {
          name: 'paymentId',
          type: 'text',
          label: 'Payment ID',
        },
        {
          name: 'transactionId',
          type: 'text',
          label: 'Transaction ID',
        },
        {
          name: 'errCode',
          type: 'text',
          label: 'Error code',
        },
        {
          name: 'errDescription',
          type: 'text',
          label: 'Error description',
        },
        {
          name: 'lastCallbackAt',
          type: 'date',
          label: 'Останній callback',
        },
        {
          name: 'raw',
          type: 'json',
          label: 'Raw payload',
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
      ],
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
