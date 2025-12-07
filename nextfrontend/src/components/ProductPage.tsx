'use client';

import React, { useState } from 'react';
import { House, ChevronRight, Heart, Star, Minus, Plus, ShoppingBasket } from 'lucide-react';
import SidebarCategories from './SidebarCategories';
import SidebarWidgets from './SidebarWidgets';
import ProductCard from './ProductCard';
import { CATALOG_PRODUCTS } from '../constants';
import { useNavigation } from './NavigationContext';
import { useCart } from './CartContext';
import UiImage from './UiImage';

const RELATED_PRODUCTS = CATALOG_PRODUCTS.slice(0, 4);

const ProductPage: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const { navigateTo } = useNavigation();
  const { addToCart } = useCart();

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart({
      id: 999,
      name: "ХОЛОДИЛЬНИК SAMSUNG RB34T600",
      model: "Samsung_1",
      price: 87.00,
      quantity: quantity,
      image: "https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png"
    });
    // navigateTo('cart'); // Optional: redirect to cart or just stay on page
  };

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
      
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-amber-400 mb-8">
        <button onClick={() => navigateTo('home')}><House size={16} className="fill-gray-400 text-gray-400 hover:text-amber-500 hover:fill-amber-500 transition-colors" /></button>
        <ChevronRight size={14} className="text-gray-300" />
        <button onClick={() => navigateTo('catalog')} className="text-amber-500 font-medium hover:underline">Каталог</button>
        <ChevronRight size={14} className="text-gray-300" />
        <button onClick={() => navigateTo('catalog')} className="text-amber-500 font-medium hover:underline">Побутова техніка</button>
        <ChevronRight size={14} className="text-gray-300" />
        <button onClick={() => navigateTo('catalog')} className="text-amber-500 font-medium hover:underline">Холодильник</button>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-amber-500 font-medium">Холодильник Samsung RB34T600</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar */}
        <aside className="w-full lg:w-[270px] flex-shrink-0 hidden lg:block">
          <SidebarCategories />
          <SidebarWidgets />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          
          {/* Product Details Section */}
          <div className="bg-white rounded-sm mb-12">
            <div className="flex flex-col md:flex-row gap-8">
                
                {/* Images Column */}
                <div className="w-full md:w-1/2">
                    <div className="border border-gray-100 p-8 flex items-center justify-center mb-4 h-[400px]">
                        <UiImage
                          src="https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png"
                          alt="Main Product"
                          className="max-h-full object-contain"
                          width={700}
                          height={600}
                        />
                    </div>
                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((item) => (
                             <div key={item} className="border border-gray-200 p-2 h-20 flex items-center justify-center cursor-pointer hover:border-amber-400 transition-colors">
                                <UiImage
                                  src="https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png"
                                  alt={`Thumb ${item}`}
                                  className="max-h-full object-contain"
                                  width={120}
                                  height={120}
                                />
                             </div>
                        ))}
                    </div>
                </div>

                {/* Info Column */}
                <div className="w-full md:w-1/2 pt-2">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase leading-tight">
                            ХОЛОДИЛЬНИК SAMSUNG RB34T600
                        </h1>
                        <button className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-400 rounded-sm transition-colors flex-shrink-0 ml-4">
                            <Heart size={20} />
                        </button>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className="text-gray-200 fill-gray-200" />
                        ))}
                    </div>

                    {/* Price */}
                    <div className="text-4xl font-bold text-amber-500 mb-8">
                        $87.00
                    </div>

                    {/* Meta Data */}
                    <div className="space-y-3 mb-8 text-sm">
                        <div className="flex items-center">
                            <span className="text-gray-500 w-32">Бренд:</span>
                            <span className="text-gray-700">Samsung</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-500 w-32">Код товару:</span>
                            <span className="text-gray-700">Samsung_1</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-500 w-32">Доступність:</span>
                            <span className="text-gray-700 flex items-center gap-1">
                                <span className="w-3 h-3 border border-gray-400 flex items-center justify-center">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                </span>
                                В наявності
                            </span>
                        </div>
                    </div>

                    {/* Color */}
                    <div className="mb-8">
                        <span className="text-xs font-bold uppercase text-gray-900 block mb-3">Виберіть колір</span>
                        <button className="w-8 h-8 rounded-full bg-gray-300 ring-2 ring-offset-2 ring-transparent hover:ring-amber-400 focus:ring-amber-400 outline-none"></button>
                    </div>

                    {/* Quantity & Buy */}
                    <div className="mb-6">
                         <span className="text-xs font-bold uppercase text-gray-900 block mb-3">Кількість</span>
                         <div className="flex gap-4">
                             <div className="flex items-center border border-gray-200 bg-gray-50 rounded-sm">
                                 <button onClick={handleDecrease} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-amber-500">
                                     <Minus size={16} />
                                 </button>
                                 <input 
                                    type="text" 
                                    value={quantity} 
                                    readOnly 
                                    className="w-10 h-10 text-center bg-white text-sm font-bold text-gray-900 border-x border-gray-200 focus:outline-none"
                                 />
                                 <button onClick={handleIncrease} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-amber-500">
                                     <Plus size={16} />
                                 </button>
                             </div>
                             
                             <button 
                                onClick={handleAddToCart}
                                className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-xs px-8 py-3 rounded-sm transition-colors flex items-center gap-2"
                             >
                                <ShoppingBasket size={18} />
                                <span>Купити</span>
                             </button>
                         </div>
                    </div>

                </div>
            </div>

            {/* Description Tab */}
            <div className="mt-12 border-t border-gray-100 pt-8">
                <div className="flex gap-8 border-b border-gray-200 mb-6">
                    <button className="text-amber-500 font-bold uppercase text-sm border-b-2 border-amber-500 pb-2 -mb-[1px]">Опис</button>
                    <button className="text-gray-500 hover:text-gray-800 font-bold uppercase text-sm pb-2 transition-colors">Відгуки (0)</button>
                </div>
                <div className="text-gray-600 text-sm leading-relaxed space-y-4">
                    <p>Холодильник Samsung RB34T600 — це сучасний та надійний пристрій, який забезпечить ідеальні умови зберігання ваших продуктів. Завдяки технології All-Around Cooling холодне повітря рівномірно розподіляється по всій камері, підтримуючи постійну температуру.</p>
                    <p>Технологія SpaceMax™ дозволяє збільшити корисний об'єм холодильника без зміни зовнішніх розмірів завдяки тоншим стінкам з високоефективною теплоізоляцією.</p>
                </div>
            </div>

          </div>

          {/* Related Products */}
          <div className="mb-12">
            <h3 className="text-xl font-bold uppercase text-gray-900 mb-6">Схожі товари</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {RELATED_PRODUCTS.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>

        </main>

      </div>
    </div>
  );
};

export default ProductPage;
