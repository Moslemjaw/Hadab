import React, { useState } from 'react';
import { useShopData } from '../../context/ShopDataContext';
import type { Product } from '../../types';
import { ShoppingBag, Check, ArrowRight, ArrowLeft, Eye } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
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
  const { format } = useCurrency();
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
    <section id="featured" className="pt-20 sm:pt-28 pb-10 sm:pb-12 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto overflow-hidden">
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

      {/* Refined Luxury Responsive Grid: 2 cols on mobile, 4 cols on desktop */}
      <div 
        ref={gridRef}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 max-w-7xl mx-auto"
      >
        {displayProducts.map((product, idx) => {
          const isAdded = addedIds.includes(product.id);

          return (
            <div
              key={product.id}
              className={`group flex flex-col cursor-pointer transition-all duration-500 w-full scroll-reveal ${gridRevealed ? 'revealed' : ''}`}
              style={{ animationDelay: `${idx * 80}ms` }}
              onClick={() => onSelectProduct && onSelectProduct(product)}
            >
              {/* Product Visual Frame */}
              <div className="relative aspect-[4/5] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#ECE4D8] border border-brown-200/40 shadow-sm transition-all duration-500 group-hover:shadow-warm-lg group-hover:-translate-y-1">
                <img
                  src={product.image}
                  alt={isAr ? (product.nameArabic || product.name) : product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Sale Badge */}
                {(product.isSale || (product.originalPrice && product.originalPrice > product.price)) && (
                  <span className={`absolute top-2.5 sm:top-3.5 ${isAr ? 'right-2.5 sm:right-3.5' : 'left-2.5 sm:left-3.5'} px-2 sm:px-2.5 py-0.5 rounded-full bg-burgundy-600/90 backdrop-blur-sm text-cream-100 text-[8px] sm:text-[10px] font-medium uppercase tracking-widest shadow-sm`}>
                    {isAr ? 'تخفيض' : 'Sale'}
                  </span>
                )}

                {/* Quick Add Overlay: refined brown atelier buttons */}
                <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 bg-gradient-to-t from-brown-950/80 via-brown-950/30 to-transparent sm:opacity-0 sm:translate-y-1.5 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300 flex items-center justify-between gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brown-900/90 hover:bg-brown-950 text-cream-100 text-[10px] sm:text-[11px] font-medium tracking-wide backdrop-blur-md border border-brown-700/60 shadow-sm transition-colors">
                    <Eye size={12} className="text-cream-200" />
                    <span>{isAr ? 'معاينة' : 'Quick View'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleAdd(e, product)}
                    className={`p-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-[9.5px] sm:text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-md active:scale-95 ml-auto ${
                      isAdded
                        ? 'bg-sage-600 text-cream-100'
                        : 'bg-brown-900 hover:bg-brown-950 text-cream-100 border border-brown-700/80'
                    }`}
                    aria-label={isAr ? 'أضف إلى الحقيبة' : 'Add to Bag'}
                  >
                    {isAdded ? (
                      <>
                        <Check size={12} />
                        <span className="hidden sm:inline">{isAr ? 'أُضيف' : 'Added'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={12} />
                        <span className="hidden sm:inline">{t.addToBag}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Minimalist Editorial Details */}
              <div className="pt-2.5 sm:pt-3.5 pb-1 flex items-start justify-between gap-1.5 sm:gap-3">
                <div className="space-y-0.5 min-w-0">
                  <h3 className="font-serif text-xs sm:text-base lg:text-lg text-brown-900 font-normal tracking-tight group-hover:text-brown-950 transition-colors truncate">
                    {isAr ? (product.nameArabic || product.name) : product.name}
                  </h3>
                  {product.colors && product.colors.length > 0 && (
                    <div className="hidden sm:flex items-center gap-1 pt-0.5">
                      {product.colors.slice(0, 3).map((col, cIdx, arr) => (
                        <span 
                          key={cIdx} 
                          className="text-[10px] text-brown-400 font-light"
                        >
                          {col}{cIdx < arr.length - 1 ? ' ·' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-baseline gap-1 shrink-0 pt-0.5">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-[10px] sm:text-[11px] text-brown-400 line-through">
                      {format(product.originalPrice, isAr)}
                    </span>
                  )}
                  <span className="font-medium text-xs sm:text-sm lg:text-base text-brown-900">
                    {format(product.price, isAr)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editorial View All CTA */}
      {onExploreCatalog && (
        <div className="mt-12 sm:mt-14 flex justify-center">
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
