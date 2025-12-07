'use client';

import React, { useEffect, useState } from 'react';
import SidebarFilters from './SidebarFilters';
import ProductCard from './ProductCard';
import { api } from '../api';
import { Product } from '../types';
import { House, ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigation } from './NavigationContext';

const CatalogPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await api.getProducts('all');
      setProducts(data);
    };
    loadProducts();
  }, []);

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-amber-400 mb-8">
        <button onClick={() => navigateTo('home')}><House size={16} className="fill-gray-400 text-gray-400 hover:text-amber-500 hover:fill-amber-500 transition-colors" /></button>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-amber-500 font-medium">Каталог</span>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-amber-500 font-medium">Побутова техніка</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-[270px] flex-shrink-0">
          <SidebarFilters />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          
          {/* Header & Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Побутова техніка</h1>
            
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-800">Сортувати за:</span>
                <div className="relative border border-gray-200 rounded-sm bg-white px-3 py-1.5 min-w-[140px] flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-gray-600">От А до Я</span>
                    <ChevronDown size={14} className="text-amber-500" />
                </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {products.length > 0 ? (
                products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))
            ) : (
                <div className="col-span-3 py-10 text-center text-gray-500">Завантаження товарів...</div>
            )}
          </div>
          
          <div className="flex justify-center mt-12">
            <button className="bg-amber-400 text-white font-bold uppercase text-xs px-8 py-3 rounded-sm hover:bg-amber-500 transition-colors shadow-md hover:shadow-lg">
                Показати ще товари
            </button>
          </div>

        </main>

      </div>
    </div>
  );
};

export default CatalogPage;
