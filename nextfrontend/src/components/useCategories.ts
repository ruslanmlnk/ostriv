'use client';

import { useEffect, useState } from 'react';
import { api } from '../api';
import { Category } from '../types';

let cachedCategories: Category[] | null = null;
let categoriesPromise: Promise<Category[]> | null = null;

const fetchCategories = async (): Promise<Category[]> => {
  if (cachedCategories && cachedCategories.length > 0) return cachedCategories;

  if (!categoriesPromise) {
    categoriesPromise = api.getCategories().then((data) => {
      if (data.length > 0) {
        cachedCategories = data;
      } else {
        cachedCategories = null;
      }
      return data;
    }).finally(() => {
      categoriesPromise = null;
    });
  }

  return categoriesPromise;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(cachedCategories || []);
  const [loading, setLoading] = useState(!cachedCategories || cachedCategories.length === 0);

  useEffect(() => {
    let isActive = true;

    if (!cachedCategories || cachedCategories.length === 0) {
      setLoading(true);
      fetchCategories()
        .then((data) => {
          if (isActive) setCategories(data);
        })
        .catch(() => {})
        .finally(() => {
          if (isActive) setLoading(false);
        });
    }

    return () => {
      isActive = false;
    };
  }, []);

  return { categories, loading };
};

