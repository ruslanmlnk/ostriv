'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  wishlistIds: (number | string)[];
  addToWishlist: (id: number | string) => void;
  removeFromWishlist: (id: number | string) => void;
  isInWishlist: (id: number | string) => boolean;
  toggleWishlist: (id: number | string) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<(number | string)[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ostriv_wishlist');
    if (saved) {
      try {
        setWishlistIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ostriv_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const addToWishlist = (id: number | string) => {
    setWishlistIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const removeFromWishlist = (id: number | string) => {
    setWishlistIds(prev => prev.filter(itemId => itemId !== id));
  };

  const toggleWishlist = (id: number | string) => {
    setWishlistIds(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
  };

  const isInWishlist = (id: number | string) => wishlistIds.includes(id);

  return (
    <WishlistContext.Provider value={{ 
      wishlistIds, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist, 
      toggleWishlist,
      count: wishlistIds.length 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

