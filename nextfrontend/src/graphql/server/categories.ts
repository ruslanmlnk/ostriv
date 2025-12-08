import { Category } from '@/types';
import { graphqlClient } from '../client';
import { GET_CATEGORIES } from '../queries/categories';
import { CategoriesResponse, StrapiCategoryAttributes, StrapiItem } from '../types';
import { getImageUrl } from '@/api';
import { CATEGORIES } from '@/constants';

const normalize = (item: StrapiItem<StrapiCategoryAttributes> | StrapiCategoryAttributes): Category | null => {
  const attrs = (item as StrapiItem<StrapiCategoryAttributes>)?.attributes ?? (item as StrapiCategoryAttributes);
  if (!attrs) return null;
  return {
    id: (item as StrapiItem<StrapiCategoryAttributes>)?.id ?? attrs.slug ?? attrs.title ?? '',
    title: attrs.title ?? '',
    slug: attrs.slug ?? '',
    image: getImageUrl(attrs.image) || '',
  };
};

export const fetchCategoriesServer = async (): Promise<Category[]> => {
  try {
    const data = await graphqlClient.request<CategoriesResponse>(GET_CATEGORIES);
    const raw = Array.isArray(data.categories)
      ? data.categories
      : Array.isArray((data.categories as any)?.data)
        ? (data.categories as any).data
        : [];

    return raw
      .map(normalize)
      .filter((c: Category | null): c is Category => Boolean(c));
  } catch (error) {
    console.warn('Strapi categories fetch failed (SSR). Using fallback.', error);
    return CATEGORIES.map((c) => ({
      ...c,
      image: getImageUrl(c.image) || '',
    }));
  }
};
