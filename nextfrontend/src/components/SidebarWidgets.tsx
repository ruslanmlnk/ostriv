'use client';

import React from 'react';
import { Star } from 'lucide-react';

const POPULAR_ITEMS = [
  {
    id: 1,
    name: "Холодильник Samsung RB34T600",
    price: 85.00,
    oldPrice: 98.00,
    image: "https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png",
    rating: 5
  },
  {
    id: 2,
    name: "Стильний обідній стіл",
    price: 132.00,
    image: "https://i.ibb.co/PzTgLXN5/b0a73fcaf0bca244f75fc86dacff35ce5ea766ec.png",
    rating: 5
  },
  {
    id: 3,
    name: "Холодильник Samsung RB34T600",
    price: 98.00,
    image: "https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png",
    rating: 5
  },
  {
    id: 4,
    name: "Стильний обідній стіл",
    price: 76.00,
    image: "https://i.ibb.co/PzTgLXN5/b0a73fcaf0bca244f75fc86dacff35ce5ea766ec.png",
    rating: 5
  }
];

const SidebarWidgets: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Popular Products Widget */}
      <div className="w-full border border-gray-100 rounded-sm bg-white">
        <div className="bg-amber-400 p-4">
          <h3 className="text-white font-bold uppercase text-xs tracking-widest">ПОПУЛЯРНІ ТОВАРИ</h3>
        </div>
        <div className="p-4 flex flex-col gap-4">
          {POPULAR_ITEMS.map((item) => (
            <div key={item.id} className="flex gap-4 border-b border-gray-50 last:border-0 pb-4 last:pb-0">
              <div className="w-16 h-16 flex-shrink-0 border border-gray-100 p-1 flex items-center justify-center">
                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[11px] font-bold text-gray-800 uppercase leading-tight mb-1">{item.name}</h4>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className={i < item.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-sm">${item.price.toFixed(2)}</span>
                  {item.oldPrice && (
                    <span className="text-gray-300 text-xs line-through">${item.oldPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Widget */}
      <div className="w-full bg-gray-100 p-4 border border-gray-100 rounded-sm">
        <div className="mb-4 overflow-hidden rounded-sm">
           <img 
             src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
             alt="Promo" 
             className="w-full h-40 object-cover"
           />
        </div>
        <h3 className="text-sm font-bold uppercase text-gray-900 mb-2 leading-tight text-center">
            ЗАРОБЛЯЙТЕ РАЗОМ З НАМИ – БЕЗ СКЛАДУ ТА РИЗИКІ
        </h3>
        <p className="text-[11px] text-gray-500 text-center mb-4 leading-relaxed">
            Продавайте наші товари на ваших сайтах або маркетплейсах — ми беремо на себе логістику та відправку, а ви отримуєте відсоток з кожного продажу
        </p>
        <form className="flex flex-col gap-2">
            <input 
                type="email" 
                placeholder="Введіть вашу пошту" 
                className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
            />
            <button type="submit" className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-[10px] px-4 py-3 rounded-sm transition-colors w-full">
                НАДІСЛАТИ ЗАЯВКУ
            </button>
        </form>
      </div>

    </div>
  );
};

export default SidebarWidgets;
