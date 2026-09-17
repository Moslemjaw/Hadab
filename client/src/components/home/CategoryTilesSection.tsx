import React, { useMemo } from 'react';
import { useShopData } from '../../context/ShopDataContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface CategoryTilesSectionProps {
  onSelectCategory?: (categoryId: string) => void;
}

export const CategoryTilesSection: React.FC<CategoryTilesSectionProps> = ({ onSelectCategory }) => {
  const { isArabic: isAr } = useLanguage();
  const { categories, products } = useShopData();
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal({ threshold: 0.2 });
  const { ref: gridRef, isRevealed: gridRevealed } = useScrollReveal({ threshold: 0.1 });

  // Compute live product counts per category from actual products
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      const catKey = (cat.id || (cat as any).slug || '').toLowerCase();
      const catName = (cat.name || '').toLowerCase();
      const catNameAr = (cat.nameArabic || '').toLowerCase();

      const matched = products.filter((p) => {
        const pCat = (p.category || '').toLowerCase();
        return (
          pCat === catKey ||
          pCat === cat.id ||
          pCat === (cat as any).slug ||
          pCat === catName ||
          pCat === catNameAr
        );
      }).length;

      counts[cat.id] = matched > 0 ? matched : (cat.count || 0);
    }
    return counts;
  }, [categories, products]);

  // Grid spans for 2 rows of alternating visual rhythm (7 cols + 5 cols, then 5 cols + 7 cols)
  const getColSpanClass = (index: number) => {
    switch (index % 4) {
      case 0:
        return 'md:col-span-7 h-[220px] xs:h-[260px] sm:h-[360px] md:h-[460px]';
      case 1:
        return 'md:col-span-5 h-[220px] xs:h-[260px] sm:h-[360px] md:h-[460px]';
      case 2:
        return 'md:col-span-5 h-[220px] xs:h-[260px] sm:h-[360px] md:h-[460px]';
      case 3:
        return 'md:col-span-7 h-[220px] xs:h-[260px] sm:h-[360px] md:h-[460px]';
      default:
        return 'md:col-span-6 h-[240px] sm:h-[380px]';
    }
  };

  return (
    <section id="categories" className="relative mt-4 sm:mt-8 pt-14 sm:pt-20 pb-20 sm:pb-32 bg-[#ECE3D6]/70 rounded-t-[32px] sm:rounded-t-[60px] border-t border-brown-300/40 shadow-[0_-12px_32px_rgba(74,56,47,0.03)] overflow-hidden">
      <div className="px-3.5 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
        {/* Minimal Header */}
        <div 
          ref={headerRef}
          className={`flex flex-col items-center text-center mb-10 sm:mb-16 scroll-reveal ${headerRevealed ? 'revealed' : ''}`}
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brown-400 font-medium mb-2">
            {isAr ? 'التصنيفات' : 'The Archive'}
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-brown-900 font-normal tracking-tight">
            {isAr ? 'المجموعات' : 'Collections'}
          </h2>
          <div className="w-10 h-px bg-brown-300/60 mt-3" />
        </div>

      {/* Asymmetric Alternating Full-Bleed Tiles */}
      <div 
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:gap-8"
      >
        {categories.map((cat, idx) => {
          const colSpan = getColSpanClass(idx);
          const isLeftAnim = idx % 2 === 0;
          const liveCount = categoryCounts[cat.id] || cat.count || 0;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-sm transition-all duration-700 hover:shadow-warm-xl ${colSpan} ${
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

              {/* Stronger Gradient for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/5 transition-opacity duration-500 group-hover:from-black/80" />

              {/* Top Tag — Distinct Luxury Piece Counter Badge */}
              <div className="absolute top-3.5 sm:top-5 inset-x-4 sm:inset-x-5 flex justify-between items-center z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-cream-50/95 backdrop-blur-md text-brown-950 border border-brown-200/80 shadow-md text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-transform duration-300 group-hover:scale-105">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy-700 inline-block animate-pulse" />
                  <span>
                    {liveCount} {isAr ? 'قطعة' : liveCount === 1 ? 'Piece' : 'Pieces'}
                  </span>
                </span>
              </div>

              {/* Bottom Content — Larger Text for Visibility */}
              <div className="absolute bottom-3.5 sm:bottom-6 inset-x-4 sm:inset-x-6 z-10 flex items-end justify-between gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="font-serif text-xl sm:text-3xl lg:text-4xl text-white font-normal tracking-tight drop-shadow-lg">
                    {isAr ? cat.nameArabic : cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/85 font-light line-clamp-2 max-w-md drop-shadow-md leading-relaxed">
                    {isAr ? cat.descriptionArabic : cat.description}
                  </p>
                </div>

                {/* Minimalist Hover Arrow Icon */}
                <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full bg-cream-100/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-cream-100 shrink-0 transition-all duration-300 group-hover:bg-cream-100 group-hover:text-brown-900 group-hover:scale-110 shadow-warm">
                  {isAr ? (
                    <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                  ) : (
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
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
