import { Product } from '@/types';
import { getImageUrl } from '@/api';
import { graphqlClient } from '../client';
import { GET_PRODUCTS } from '../queries/products';
import { ProductsResponse, StrapiItem, StrapiProductAttributes } from '../types';
import { CATALOG_PRODUCTS, HIT_PRODUCTS, NEW_PRODUCTS } from '@/constants';

const USE_MOCK = true; // тимчасово вимикаємо Strapi, використовуємо тестові дані
const CACHE_TTL = 60_000; // 1 minute
const productCache: Record<string, { expiresAt: number; data: Product[] }> = {};
const productPromises: Record<string, Promise<Product[]> | null> = {};

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

const mockProducts = (type: 'all' | 'hit' | 'new' = 'all', categorySlug?: string): Product[] => {
  let base: Product[] =
    type === 'new'
      ? NEW_PRODUCTS
      : type === 'hit'
        ? HIT_PRODUCTS
        : [...CATALOG_PRODUCTS, ...HIT_PRODUCTS, ...NEW_PRODUCTS];

  if (categorySlug) {
    base = base.filter((p) => p.category === categorySlug);
  }

  return base.map((p) => ({
    ...p,
    slug: p.slug ?? `product-${p.id}`,
    image: getImageUrl(p.image) || '',
  }));
};

export const fetchProductsServer = async (type: 'all' | 'hit' | 'new' = 'all', categorySlug?: string): Promise<Product[]> => {
  const key = `${type}:${categorySlug ?? 'all'}`;
  const now = Date.now();
  const cached = productCache[key];
  if (cached && now < cached.expiresAt) {
    return cached.data;
  }
  const inFlight = productPromises[key];
  if (inFlight) return inFlight;

  if (USE_MOCK) {
    const data = mockProducts(type, categorySlug);
    productCache[key] = { data, expiresAt: Date.now() + CACHE_TTL };
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

  const promise = (async () => {
    const data = await graphqlClient.request<ProductsResponse>(GET_PRODUCTS, variables);
    const raw = Array.isArray(data.products)
      ? data.products
      : Array.isArray((data.products as any)?.data)
        ? (data.products as any).data
        : [];

    const normalized = raw
      .map(normalizeProduct)
      .filter((p: Product | null): p is Product => Boolean(p));

    productCache[key] = {
      data: normalized,
      expiresAt: Date.now() + CACHE_TTL,
    };
    return normalized;
  })().catch((error) => {
    console.warn(`Strapi products fetch failed (SSR: ${type}, ${categorySlug || 'all'})`, error);
    productCache[key] = {
      data: [],
      expiresAt: Date.now() + 10_000,
    };
    return [];
  }).finally(() => {
    productPromises[key] = null;
  });

  productPromises[key] = promise;
  return promise;
};

export const fetchProductBySlugServer = async (slug: string): Promise<Product | null> => {
  if (USE_MOCK) {
    const lowered = typeof slug === 'string' ? slug.toLowerCase() : '';
    const all = mockProducts('all');
    const match = all.find(
      (p) => p.slug?.toLowerCase() === lowered || String(p.id) === slug
    );
    return match ?? all[0] ?? null;
  }

  try {
    const variables = { filters: { slug: { eq: slug } } };
    const data = await graphqlClient.request<ProductsResponse>(GET_PRODUCTS, variables);
    const raw = Array.isArray(data.products)
      ? data.products
      : Array.isArray((data.products as any)?.data)
        ? (data.products as any).data
        : [];

    const normalized = raw
      .map(normalizeProduct)
      .filter((p: Product | null): p is Product => Boolean(p));

    return normalized[0] ?? null;
  } catch (error) {
    console.warn(`Strapi product fetch failed (slug: ${slug})`, error);
    return null;
  }
};
