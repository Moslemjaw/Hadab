import React, { useState } from 'react';
import { useShopData } from '../../context/ShopDataContext';
import type { Product } from '../../types';
import { ShoppingBag, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface FeaturedProductsSectionProps {
  onAddToBag?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onExploreCatalog?: () => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onAddToBag,
  onSelectProduct,
  onExploreCatalog,
}) => {
  const { isArabic: isAr, t } = useLanguage();
  const { featuredProducts, products } = useShopData();
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal({ threshold: 0.2 });
  const { ref: gridRef, isRevealed: gridRevealed } = useScrollReveal({ threshold: 0.1 });

  const displayProducts = featuredProducts.length > 0 ? featuredProducts.slice(0, 4) : products.slice(0, 4);

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setAddedIds((prev) => [...prev, product.id]);
    if (onAddToBag) onAddToBag(product);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1800);
  };

  return (
    <section id="featured" className="py-24 sm:py-32 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto overflow-hidden">
      {/* Editorial Header */}
      <div 
        ref={headerRef}
        className={`flex flex-col items-center text-center mb-16 sm:mb-24 scroll-reveal ${headerRevealed ? 'revealed' : ''}`}
      >
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brown-400 font-medium mb-3">
          {isAr ? 'مختارات الموسم' : 'Selected Pieces'}
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brown-900 font-normal tracking-tight">
          {isAr ? 'قطع صُنعت لتدوم' : 'Our Pieces'}
        </h2>
        <div className="w-10 h-px bg-brown-300/60 mt-4" />
      </div>

      {/* Asymmetric 2-Column Luxury Grid */}
      <div 
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 lg:gap-x-16 lg:gap-y-24"
      >
        {displayProducts.map((product, idx) => {
          const isAdded = addedIds.includes(product.id);
          // Stagger odd items vertically on desktop for high-fashion editorial asymmetry
          const isOffset = idx % 2 === 1;

          return (
            <div
              key={product.id}
              className={`group flex flex-col cursor-pointer transition-all duration-700 ${
                isOffset ? 'md:translate-y-16 lg:translate-y-20' : ''
              } scroll-reveal ${gridRevealed ? 'revealed' : ''}`}
              style={{ animationDelay: `${idx * 140}ms` }}
              onClick={() => onSelectProduct && onSelectProduct(product)}
            >
              {/* Product Visual Frame */}
              <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-[#ECE4D8] border border-brown-200/40 shadow-sm transition-all duration-500 group-hover:shadow-warm-lg group-hover:-translate-y-1">
                <img
                  src={product.image}
                  alt={isAr ? (product.nameArabic || product.name) : product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Sale Badge */}
                {(product.isSale || (product.originalPrice && product.originalPrice > product.price)) && (
                  <span className={`absolute top-4 ${isAr ? 'right-4' : 'left-4'} px-3 py-1 rounded-full bg-burgundy-600/90 backdrop-blur-sm text-cream-100 text-[10px] font-medium uppercase tracking-widest shadow-sm`}>
                    {isAr ? 'تخفيض' : 'Sale'}
                  </span>
                )}

                {/* Quick Add Overlay on Hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-brown-950/70 via-brown-950/20 to-transparent opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-between">
                  <span className="text-xs text-cream-100 font-light tracking-wide hidden sm:inline">
                    {isAr ? 'استكشف التفاصيل' : 'Quick View'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleAdd(e, product)}
                    className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-warm active:scale-95 ml-auto ${
                      isAdded
                        ? 'bg-sage-600 text-cream-100'
                        : 'bg-cream-100 hover:bg-white text-brown-900'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={13} />
                        <span>{isAr ? 'أُضيف' : 'Added'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={13} />
                        <span>{t.addToBag}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Minimalist Editorial Details */}
              <div className="pt-5 pb-2 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl text-brown-900 font-normal tracking-tight group-hover:text-burgundy-600 transition-colors">
                    {isAr ? (product.nameArabic || product.name) : product.name}
                  </h3>
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {product.colors.slice(0, 3).map((col, cIdx, arr) => (
                        <span 
                          key={cIdx} 
                          className="text-[11px] text-brown-400 font-light"
                        >
                          {col}{cIdx < arr.length - 1 ? ' ·' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-baseline gap-2 shrink-0 pt-1">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-brown-400 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  <span className="font-medium text-base sm:text-lg text-brown-900">
                    {product.price} <span className="text-xs uppercase text-brown-500 font-normal">{isAr ? 'د.ك' : 'KWD'}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editorial View All CTA */}
      {onExploreCatalog && (
        <div className="mt-28 sm:mt-36 flex justify-center">
          <button
            type="button"
            onClick={onExploreCatalog}
            className="group inline-flex items-center gap-3 px-9 py-4 rounded-full border border-brown-400/50 hover:border-brown-800 text-brown-900 text-xs font-medium uppercase tracking-[0.25em] transition-all duration-300 hover:bg-brown-900 hover:text-cream-100 hover:shadow-warm active:scale-95"
          >
            <span>{isAr ? 'عرض كافة القطع' : 'View All Pieces'}</span>
            {isAr ? (
              <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
            ) : (
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </button>
        </div>
      )}
    </section>
  );
};
