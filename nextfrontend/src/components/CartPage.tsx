'use client';

import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from './CartContext';
import { useNavigation } from './NavigationContext';
import UiImage from './UiImage';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart();
  const { navigateTo } = useNavigation();

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold uppercase text-gray-900 mb-8">КОШИК</h1>

      <div className="w-full">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 bg-[#2a2a2a] text-white p-4 text-sm font-bold uppercase rounded-t-sm">
          <div className="col-span-3">Зображення товару</div>
          <div className="col-span-3">Назва товару</div>
          <div className="col-span-2">Модель</div>
          <div className="col-span-2">Кількість</div>
          <div className="col-span-2">Ціна</div>
        </div>

        {/* Cart Items */}
        <div className="bg-white border border-gray-200 border-t-0 rounded-b-sm">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 border-b border-gray-100 last:border-0">
              
              {/* Image */}
              <div className="col-span-1 md:col-span-3 flex justify-center md:justify-start">
                <div className="w-24 h-32 flex items-center justify-center">
                   <UiImage src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" width={200} height={260} />
                </div>
              </div>

              {/* Name */}
              <div className="col-span-1 md:col-span-3">
                 <span className="md:hidden font-bold mr-2 text-xs uppercase text-gray-500">Назва:</span>
                 <span className="font-bold text-gray-900 text-sm">{item.name}</span>
              </div>

              {/* Model */}
              <div className="col-span-1 md:col-span-2">
                 <span className="md:hidden font-bold mr-2 text-xs uppercase text-gray-500">Модель:</span>
                 <span className="font-bold text-gray-900 text-sm">{item.model}</span>
              </div>

              {/* Quantity */}
              <div className="col-span-1 md:col-span-2 flex items-center">
                 <span className="md:hidden font-bold mr-2 text-xs uppercase text-gray-500">Кількість:</span>
                 <div className="flex items-center bg-[#EDEDED] rounded-sm">
                    <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <Minus size={14} />
                    </button>
                    <input 
                        type="text" 
                        value={item.quantity} 
                        readOnly
                        className="w-10 h-10 bg-white text-center text-sm font-bold text-gray-900 border-x border-gray-200 focus:outline-none"
                    />
                    <button 
                         onClick={() => updateQuantity(item.id, 1)}
                         className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                 </div>
              </div>

              {/* Price & Remove */}
              <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-start gap-8">
                 <div>
                    <span className="md:hidden font-bold mr-2 text-xs uppercase text-gray-500">Ціна:</span>
                    <span className="font-bold text-gray-900 text-sm whitespace-nowrap">$ {item.price}</span>
                 </div>
                 <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-amber-400 hover:text-amber-500 transition-colors"
                 >
                    <X size={20} strokeWidth={1.5} />
                 </button>
              </div>

            </div>
          ))}
          {items.length === 0 && (
              <div className="p-8 text-center text-gray-500">Кошик порожній</div>
          )}
        </div>

        {/* Total Bar */}
        <div className="bg-amber-400 text-white font-bold uppercase p-4 pr-12 flex justify-end items-center gap-12 rounded-sm mt-[-1px] relative z-10">
            <span className="text-sm">Усього</span>
            <span className="text-xl">$ {totalAmount.toLocaleString().replace(/,/g, ' ')}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
            <button 
                onClick={() => navigateTo('catalog')}
                className="bg-[#8C8C8C] hover:bg-[#777] text-white font-bold uppercase text-xs px-8 py-4 rounded-sm transition-colors w-full md:w-auto"
            >
                ПРОДОВЖИТИ ПОКУПКИ
            </button>
            <button 
                onClick={() => navigateTo('checkout')}
                className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-xs px-8 py-4 rounded-sm shadow-md hover:shadow-lg transition-colors w-full md:w-auto"
            >
                ОФОРМИТИ ЗАМОВЛЕННЯ
            </button>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
