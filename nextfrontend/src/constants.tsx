import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headset } from 'lucide-react';
import { Category, Product, Feature } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 1,
    title: "М'ЯКІ МЕБЛІ",
    image: "https://i.ibb.co/Pp5tfZL/a65428f5785f31c2edb75c5da6a847f64db00fed.png",
    slug: "soft-furniture"
  },
  {
    id: 2,
    title: "МЕБЛІ ДЛЯ СПАЛЬНІ",
    image: "https://i.ibb.co/PzTgLXN5/b0a73fcaf0bca244f75fc86dacff35ce5ea766ec.png",
    slug: "bedroom"
  },
  {
    id: 3,
    title: "МЕБЛІ ДЛЯ КУХНІ",
    image: "https://i.ibb.co/srbqQRr/1155239bcb52eb213567e6ef78b15fafe9b01b4d.png",
    slug: "kitchen"
  },
  {
    id: 4,
    title: "ОСВІТЛЕННЯ",
    image: "https://i.ibb.co/Q7MLWqqV/edd84ac5269ae39ed5ce923f5c9df85d0e4e6537.png",
    slug: "lighting"
  },
  {
    id: 5,
    title: "СИСТЕМИ ЗБЕРІГАННЯ",
    image: "https://i.ibb.co/sJ1qtbZ5/5a1fe2c3698e634fe0106d4972a652e09f0cebca.png",
    slug: "storage"
  },
  {
    id: 6,
    title: "ПОБУТОВА ТЕХНІКА",
    image: "https://i.ibb.co/7N0sYgK5/f162aa39f68011883e86a0aebdcfe6262b522bfc.png",
    slug: "appliances"
  }
];

const BASE_HIT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "СТИЛЬНИЙ ОБІДНІЙ СТІЛ",
    category: "Столи",
    price: 85.00,
    oldPrice: 98.00,
    rating: 5,
    discount: 13,
    image: "https://i.ibb.co/PzTgLXN5/b0a73fcaf0bca244f75fc86dacff35ce5ea766ec.png"
  },
  {
    id: 2,
    name: "ХОЛОДИЛЬНИК SAMSUNG RB34T600",
    category: "Техніка",
    price: 98.00,
    rating: 4,
    image: "https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png"
  },
  {
    id: 3,
    name: "СТИЛЬНИЙ ОБІДНІЙ СТІЛ",
    category: "Столи",
    price: 98.00,
    rating: 5,
    image: "https://i.ibb.co/PzTgLXN5/b0a73fcaf0bca244f75fc86dacff35ce5ea766ec.png"
  },
  {
    id: 4,
    name: "ХОЛОДИЛЬНИК SAMSUNG RB34T600",
    category: "Техніка",
    price: 98.00,
    rating: 5,
    image: "https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png"
  },
];

// Duplicate items to make the slider scrollable (e.g., 3x the base list)
export const HIT_PRODUCTS: Product[] = [
  ...BASE_HIT_PRODUCTS,
  ...BASE_HIT_PRODUCTS.map(p => ({ ...p, id: (p.id as number) + 100 })), // unique IDs
  ...BASE_HIT_PRODUCTS.map(p => ({ ...p, id: (p.id as number) + 200 })),
  ...BASE_HIT_PRODUCTS.map(p => ({ ...p, id: (p.id as number) + 300 }))
];

export const NEW_PRODUCTS: Product[] = HIT_PRODUCTS.slice(0, 8);

export const CATALOG_PRODUCTS: Product[] = [
  {
    id: 101,
    name: "ХОЛОДИЛЬНИК SAMSUNG RB34T600",
    category: "Техніка",
    price: 85.00,
    oldPrice: 98.00,
    rating: 5,
    image: "https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png"
  },
  {
    id: 102,
    name: "ХОЛОДИЛЬНИК SAMSUNG RB34T600",
    category: "Техніка",
    price: 98.00,
    rating: 5,
    image: "https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png"
  },
  {
    id: 103,
    name: "ХОЛОДИЛЬНИК SAMSUNG RB34T600",
    category: "Техніка",
    price: 98.00,
    rating: 5,
    image: "https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png"
  },
  {
    id: 104,
    name: "ХОЛОДИЛЬНИК SAMSUNG RB34T600",
    category: "Техніка",
    price: 98.00,
    rating: 5,
    image: "https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png"
  },
  {
    id: 105,
    name: "ХОЛОДИЛЬНИК SAMSUNG RB34T600",
    category: "Техніка",
    price: 98.00,
    rating: 5,
    image: "https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png"
  },
  {
    id: 106,
    name: "ХОЛОДИЛЬНИК SAMSUNG RB34T600",
    category: "Техніка",
    price: 98.00,
    rating: 5,
    image: "https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png"
  },
  {
    id: 107,
    name: "ХОЛОДИЛЬНИК SAMSUNG RB34T600",
    category: "Техніка",
    price: 98.00,
    rating: 5,
    image: "https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png"
  },
  {
    id: 108,
    name: "ХОЛОДИЛЬНИК SAMSUNG RB34T600",
    category: "Техніка",
    price: 98.00,
    rating: 5,
    image: "https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png"
  },
  {
    id: 109,
    name: "ХОЛОДИЛЬНИК SAMSUNG RB34T600",
    category: "Техніка",
    price: 98.00,
    rating: 5,
    image: "https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png"
  }
];


export const FEATURES: Feature[] = [
  {
    icon: <Truck size={32} className="text-amber-500" />,
    title: "БЕЗКОШТОВНА ДОСТАВКА",
    description: "На всі замовлення понад $99.00"
  },
  {
    icon: <RotateCcw size={32} className="text-amber-500" />,
    title: "30 ДНІВ ПОВЕРНЕННЯ",
    description: "У вас є 30 днів на повернення"
  },
  {
    icon: <ShieldCheck size={32} className="text-amber-500" />,
    title: "БЕЗПЕЧНІ ПОКУПКИ",
    description: "Оплата повністю безпечна"
  },
  {
    icon: <Headset size={32} className="text-amber-500" />,
    title: "ОНЛАЙН-ПІДТРИМКА",
    description: "Звертайтеся до нас цілодобово"
  }
];