import { Category, Product } from "@/types";

// Raw Strapi media shape
export interface StrapiMedia {
  data?: {
    attributes?: {
      url?: string;
      width?: number | null;
      height?: number | null;
      alternativeText?: string | null;
    } | null;
  } | null;
  url?: string;
  width?: number | null;
  height?: number | null;
}

export interface StrapiCategoryAttributes {
  title?: string | null;
  slug?: string | null;
  image?: StrapiMedia | string | null;
}

export interface StrapiProductAttributes {
  slug?: string | null;
  name?: string | null;
  price?: number | null;
  oldPrice?: number | null;
  rating?: number | null;
  description?: string | null;
  isHit?: boolean | null;
  isNew?: boolean | null;
  discount?: number | null;
  image?: StrapiMedia | StrapiMedia[] | string | null;
  category?: {
    slug?: string | null;
    data?: {
      attributes?: StrapiCategoryAttributes | null;
    } | null;
  } | null;
}

export interface StrapiItem<T> {
  id?: string | number | null;
  attributes?: T | null;
}

export interface CategoriesResponse {
  categories?: StrapiCategoryAttributes[] | { data?: StrapiItem<StrapiCategoryAttributes>[] | null };
}

export interface ProductsResponse {
  products?: StrapiProductAttributes[] | { data?: StrapiItem<StrapiProductAttributes>[] | null };
}

export interface CreateOrderResponse {
  createOrder?: {
    data?: {
      id?: string | number;
      attributes?: {
        total?: number;
      } | null;
    } | null;
  } | null;
}

export type NormalizedCategory = Category;
export type NormalizedProduct = Product;

export type OrderInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  warehouse: string;
  paymentMethod: string;
  total: number;
  items: string;
};
