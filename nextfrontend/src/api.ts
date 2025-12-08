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

  getProducts: async (type: 'all' | 'hit' | 'new' = 'all', categorySlug?: string): Promise<Product[]> => {
    try {
      let products = await fetchProducts(type, categorySlug);

      if (products.length === 0 && type !== 'all') {
        const allProducts = await fetchProducts('all', categorySlug);
        products = type === 'hit'
          ? allProducts.filter((p) => p.isHit)
          : allProducts.filter((p) => p.isNew);
      }

      if (categorySlug) {
        products = products.filter((p) => p.category === categorySlug);
      }

      if (products.length === 0) {
        throw new Error('No products from Strapi');
      }

      return products;  
    } catch (error) {
      console.warn(`Strapi Connection Failed (Products: ${type}). Using Mock Data.`, error);
      let fallback = type === 'new' ? NEW_PRODUCTS : type === 'hit' ? HIT_PRODUCTS : CATALOG_PRODUCTS;
      if (categorySlug) {
        fallback = fallback.filter((p) => p.category === categorySlug);
      }
      return fallback;
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
