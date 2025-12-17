'use client'

import { OrderData } from '@/types'
import { graphqlClient } from '../client'
import { CREATE_ORDER } from '../queries/createOrder'
import { CreateOrderResponse } from '../types'

const USE_MOCK = false

export const createOrderRequest = async (orderData: OrderData): Promise<{ success: boolean; id: string | number }> => {
  if (USE_MOCK) {
    return { success: true, id: 'mock-order-id' }
  }

  const items = orderData.items.map((item) => {
    const productId = String(item.product_id)
    const numericId = Number(productId)

    return {
      product: Number.isFinite(numericId) ? numericId : undefined,
      productId,
      quantity: item.quantity,
    }
  })

  const payloadBody = {
    firstName: orderData.customer.firstName,
    lastName: orderData.customer.lastName,
    phone: orderData.customer.phone,
    email: orderData.customer.email,
    city: orderData.delivery.city,
    warehouse: orderData.delivery.warehouse,
    deliveryMethod: orderData.delivery.method,
    paymentMethod: orderData.paymentMethod,
    total: orderData.total,
    items,
  }

  const response = await graphqlClient.request<{ createOrder?: CreateOrderResponse }>(CREATE_ORDER, {
    data: payloadBody,
  })

  const id = response.createOrder?.id ?? 'order-created'
  return { success: true, id }
}
