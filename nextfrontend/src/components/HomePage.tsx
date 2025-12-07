'use client';

import React, { useEffect, useState } from 'react';
import Hero from './Hero';
import CategoryGrid from './CategoryGrid';
import ProductSection from './ProductSection';
import PromoSection from './PromoSection';
import Features from './Features';
import { api } from '../api';
import { Product } from '../types';

const HomePage: React.FC = () => {
  const [hitProducts, setHitProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      const hits = await api.getProducts('hit');
      
      // const uniqueHits = hits.reduce<Product[]>((acc, p) => {
      //   if (!acc.find((item) => item.id === p.id)) acc.push(p);
      //   return acc;
      // }, []);
      setHitProducts(hits.slice(0, 9));

      // Fetch New Arrivals from Strapi
      const newArrivals = await api.getProducts('new');
      setNewProducts(newArrivals);
    };

    loadData();
  }, []);

  return (
    <>
      <Hero />
      <CategoryGrid /> 
      {hitProducts.length > 0 && (
      <ProductSection 
        title="Хіти продажів" 
        subtitle="Топ із нашого каталогу" 
        products={hitProducts} 
        showButton 
        viewMode="grid"
      />
      )}
      <PromoSection />
      {newProducts.length > 0 && (
      <ProductSection 
        title="Нові надходження товарів" 
        subtitle="Свіже надходження" 
        products={newProducts} 
        withArrows 
        viewMode="slider"
      />
      )}
      <Features />
    </>
  );
};

export default HomePage;

