export type PayloadID = string | number;

export interface PayloadMedia {
  id?: PayloadID;
  url?: string | null;
  filename?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  sizes?: Record<string, { url?: string | null }>;
}

export interface PayloadCategory {
  id?: PayloadID;
  title?: string | null;
  slug?: string | null;
  image?: PayloadMedia | string | null;
}

export interface PayloadProduct {
  id?: PayloadID;
  slug?: string | null;
  name?: string | null;
  price?: number | null;
  oldPrice?: number | null;
  rating?: number | null;
  description?: string | null;
  isHit?: boolean | null;
  isNew?: boolean | null;
  discount?: number | null;
  image?: PayloadMedia | PayloadMedia[] | string | null;
  category?: PayloadCategory | PayloadID | null;
}

export interface PayloadListResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages?: number;
  page?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface CreateOrderResponse {
  doc?: {
    id?: PayloadID;
  };
  id?: PayloadID;
}
