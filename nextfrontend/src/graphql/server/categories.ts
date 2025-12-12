import { Category } from '@/types';
import { graphqlClient } from '../client';
import { GET_CATEGORIES } from '../queries/categories';
import { CategoriesResponse, StrapiCategoryAttributes, StrapiItem } from '../types';
import { getImageUrl } from '@/api';
import { CATEGORIES } from '@/constants';

const USE_MOCK = true; // тимчасово вимикаємо Strapi, використовуємо тестові дані
const CACHE_TTL = 60_000; // 1 minute
let cachedCategories: Category[] | null = null;
let cacheExpiresAt = 0;
let categoriesPromise: Promise<Category[]> | null = null;

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
  if (USE_MOCK) {
    if (!cachedCategories) {
      cachedCategories = CATEGORIES.map((c) => ({
        ...c,
        image: getImageUrl(c.image) || '',
      }));
    }
    return cachedCategories;
  }

  const now = Date.now();
  if (cachedCategories && now < cacheExpiresAt) {
    return cachedCategories;
  }
  if (categoriesPromise) {
    return categoriesPromise;
  }

  categoriesPromise = (async () => {
    try {
      const data = await graphqlClient.request<CategoriesResponse>(GET_CATEGORIES);
      const raw = Array.isArray(data.categories)
        ? data.categories
        : Array.isArray((data.categories as any)?.data)
          ? (data.categories as any).data
          : [];

      const normalized = raw
        .map(normalize)
        .filter((c: Category | null): c is Category => Boolean(c));

      cachedCategories = normalized;
      cacheExpiresAt = Date.now() + CACHE_TTL;
      return normalized;
    } catch (error) {
      console.warn('Strapi categories fetch failed (SSR). Using fallback.', error);
      const fallback = CATEGORIES.map((c) => ({
        ...c,
        image: getImageUrl(c.image) || '',
      }));
      cachedCategories = fallback;
      cacheExpiresAt = Date.now() + 30_000; // avoid hammering Strapi if it keeps failing
      return fallback;
    } finally {
      categoriesPromise = null;
    }
  })();

  return categoriesPromise;
};
