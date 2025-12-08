'use client';

import { Category } from '@/types';
import { graphqlClient } from '../client';
import { GET_CATEGORIES } from '../queries/categories';
import type { CategoriesResponse, StrapiCategoryAttributes, StrapiItem } from '../types';
import { getImageUrl } from '@/api';

let cachedCategories: Category[] | null = null;
let categoriesPromise: Promise<Category[]> | null = null;

const normalizeCategory = (
  item: StrapiItem<StrapiCategoryAttributes> | StrapiCategoryAttributes
): Category | null => {
  const attrs = (item as StrapiItem<StrapiCategoryAttributes>)?.attributes ?? (item as StrapiCategoryAttributes);
  if (!attrs) return null;

  return {
    id: (item as StrapiItem<StrapiCategoryAttributes>)?.id ?? attrs.slug ?? attrs.title ?? '',
    title: attrs.title ?? '',
    slug: attrs.slug ?? '',
    image: getImageUrl(attrs.image) || '',
  };
};

export const fetchCategories = async (): Promise<Category[]> => {
  if (cachedCategories && cachedCategories.length > 0) return cachedCategories;
  if (categoriesPromise) return categoriesPromise;

  categoriesPromise = (async () => {
    try {
      const data = await graphqlClient.request<CategoriesResponse>(GET_CATEGORIES);
      const raw = Array.isArray(data.categories)
        ? data.categories
        : Array.isArray((data.categories as any)?.data)
          ? (data.categories as any).data
          : [];

      const normalized = raw
        .map(normalizeCategory)
        .filter((c: Category | null): c is Category => Boolean(c));

      cachedCategories = normalized;
      return normalized;
    } catch (error) {
      console.warn('Strapi categories fetch failed', error);
      cachedCategories = [];
      return [];
    } finally {
      categoriesPromise = null;
    }
  })();

  return categoriesPromise;
};
