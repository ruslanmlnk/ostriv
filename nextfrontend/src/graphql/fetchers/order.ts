'use client';

import { OrderData } from '@/types';
import { graphqlClient } from '../client';
import { CREATE_ORDER } from '../queries/createOrder';

export const createOrderRequest = async (orderData: OrderData): Promise<{ success: boolean; id: string | number }> => {
  const strapiPayload = {
    firstName: orderData.customer.firstName,
    lastName: orderData.customer.lastName,
    phone: orderData.customer.phone,
    email: orderData.customer.email,
    city: orderData.delivery.city,
    warehouse: orderData.delivery.warehouse,
    paymentMethod: orderData.paymentMethod,
    total: orderData.total,
    items: JSON.stringify(orderData.items),
  };

  const response = await graphqlClient.request<{ createOrder: { data: { id: string | number } } }>(
    CREATE_ORDER,
    { data: strapiPayload }
  );

  return { success: true, id: response.createOrder.data.id };
};
