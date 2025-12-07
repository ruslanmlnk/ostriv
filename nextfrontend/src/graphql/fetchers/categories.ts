'use client';

import { Category } from '@/types';
import { graphqlClient } from '../client';
import { GET_CATEGORIES } from '../queries/categories';
import type { CategoriesResponse, StrapiCategoryAttributes, StrapiItem } from '../types';

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const data = await graphqlClient.request<CategoriesResponse>(GET_CATEGORIES);
    const raw = Array.isArray(data.categories)
      ? data.categories
      : Array.isArray((data.categories as any)?.data)
        ? (data.categories as any).data
        : [];

    return raw;
  } catch (error) {
    console.warn('Strapi categories fetch failed', error);
    return [];
  }
};
