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
    defaultColumns: ['status', 'total', 'createdAt'],
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
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: false,
        },
        {
          name: 'productId',
          type: 'text',
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
