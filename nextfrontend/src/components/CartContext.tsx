'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, delta: number) => void;
  totalAmount: number;
  totalCount: number;
}

const STORAGE_KEY = 'ostriv_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const stripModelFromName = (name: string, model: string) => {
  const trimmedName = (name ?? '').trim();
  const trimmedModel = (model ?? '').trim();

  if (!trimmedName || !trimmedModel) return trimmedName;

  const pattern = new RegExp(`\\s*(?:[-–—|:]\\s*)?${escapeRegExp(trimmedModel)}\\s*$`, 'i');
  const stripped = trimmedName.replace(pattern, '').trim();
  return stripped || trimmedName;
};

const normalizeCartItem = (item: CartItem): CartItem => ({
  ...item,
  name: stripModelFromName(item.name, item.model),
  model: item.model?.trim?.() ?? String(item.model ?? ''),
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(Array.isArray(parsed) ? parsed.map(normalizeCartItem) : []);
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    const normalizedNewItem = normalizeCartItem(newItem);
    setItems(prev => {
      const existing = prev.find(item => item.id === normalizedNewItem.id);
      if (existing) {
        return prev.map(item => 
          item.id === normalizedNewItem.id 
            ? { ...item, quantity: item.quantity + normalizedNewItem.quantity }
            : item
        );
      }
      return [...prev, normalizedNewItem];
    });
  };

  const removeFromCart = (id: number | string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number | string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, totalAmount, totalCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
