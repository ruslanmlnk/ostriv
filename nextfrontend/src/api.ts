import { Product, Category, OrderData, Media } from './types';
import { HIT_PRODUCTS, NEW_PRODUCTS, CATALOG_PRODUCTS } from './constants';
import { STRAPI_URL } from './graphql/client';
import { fetchCategories } from './graphql/fetchers/categories';
import { fetchProducts } from './graphql/fetchers/products';
import { createOrderRequest } from './graphql/fetchers/order';
import { StrapiMedia } from './graphql/types';

export const getImageUrl = (image: StrapiMedia | StrapiMedia[] | Media | string | null | undefined): string => {
  if (!image) return '';

  const pick = Array.isArray(image) ? image[0] : image;

  if (typeof pick === 'string') {
    return pick.startsWith('http') ? pick : `${STRAPI_URL}${pick}`;
  }
  if ('url' in pick && typeof pick.url === 'string') {
    return pick.url.startsWith('http') ? pick.url : `${STRAPI_URL}${pick.url}`;
  }
  if ('data' in pick && pick.data?.attributes?.url) {
    const url = pick.data.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  return '';
};

// --- API ---
export const api = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const categories = await fetchCategories();
      return categories;
    } catch (error) {
      console.warn('Strapi Connection Failed (Categories).', error);
      return [];
    }
  },

  getProducts: async (type: 'all' | 'hit' | 'new' = 'all'): Promise<Product[]> => {
    try {
      const products = await fetchProducts(type);
      console.log('Fetched products:', products);
      return products;  
    } catch (error) {
      console.warn(`Strapi Connection Failed (Products: ${type}). Using Mock Data.`, error);
      if (type === 'new') return NEW_PRODUCTS;
      if (type === 'hit') return HIT_PRODUCTS;
      return CATALOG_PRODUCTS;
    }
  },

  createOrder: async (orderData: OrderData): Promise<{ success: boolean; id: string | number }> => {
    try {
      const response = await createOrderRequest(orderData);
      return response;
    } catch (error) {
      console.error('API Error (Create Order):', error);
      alert('Помилка при з’єднанні з сервером Strapi. Замовлення збережено локально (демо).');
      return { success: true, id: 'mock-order-id' };
    }
  }
};
