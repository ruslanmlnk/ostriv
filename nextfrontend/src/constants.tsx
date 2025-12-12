import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headset } from 'lucide-react';
import { Category, Product, Feature } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 1,
    title: 'Мʼякі меблі',
    image: 'https://i.ibb.co/Pp5tfZL/a65428f5785f31c2edb75c5da6a847f64db00fed.png',
    slug: 'soft-furniture',
  },
  {
    id: 2,
    title: 'Спальня',
    image: 'https://i.ibb.co/PzTgLXN5/b0a73fcaf0bca244f75fc86dacff35ce5ea766ec.png',
    slug: 'bedroom',
  },
  {
    id: 3,
    title: 'Кухня',
    image: 'https://i.ibb.co/srbqQRr/1155239bcb52eb213567e6ef78b15fafe9b01b4d.png',
    slug: 'kitchen',
  },
  {
    id: 4,
    title: 'Освітлення',
    image: 'https://i.ibb.co/Q7MLWqqV/edd84ac5269ae39ed5ce923f5c9df85d0e4e6537.png',
    slug: 'lighting',
  },
  {
    id: 5,
    title: 'Системи зберігання',
    image: 'https://i.ibb.co/sJ1qtbZ5/5a1fe2c3698e634fe0106d4972a652e09f0cebca.png',
    slug: 'storage',
  },
  {
    id: 6,
    title: 'Техніка',
    image: 'https://i.ibb.co/7N0sYgK5/f162aa39f68011883e86a0aebdcfe6262b522bfc.png',
    slug: 'appliances',
  },
];

const BASE_HIT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Диван Lounge Nova',
    slug: 'lounge-sofa-nova',
    category: 'soft-furniture',
    price: 850,
    oldPrice: 980,
    rating: 5,
    discount: 13,
    description: `Диван Lounge Nova — це модульне рішення для вітальні з мʼякими подушками та легкою на догляд тканиною.

Основні переваги:
- Конфігурація з незалежними модулями: збирайте кутову чи пряму форму
- Оббивка easy-clean: плями легко видаляються, тканина стійка до зношування
- Міцний каркас і дубові ніжки для довговічності
- Знімні чохли подушок для швидкого догляду
- Підходить для квартир-студій і великих просторів`,
    image: 'https://i.ibb.co/PzTgLXN5/b0a73fcaf0bca244f75fc86dacff35ce5ea766ec.png',
  },
  {
    id: 2,
    name: 'Холодильник Samsung RB34T600',
    slug: 'samsung-rb34t600',
    category: 'appliances',
    price: 980,
    rating: 4,
    description: `Холодильник Samsung RB34T600 — сучасне рішення для зручного та енергоефективного зберігання продуктів.

Система No Frost прибирає потребу в розморожуванні, а технологія All-Around Cooling рівномірно охолоджує полиці. Тихий інверторний компресор майже не чути — ідеально для квартир-студій.

Переваги:
- Рівномірне охолодження All-Around Cooling
- Технологія No Frost без розморожування
- Енергоефективний інверторний компресор
- Стильний мінімалістичний дизайн
- Продумана організація простору: місткі полиці, ящик для овочів і фруктів
- Низький рівень шуму та економне споживання енергії`,
    image: 'https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png',
  },
  {
    id: 3,
    name: 'Кутовий диван Breeze',
    slug: 'corner-sofa-breeze',
    category: 'soft-furniture',
    price: 990,
    rating: 5,
    description: `Кутовий диван Breeze — компактне рішення для вітальні з додатковим місцем зберігання.

Переваги:
- L-подібна форма, що економить простір
- Ящик для пледів і подушок під сидінням
- Льняна оббивка, приємна на дотик, знімається для чистки
- Посилений каркас і пружинний блок для комфортної посадки
- Легко розмістити біля стіни або у відкритому просторі`,
    image: 'https://i.ibb.co/PzTgLXN5/b0a73fcaf0bca244f75fc86dacff35ce5ea766ec.png',
  },
  {
    id: 4,
    name: 'Духова шафа Samsung NV7B',
    slug: 'samsung-oven-nv7b',
    category: 'appliances',
    price: 640,
    rating: 5,
    description: `Духова шафа Samsung NV7B — вбудована електродуховка для сімейного приготування.

Переваги:
- Dual Cook: одночасне приготування двох страв при різних температурах
- Парове очищення — без зайвих миючих засобів
- Точний електронний контроль температури
- Швидкий розігрів і рівномірне пропікання
- Захисне скло та зручні телескопічні напрямні`,
    image: 'https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png',
  },
];

export const HIT_PRODUCTS: Product[] = [
  ...BASE_HIT_PRODUCTS,
  ...BASE_HIT_PRODUCTS.map((p) => ({ ...p, id: (p.id as number) + 100, slug: `${p.slug}-2` })),
  ...BASE_HIT_PRODUCTS.map((p) => ({ ...p, id: (p.id as number) + 200, slug: `${p.slug}-3` })),
  ...BASE_HIT_PRODUCTS.map((p) => ({ ...p, id: (p.id as number) + 300, slug: `${p.slug}-4` })),
];

export const NEW_PRODUCTS: Product[] = HIT_PRODUCTS.slice(0, 8);

export const CATALOG_PRODUCTS: Product[] = [
  {
    id: 101,
    name: 'Ліжко Oslo',
    slug: 'bed-frame-oslo',
    category: 'bedroom',
    price: 320,
    oldPrice: 360,
    rating: 5,
    description: `Ліжко Oslo — масив дерева з мʼяким узголівʼям та шухлядами для зберігання.

- Міцний каркас із натурального дерева
- Узголівʼя з мʼякою оббивкою, приємною для спини
- Дві глибокі шухляди на роликах для постелі чи речей
- Підходить під стандартні матраци 160/180 см
- Лаконічний скандинавський дизайн`,
    image: 'https://i.ibb.co/PzTgLXN5/b0a73fcaf0bca244f75fc86dacff35ce5ea766ec.png',
  },
  {
    id: 102,
    name: 'Кухонний гарнітур Linea',
    slug: 'kitchen-set-linea',
    category: 'kitchen',
    price: 890,
    rating: 4,
    description: `Кухонний гарнітур Linea — модульна система з матовими фасадами.

- Софт-клоуз фурнітура на всіх шухлядах і шафах
- Стійкі до подряпин матові фасади
- Можливість адаптувати під кутові та лінійні планування
- Антиплесеньове покриття корпусу
- Продумана ергономіка: висувні каруселі й органайзери`,
    image: 'https://i.ibb.co/srbqQRr/1155239bcb52eb213567e6ef78b15fafe9b01b4d.png',
  },
  {
    id: 103,
    name: 'Підвіс Halo',
    slug: 'lamp-halo',
    category: 'lighting',
    price: 120,
    rating: 4,
    description: `Підвіс Halo — мінімалістичний світильник із теплим LED та димером.

- Регулювання яскравості димером
- Теплий рівномірний світловий потік
- Легка алюмінієва конструкція, що не провисає
- Підходить для кухні, столової чи робочої зони`,
    image: 'https://i.ibb.co/Q7MLWqqV/edd84ac5269ae39ed5ce923f5c9df85d0e4e6537.png',
  },
  {
    id: 104,
    name: 'Шафа-купе City',
    slug: 'wardrobe-city',
    category: 'storage',
    price: 540,
    rating: 5,
    description: `Шафа-купе City — дзеркальні фасади та змінна конфігурація полиць.

- Розсувна система на тихих роликах
- Дзеркальні двері візуально розширюють простір
- Регульовані полиці й штанги під різний гардероб
- Антиударна кромка й посилений каркас
- Підійде для спальні чи передпокою`,
    image: 'https://i.ibb.co/sJ1qtbZ5/5a1fe2c3698e634fe0106d4972a652e09f0cebca.png',
  },
  {
    id: 105,
    name: 'Тумба Duo',
    slug: 'nightstand-duo',
    category: 'bedroom',
    price: 95,
    rating: 4,
    description: `Тумба Duo — компактна приліжкова тумба з двома шухлядами.

- Фурнітура з доводчиками для тихого закривання
- Стійке покриття, що не боїться подряпин
- Оптимальна висота для більшості ліжок
- Дві місткі шухляди для речей першої потреби`,
    image: 'https://i.ibb.co/Pp5tfZL/a65428f5785f31c2edb75c5da6a847f64db00fed.png',
  },
  {
    id: 106,
    name: 'Стіл Loft',
    slug: 'dining-table-loft',
    category: 'kitchen',
    price: 260,
    rating: 5,
    description: `Стіл Loft — дубова стільниця на металевих ніжках для 4–6 осіб.

- Натуральна дубова стільниця з масиву
- Порошкове покриття металевих ніжок стійке до подряпин
- Сучасний лофт-дизайн під різні інтер’єри
- Легка збірка та стабільна конструкція`,
    image: 'https://i.ibb.co/srbqQRr/1155239bcb52eb213567e6ef78b15fafe9b01b4d.png',
  },
  {
    id: 107,
    name: 'Торшер Arc',
    slug: 'floor-lamp-arc',
    category: 'lighting',
    price: 150,
    rating: 4,
    description: `Торшер Arc — аркова опора з тканинним абажуром і масивною підставкою.

- Мʼяке розсіяне світло для зони відпочинку
- Важка основа для стійкості, не хилиться
- Абажур зі щільної тканини, легко чиститься
- Регулювання напрямку світла`,
    image: 'https://i.ibb.co/Q7MLWqqV/edd84ac5269ae39ed5ce923f5c9df85d0e4e6537.png',
  },
  {
    id: 108,
    name: 'Комора Frame',
    slug: 'cabinet-frame',
    category: 'storage',
    price: 310,
    rating: 4,
    description: `Комора Frame — металева каркасна шафа для зберігання.

- Регульовані полиці під коробки, інструменти чи побутову техніку
- Посилений металевий каркас і вентиляційні отвори
- Полімерне покриття, що не боїться вологи
- Підійде для комори, гаража чи підсобки`,
    image: 'https://i.ibb.co/sJ1qtbZ5/5a1fe2c3698e634fe0106d4972a652e09f0cebca.png',
  },
  {
    id: 109,
    name: 'Блендер MixPro',
    slug: 'blender-mixpro',
    category: 'appliances',
    price: 70,
    rating: 4,
    description: `Блендер MixPro — потужний стаціонарний блендер зі скляною колбою.

- 5 автоматичних режимів + імпульсний режим
- Скляна колба 1.5 л, не вбирає запахи
- Ножі з нержавіючої сталі для льоду й горіхів
- Прогумовані ніжки для стійкості на стільниці`,
    image: 'https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png',
  },
];

export const FEATURES: Feature[] = [
  {
    icon: <Truck size={32} className="text-amber-500" />,
    title: 'Безкоштовна доставка',
    description: 'По місту при замовленні від $99.00.',
  },
  {
    icon: <RotateCcw size={32} className="text-amber-500" />,
    title: '30 днів на повернення',
    description: 'Просте повернення протягом 30 днів.',
  },
  {
    icon: <ShieldCheck size={32} className="text-amber-500" />,
    title: 'Гарантійна підтримка',
    description: 'Офіційна гарантія на всі товари.',
  },
  {
    icon: <Headset size={32} className="text-amber-500" />,
    title: 'Жива допомога',
    description: 'Консультації з менеджером щодня.',
  },
];
