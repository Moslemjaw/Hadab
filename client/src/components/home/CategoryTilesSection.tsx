import React from 'react';
import { CATEGORIES } from '../../constants/mockData';
import { ThreadKnot } from '../common/ThreadSpine';
import { ArrowRight } from 'lucide-react';

export const CategoryTilesSection: React.FC = () => {
  return (
    <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center mb-14">
        <ThreadKnot color="blush" label="STITCH III • COLLECTIONS" className="mb-6" />
        <h2 className="font-serif text-3xl sm:text-4xl text-brown-800 font-normal">
          Explore by category
        </h2>
        <p className="mt-2 text-brown-500 max-w-md font-light text-base">
          From heavy cotton cord carriers to delicate open-weave layers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={`#${cat.id}`}
            className={`group relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl border ${cat.accentBorder} ${cat.accentBg} transition-all duration-300 hover:shadow-warm-lg hover:-translate-y-1 overflow-hidden`}
          >
            {/* Header info */}
            <div className="relative z-10 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-widest text-brown-500 font-semibold">
                  {cat.count} Pieces
                </span>
                <span className="font-arabic text-base text-brown-600 font-medium">
                  {cat.nameArabic}
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-brown-800 font-normal group-hover:text-burgundy-500 transition-colors">
                {cat.name}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-brown-600 font-light leading-relaxed">
                {cat.description}
              </p>
            </div>

            {/* Tactile Image Card */}
            <div className="relative z-10 aspect-[4/3] rounded-2xl overflow-hidden shadow-warm-sm border border-brown-200/50">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-brown-900/10 transition-opacity group-hover:opacity-0" />
            </div>

            {/* Bottom arrow affordance */}
            <div className="relative z-10 mt-6 flex items-center justify-between text-xs font-medium tracking-wider uppercase text-brown-700 group-hover:text-burgundy-500 transition-colors">
              <span>View collection</span>
              <div className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center transition-transform group-hover:translate-x-1 shadow-warm-sm">
                <ArrowRight size={14} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
