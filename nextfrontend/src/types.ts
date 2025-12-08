import React from 'react';

export interface Media {
  id: string;
  url: string;
  alt: string;
}

export interface Product {
  id: number | string; // Payload IDs are usually strings
  slug?: string;
  name: string;
  category: string; // Or Category object if populated
  price: number;
  oldPrice?: number;
  image: string | Media; // Can be URL string or Payload Media object
  rating: number;
  isNew?: boolean;
  isHit?: boolean;
  discount?: number;
  description?: string;
}

export interface Category {
  id: number | string;
  title: string;
  image: string | Media;
  slug: string;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface CartItem {
  id: number | string;
  name: string;
  model: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderData {
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  delivery: {
    city: string;
    warehouse: string;
    method: string;
  };
  paymentMethod: string;
  items: {
    product_id: string | number;
    quantity: number;
  }[];
  total: number;
}
