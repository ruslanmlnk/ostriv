'use client';

import { Product } from '@/types';
import { getImageUrl } from '@/api';
import { graphqlClient } from '../client';
import { GET_PRODUCTS } from '../queries/products';
import { ProductsResponse, StrapiItem, StrapiProductAttributes } from '../types';
import { CATALOG_PRODUCTS, HIT_PRODUCTS, NEW_PRODUCTS } from '@/constants';

type ProductKey = 'all' | 'hit' | 'new';
const productCache: Record<string, Product[]> = {};
const productPromises: Record<string, Promise<Product[]> | undefined> = {};
const USE_MOCK = true; // тимчасово вимикаємо Strapi, використовуємо тестові дані

const normalizeProduct = (
  item: StrapiItem<StrapiProductAttributes> | StrapiProductAttributes
): Product | null => {
  const attrs = (item as StrapiItem<StrapiProductAttributes>)?.attributes ?? (item as StrapiProductAttributes);
  if (!attrs) return null;

  const image = Array.isArray(attrs.image) ? attrs.image[0] : attrs.image;
  const categorySlug =
    attrs.category?.data?.attributes?.slug ??
    attrs.category?.slug ??
    '';

  const discount =
    typeof attrs.discount === 'number'
      ? attrs.discount
      : attrs.oldPrice && attrs.price
        ? Math.round((1 - attrs.price / attrs.oldPrice) * 100)
        : undefined;

  return {
    id: (item as StrapiItem<StrapiProductAttributes>)?.id ?? attrs.slug ?? attrs.name ?? '',
    slug: attrs.slug ?? '',
    name: attrs.name ?? '',
    category: categorySlug,
    price: attrs.price ?? 0,
    oldPrice: attrs.oldPrice ?? undefined,
    rating: attrs.rating ?? 0,
    description: attrs.description ?? '',
    isHit: Boolean(attrs.isHit),
    isNew: Boolean(attrs.isNew),
    discount,
    image: getImageUrl(image) || '',
  };
};

const mockProducts = (type: ProductKey = 'all', categorySlug?: string): Product[] => {
  let base: Product[] =
    type === 'new'
      ? NEW_PRODUCTS
      : type === 'hit'
        ? HIT_PRODUCTS
        : [...CATALOG_PRODUCTS, ...HIT_PRODUCTS, ...NEW_PRODUCTS];

  if (categorySlug) {
    base = base.filter((p) => p.category === categorySlug);
  }

  // ensure image urls go through helper for consistency
  return base.map((p) => ({
    ...p,
    slug: p.slug ?? `product-${p.id}`,
    image: getImageUrl(p.image) || '',
  }));
};

export const fetchProducts = async (type: ProductKey = 'all', categorySlug?: string): Promise<Product[]> => {
  const cacheKey = `${type}:${categorySlug ?? 'all'}`;
  if (productCache[cacheKey]) return productCache[cacheKey];
  const existingPromise = productPromises[cacheKey];
  if (existingPromise) return existingPromise;

  if (USE_MOCK) {
    const data = mockProducts(type, categorySlug);
    productCache[cacheKey] = data;
    return data;
  }

  const typeFilters =
    type === 'hit'
      ? { isHit: { eq: true } }
      : type === 'new'
        ? { isNew: { eq: true } }
        : undefined;

  const filters = {
    ...(typeFilters || {}),
    ...(categorySlug ? { category: { slug: { eq: categorySlug } } } : {}),
  };

  const variables = Object.keys(filters).length > 0
    ? { filters, ...(type === 'new' ? { sort: ['createdAt:desc'] } : {}) }
    : (type === 'new' ? { sort: ['createdAt:desc'] } : {});

  const promise = graphqlClient.request<ProductsResponse>(GET_PRODUCTS, variables)
    .then((data) => {
      const raw = Array.isArray(data.products)
        ? data.products
        : Array.isArray((data.products as any)?.data)
          ? (data.products as any).data
          : [];

      const normalized = raw
        .map(normalizeProduct)
        .filter((p: Product | null): p is Product => Boolean(p));

      productCache[cacheKey] = normalized;
      return normalized;
    })
    .catch((e) => {
      console.warn(`Strapi products fetch failed (${type}, ${categorySlug || 'all'})`, e);
      return [];
    })
    .finally(() => {
      delete productPromises[cacheKey];
    });

  productPromises[cacheKey] = promise;
  return promise;
};
