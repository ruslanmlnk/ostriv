'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { House, ChevronRight, Heart, Star, Minus, Plus, ShoppingBasket } from 'lucide-react';
import SidebarCategories from './SidebarCategories';
import SidebarWidgets from './SidebarWidgets';
import { Product } from '../types';
import UiImage from './UiImage';
import { useCart } from './CartContext';
import { useWishlist } from './WishlistContext';
import { getImageUrl } from '../api';
import { useCategories } from './useCategories';

interface ProductPageProps {
  product: Product;
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { categories } = useCategories();

  const imageUrl = useMemo(() => getImageUrl(product.image), [product.image]);
  const isLiked = isInWishlist(product.id);
  const categoryTitle = useMemo(() => {
    const match = categories.find((c) => c.slug === product.category);
    return match?.title || product.category;
  }, [categories, product.category]);

  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity((q) => q + 1);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      model: product.slug ?? String(product.id),
      price: product.price,
      quantity,
      image: imageUrl,
    });
  };

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-amber-400 mb-8">
        <Link href="/" className="hover:text-amber-500">
          <House size={16} className="fill-gray-400 text-gray-400 hover:text-amber-500 hover:fill-amber-500 transition-colors" />
        </Link>
        <ChevronRight size={14} className="text-gray-300" />
        <Link href="/catalog" className="text-amber-500 font-medium hover:underline">
          Каталог
        </Link>
        {product.category && (
          <>
            <ChevronRight size={14} className="text-gray-300" />
            <Link href={`/catalog?category=${product.category}`} className="text-amber-500 font-medium hover:underline">
              {categoryTitle}
            </Link>
          </>
        )}
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-amber-500 font-medium">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-[270px] flex-shrink-0 hidden lg:block">
          <SidebarCategories />
          <SidebarWidgets />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-sm mb-12">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Images Column */}
              <div className="w-full md:w-1/2">
                <div className="border border-gray-100 p-8 flex items-center justify-center mb-4 h-[400px]">
                  <UiImage
                    src={imageUrl}
                    alt={product.name}
                    className="max-h-full object-contain"
                    width={700}
                    height={600}
                  />
                </div>
              </div>

              {/* Info Column */}
              <div className="w-full md:w-1/2 pt-2">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                  <button
                    onClick={() => toggleWishlist(product.id, product)}
                    className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-400 rounded-sm transition-colors flex-shrink-0 ml-4"
                    aria-label="Додати або прибрати з обраного"
                  >
                    <Heart size={20} className={isLiked ? 'fill-amber-500 text-amber-500' : ''} />
                  </button>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < (product.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
                    />
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="text-4xl font-bold text-gray-900">
                    ₴{product.price.toLocaleString('uk-UA')}
                  </div>
                  {product.oldPrice && (
                    <div className="text-gray-400 text-lg line-through">
                      ₴{product.oldPrice.toLocaleString('uk-UA')}
                    </div>
                  )}
                  {product.discount && product.discount > 0 && (
                    <span className="text-sm font-bold text-amber-500 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Quantity & Buy */}
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase text-gray-900 block mb-3">Кількість</span>
                  <div className="flex flex-col gap-4 items-start">
                    <div className="flex items-center border border-gray-200 bg-gray-50 rounded-sm w-[260px] max-w-full">
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
                      className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-xs px-8 py-3 rounded-sm transition-colors flex items-center justify-center gap-2 w-[260px] max-w-full"
                    >
                      <ShoppingBasket size={18} />
                      <span>Додати в кошик</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-12 border-t border-gray-100 pt-8">
                <div className="flex gap-8 border-b border-gray-200 mb-6">
                  <button className="text-amber-500 font-bold uppercase text-sm border-b-2 border-amber-500 pb-2 -mb-[1px]">
                    Опис
                  </button>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {product.description}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
