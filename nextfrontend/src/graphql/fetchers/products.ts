'use client';

import { Product } from '@/types';
import { graphqlClient } from '../client';
import { GET_PRODUCTS } from '../queries/products';
import { ProductsResponse} from '../types';

export const fetchProducts = async (type: 'all' | 'hit' | 'new' = 'all'): Promise<Product[]> => {
  try {
    const filters =
      type === 'hit'
        ? { isHit: { eq: true } }
        : type === 'new'
        ? { isNew: { eq: true } }
        : undefined;

    const variables = filters
      ? { filters, ...(type === 'new' && { sort: ['createdAt:desc'] }) }
      : {};

    const data = await graphqlClient.request<ProductsResponse>(GET_PRODUCTS, variables);
    const items = (data.products as any)?.data ?? data.products ?? [];

    return items;
  } catch (e) {
    console.warn(`Strapi products fetch failed (${type})`, e);
    return [];
  }
};
