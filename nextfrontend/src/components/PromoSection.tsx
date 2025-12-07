'use client';

import React from 'react';

const PromoSection: React.FC = () => {
  return (
    <section className="bg-gray-100 py-16 my-10">
      <div className="w-full max-w-[1352px] mx-auto px-4 flex flex-col md:flex-row items-stretch">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2 pr-0 md:pr-12 flex flex-col justify-center mb-8 md:mb-0">
            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-2">Станьте партнером нашого магазину меблів та товарів для дому!</span>
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-gray-900 mb-6 leading-tight">
                Заробляйте разом з нами — <br/> без складу та ризиків
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Продавайте наші товари на ваших сайтах або маркетплейсах — ми беремо на себе логістику та відправку, а ви отримуєте відсоток з кожного продажу
            </p>
            
            <form className="flex gap-2 max-w-md">
                <input 
                    type="email" 
                    placeholder="Введіть вашу пошту" 
                    className="flex-1 bg-white border border-gray-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-amber-500"
                />
                <button type="submit" className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-xs px-6 py-3 rounded-sm transition-colors">
                    Відправити
                </button>
            </form>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 relative min-h-[300px]">
            <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Warehouse worker" 
                className="w-full h-full object-cover rounded-sm shadow-md"
            />
        </div>

      </div>
    </section>
  );
};

export default PromoSection;
