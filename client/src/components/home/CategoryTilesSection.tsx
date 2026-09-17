import React from 'react';
import { useShopData } from '../../context/ShopDataContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface CategoryTilesSectionProps {
  onSelectCategory?: (categoryId: string) => void;
}

export const CategoryTilesSection: React.FC<CategoryTilesSectionProps> = ({ onSelectCategory }) => {
  const { isArabic: isAr } = useLanguage();
  const { categories } = useShopData();
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal({ threshold: 0.2 });
  const { ref: gridRef, isRevealed: gridRevealed } = useScrollReveal({ threshold: 0.1 });

  // Grid spans for 2 rows of alternating visual rhythm (7 cols + 5 cols, then 5 cols + 7 cols)
  const getColSpanClass = (index: number) => {
    switch (index % 4) {
      case 0:
        return 'md:col-span-7 h-[380px] sm:h-[440px] md:h-[480px]';
      case 1:
        return 'md:col-span-5 h-[380px] sm:h-[440px] md:h-[480px]';
      case 2:
        return 'md:col-span-5 h-[380px] sm:h-[440px] md:h-[480px]';
      case 3:
        return 'md:col-span-7 h-[380px] sm:h-[440px] md:h-[480px]';
      default:
        return 'md:col-span-6 h-[400px]';
    }
  };

  return (
    <section id="categories" className="relative mt-4 sm:mt-8 pt-16 sm:pt-20 pb-24 sm:pb-32 bg-[#ECE3D6]/70 rounded-t-[40px] sm:rounded-t-[60px] border-t border-brown-300/40 shadow-[0_-12px_32px_rgba(74,56,47,0.03)] overflow-hidden">
      <div className="px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
        {/* Minimal Header */}
        <div 
          ref={headerRef}
          className={`flex flex-col items-center text-center mb-12 sm:mb-16 scroll-reveal ${headerRevealed ? 'revealed' : ''}`}
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brown-400 font-medium mb-2.5">
            {isAr ? 'التصنيفات' : 'The Archive'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brown-900 font-normal tracking-tight">
            {isAr ? 'المجموعات' : 'Collections'}
          </h2>
          <div className="w-10 h-px bg-brown-300/60 mt-3.5" />
        </div>

      {/* Asymmetric Alternating Full-Bleed Tiles */}
      <div 
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8"
      >
        {categories.map((cat, idx) => {
          const colSpan = getColSpanClass(idx);
          const isLeftAnim = idx % 2 === 0;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm transition-all duration-700 hover:shadow-warm-xl ${colSpan} ${
                isLeftAnim ? 'scroll-reveal-left' : 'scroll-reveal-right'
              } ${gridRevealed ? 'revealed' : ''}`}
              style={{ animationDelay: `${(idx % 2) * 150}ms` }}
            >
              {/* Full-Bleed Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Luxury Vignette & Dark Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-brown-950/85 via-brown-950/30 to-brown-950/10 transition-opacity duration-500 group-hover:from-brown-950/90" />

              {/* Top Tag */}
              <div className="absolute top-6 sm:top-8 inset-x-6 sm:inset-x-8 flex justify-between items-center z-10">
                <span className="px-3.5 py-1 rounded-full bg-cream-100/20 backdrop-blur-md border border-white/20 text-cream-100 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase">
                  {cat.count} {isAr ? 'قطعة' : 'Pieces'}
                </span>
              </div>

              {/* Bottom Content Floating over Image */}
              <div className="absolute bottom-6 sm:bottom-8 inset-x-6 sm:inset-x-8 z-10 flex items-end justify-between gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-cream-100 font-normal tracking-tight">
                    {isAr ? cat.nameArabic : cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-cream-200/80 font-light line-clamp-1 max-w-md">
                    {isAr ? cat.descriptionArabic : cat.description}
                  </p>
                </div>

                {/* Minimalist Hover Arrow Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cream-100/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-cream-100 shrink-0 transition-all duration-300 group-hover:bg-cream-100 group-hover:text-brown-900 group-hover:scale-110 shadow-warm">
                  {isAr ? (
                    <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                  ) : (
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
};
