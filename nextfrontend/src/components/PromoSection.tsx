'use client';

import React from 'react';
import UiImage from './UiImage';

const PromoSection: React.FC = () => {
  return (
    <section className="bg-gray-100 py-16 my-10">
      <div className="w-full max-w-[1352px] mx-auto px-4 flex flex-col md:flex-row items-stretch">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2 pr-0 md:pr-12 flex flex-col justify-center mb-8 md:mb-0">
            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-2">Безкоштовна консультація</span>
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-gray-900 mb-6 leading-tight">
                Потрібна консультація<br/> фахівця?
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Заповніть форму і ми вам зателефонуємо
            </p>
            
            <form className="flex gap-2 max-w-md">
                <input 
                    type="phone" 
                    placeholder="Введіть ваш телефон" 
                    className="flex-1 bg-white border border-gray-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-amber-500"
                />
                <button type="submit" className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-xs px-6 py-3 rounded-sm transition-colors">
                    Відправити
                </button>
            </form>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 relative min-h-[300px]">
            <UiImage
              src="/img/consultation.png"
              alt="Warehouse worker"
              className="w-full h-full object-cover rounded-[20px] shadow-md"
              width={1000}
              height={700}
              sizes="100vw"
            />
        </div>

      </div>
    </section>
  );
};

export default PromoSection;
