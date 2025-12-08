'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SidebarFilters from './SidebarFilters';
import ProductCard from './ProductCard';
import { api } from '../api';
import { Product } from '../types';
import { House, ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigation } from './NavigationContext';
import { useCategories } from './useCategories';

interface CatalogPageProps {
  categorySlug?: string;
  initialProducts?: Product[];
  initialCategories?: any[];
}

const CatalogPage: React.FC<CatalogPageProps> = ({ categorySlug, initialProducts, initialCategories }) => {
  const { navigateTo } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();

  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts || initialProducts.length === 0);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(categorySlug);
  const { categories } = useCategories(initialCategories);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setAllProducts(initialProducts);
      setLoading(false);
    }
  }, [initialProducts]);

  useEffect(() => {
    setSelectedCategory(categorySlug);
  }, [categorySlug]);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return;
    const loadProducts = async () => {
      setLoading(true);
      const data = await api.getProducts('all');
      setAllProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return allProducts;
    return allProducts.filter((p) => p.category === selectedCategory);
  }, [allProducts, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [allProducts]);

  const handleSelectCategory = (slug?: string) => {
    setSelectedCategory(slug);
    const query = slug ? `?category=${slug}` : '';
    router.replace(`${pathname}${query}`, { scroll: false });
  };

  const currentCategoryTitle = useMemo(() => {
    if (!selectedCategory) return 'Каталог';
    const found = categories.find((c) => c.slug === selectedCategory);
    return found?.title || 'Каталог';
  }, [categories, selectedCategory]);

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-amber-400 mb-8">
        <button onClick={() => navigateTo('home')}>
          <House
            size={16}
            className="fill-gray-400 text-gray-400 hover:text-amber-500 hover:fill-amber-500 transition-colors"
          />
        </button>
        <ChevronRight size={14} className="text-gray-300" />
        <button onClick={() => navigateTo('catalog')} className="text-amber-500 font-medium hover:underline">
          Каталог
        </button>
        {selectedCategory && (
          <>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-amber-500 font-medium">{currentCategoryTitle}</span>
          </>
        )}
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-[270px] flex-shrink-0">
          <SidebarFilters
            selectedSlug={selectedCategory}
            categoryCounts={categoryCounts}
            onSelectCategory={handleSelectCategory}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header & Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{currentCategoryTitle}</h1>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-800">Сортування:</span>
              <div className="relative border border-gray-200 rounded-sm bg-white px-3 py-1.5 min-w-[140px] flex items-center justify-between cursor-pointer">
                <span className="text-xs text-gray-600">За замовчуванням</span>
                <ChevronDown size={14} className="text-amber-500" />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {!loading && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-3 py-10 text-center text-gray-500">
                {loading ? 'Завантаження...' : 'Товарів не знайдено'}
              </div>
            )}
          </div>

          <div className="flex justify-center mt-12">
            <button className="bg-amber-400 text-white font-bold uppercase text-xs px-8 py-3 rounded-sm hover:bg-amber-500 transition-colors shadow-md hover:shadow-lg">
              Показати ще
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;
