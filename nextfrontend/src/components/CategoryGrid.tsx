'use client';

import React from 'react';
import SectionHeader from './SectionHeader';
import { useNavigation } from './NavigationContext';
import { getImageUrl } from '../api';
import { useCategories } from './useCategories';
import UiImage from './UiImage';

const CategoryGrid: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { categories } = useCategories();

  return (
    <section className="w-full max-w-[1352px] mx-auto px-4 py-16">
      <SectionHeader subtitle="Найкращі колекції" title="Популярні категорії товарів" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="group bg-white border border-gray-100 rounded-sm p-6 flex items-center shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-[180px]"
            onClick={() => navigateTo('catalog')}
          >
            {/* Image Side - Left */}
            <div className="w-[40%] flex justify-center items-center h-full">
              <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <UiImage
                  src={getImageUrl(cat.image)}
                  alt={cat.title}
                  className="max-h-full max-w-full object-contain"
                  width={400}
                  height={300}
                  sizes="33vw"
                />
              </div>
            </div>
            
            {/* Content Side - Right */}
            <div className="w-[60%] pl-6 flex flex-col justify-center items-start gap-4 h-full">
              <h3 className="font-bold text-[#282828] uppercase text-[13px] leading-tight tracking-wide group-hover:text-amber-500 transition-colors">
                  {cat.title}
              </h3>
              
              <button 
                className="bg-[#282828] text-white text-[10px] uppercase font-bold py-3 px-4 rounded-[2px] group-hover:bg-amber-400 transition-colors w-full text-center"
              >
                Дивитися детальніше
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;

