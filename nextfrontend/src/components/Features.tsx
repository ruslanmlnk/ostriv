'use client';

import React from 'react';
import { FEATURES } from '../constants';

const Features: React.FC = () => {
  return (
    <section className="w-full max-w-[1352px] mx-auto px-4 py-16 border-t border-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-4 group">
            <div className="border border-gray-200 p-4 rounded-sm group-hover:border-amber-400 transition-colors">
              {feature.icon}
            </div>
            <div className="flex flex-col">
              <h4 className="font-bold text-gray-900 text-xs uppercase mb-1">{feature.title}</h4>
              <p className="text-gray-500 text-[11px]">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
