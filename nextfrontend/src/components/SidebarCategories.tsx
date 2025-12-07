'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';

const CATEGORY_ITEMS = [
  { label: "М'ЯКІ МЕБЛІ", hasSubmenu: false },
  { label: "МЕБЛІ ДЛЯ СПАЛЬНІ", hasSubmenu: false },
  { label: "МЕБЛІ ДЛЯ КУХНІ", hasSubmenu: false },
  { label: "ОСВІТЛЕННЯ", hasSubmenu: false },
  { label: "СИСТЕМИ ЗБЕРІГАННЯ", hasSubmenu: false },
  { label: "КОЛЕСА ТА ШИНИ", hasSubmenu: false },
  { 
    label: "ПОБУТОВА ТЕХНІКА", 
    hasSubmenu: true,
    isOpen: true, // Default open for this page
    items: [
      "Холодильник",
      "Мікрохвильова піч",
      "Електричний чайник",
      "Пилосос"
    ] 
  }
];

const SidebarCategories: React.FC = () => {
  return (
    <div className="w-full border border-gray-100 rounded-sm bg-white mb-6">
      {/* Header */}
      <div className="bg-amber-400 p-4">
        <h3 className="text-white font-bold uppercase text-xs tracking-widest">КАТЕГОРІЇ</h3>
      </div>

      {/* List */}
      <ul className="py-2">
        {CATEGORY_ITEMS.map((cat, idx) => (
          <li key={idx} className="border-b border-gray-50 last:border-0">
            <div className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${cat.isOpen ? 'text-amber-500 font-bold' : 'text-gray-800 text-xs font-bold uppercase'}`}>
              <span className={cat.isOpen ? "text-amber-500 text-xs font-bold uppercase" : "text-gray-800 text-xs font-bold uppercase"}>
                {cat.label}
              </span>
              {cat.hasSubmenu && (
                 cat.isOpen ? <ChevronDown size={14} className="text-amber-500" /> : <ChevronRight size={14} className="text-gray-300" />
              )}
               {cat.label === "ПОБУТОВА ТЕХНІКА" && cat.isOpen && (
                   <div className="absolute left-0 w-1 h-full bg-amber-400 top-0 hidden"></div>
               )}
            </div>

            {/* Submenu */}
            {cat.hasSubmenu && cat.isOpen && (
              <ul className="bg-gray-50 py-2">
                {cat.items?.map((subItem, subIdx) => (
                  <li key={subIdx}>
                    <Link href="#" className="flex items-center gap-2 px-6 py-2 text-xs text-gray-500 hover:text-amber-500 transition-colors">
                      <ChevronRight size={12} className="text-gray-300" />
                      {subItem}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarCategories;
