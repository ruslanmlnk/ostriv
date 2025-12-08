import { Product } from '@/types';
import { getImageUrl } from '@/api';
import { graphqlClient } from '../client';
import { GET_PRODUCTS } from '../queries/products';
import { ProductsResponse, StrapiItem, StrapiProductAttributes } from '../types';

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

export const fetchProductsServer = async (type: 'all' | 'hit' | 'new' = 'all', categorySlug?: string): Promise<Product[]> => {
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

  const data = await graphqlClient.request<ProductsResponse>(GET_PRODUCTS, variables);
  const raw = Array.isArray(data.products)
    ? data.products
    : Array.isArray((data.products as any)?.data)
      ? (data.products as any).data
      : [];

  return raw
    .map(normalizeProduct)
    .filter((p: Product | null): p is Product => Boolean(p));
};

export const fetchProductBySlugServer = async (slug: string): Promise<Product | null> => {
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
