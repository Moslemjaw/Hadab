import React, { useState, useEffect } from 'react';
import { CATEGORIES, FEATURED_PRODUCTS, SALE_PRODUCTS } from '../../constants/mockData';
import type { Product } from '../../types';
import { ShoppingBag, Eye, Heart, Sparkles, ArrowLeft, Check } from 'lucide-react';
import { tactileAudio } from '../../utils/audio';

interface CategoriesPageProps {
  initialCategoryId?: string;
  onBackToHome: () => void;
  onAddToBag: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  initialCategoryId = 'bags',
  onBackToHome,
  onAddToBag,
  onSelectProduct,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(initialCategoryId);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSelectedCatId(initialCategoryId);
  }, [initialCategoryId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCatId]);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCatId) || CATEGORIES[0];

  const allProducts: Product[] = [...FEATURED_PRODUCTS, ...SALE_PRODUCTS];
  const categoryProducts = allProducts.filter((p) => p.category === selectedCatId);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
    tactileAudio.playScrubTick(440);
  };

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToBag(product);
    tactileAudio.playChime();
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-cream-200 text-brown-800 font-sans pb-24 selection:bg-blush-200 selection:text-brown-900">
      {/* Sub-Header with Back Affordance */}
      <div className="border-b border-brown-200/70 bg-cream-100/90 backdrop-blur-md sticky top-[53px] sm:top-[63px] z-30 transition-all">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-brown-700 hover:text-burgundy-600 transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Experience</span>
          </button>

          <div className="text-[11px] uppercase tracking-[0.24em] font-semibold text-brown-500">
            Craft Families • 04 Pillars
          </div>
        </div>
      </div>

      {/* Hero Category Banner */}
      <section className="relative overflow-hidden pt-10 sm:pt-14 pb-10 sm:pb-14 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Editorial Text */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-100 border border-brown-200 text-[10.5px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-burgundy-600 shadow-warm-sm">
              <Sparkles size={12} className="text-burgundy-600" />
              <span>Family 0{CATEGORIES.findIndex((c) => c.id === activeCategory.id) + 1} of 04</span>
            </div>

            <div className="flex items-baseline gap-4 flex-wrap">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-brown-900 font-normal tracking-tight">
                {activeCategory.name}
              </h1>
              <span className="font-arabic text-2xl sm:text-4xl text-brown-500 font-light">
                {activeCategory.nameArabic}
              </span>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-brown-700 font-light leading-relaxed max-w-xl">
              {activeCategory.description} Hand-hooked one stitch at a time in Jordan and Kuwait using unbleached cotton cord and zero-waste slow atelier techniques.
            </p>

            <div className="flex items-center gap-6 pt-2 text-xs text-brown-600 font-medium tracking-wide">
              <div>
                <span className="text-brown-400 block text-[10px] uppercase tracking-wider">Pieces</span>
                <span className="font-serif text-lg text-brown-900 font-semibold">{categoryProducts.length} Crafted Works</span>
              </div>
              <div className="w-[1px] h-8 bg-brown-300/60" />
              <div>
                <span className="text-brown-400 block text-[10px] uppercase tracking-wider">Origin</span>
                <span className="font-serif text-lg text-brown-900 font-semibold">Jordan • Kuwait</span>
              </div>
              <div className="w-[1px] h-8 bg-brown-300/60" />
              <div>
                <span className="text-brown-400 block text-[10px] uppercase tracking-wider">Technique</span>
                <span className="font-serif text-lg text-brown-900 font-semibold">Slow Single-Hook</span>
              </div>
            </div>
          </div>

          {/* Right Featured Category Spotlight Image */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-warm-lg border border-brown-200/80 bg-cream-100 relative group">
              <img
                src={activeCategory.image}
                alt={activeCategory.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-950/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end text-cream-100">
                <div>
                  <span className="font-arabic text-2xl font-normal block drop-shadow">
                    {activeCategory.nameArabic}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] font-light text-cream-200">
                    Atelier Edition
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-cream-100/90 backdrop-blur-md text-brown-900 text-xs font-semibold">
                  {activeCategory.count} Works
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Category Pill Tabs Navigation */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 mb-12">
        <div className="flex items-center justify-start sm:justify-center gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat, idx) => {
            const isActive = selectedCatId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCatId(cat.id);
                  tactileAudio.playScrubTick(300 + idx * 40);
                }}
                className={`group px-5 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 shrink-0 min-h-[44px] flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-burgundy-600 text-cream-100 shadow-warm'
                    : 'bg-cream-100/90 text-brown-700 hover:text-brown-900 border border-brown-200/80 hover:bg-cream-100 backdrop-blur-sm shadow-warm-sm'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-cream-100' : 'bg-brown-400 group-hover:bg-burgundy-600'}`} />
                <span>{cat.name}</span>
                <span className="font-arabic opacity-70 text-xs">({cat.nameArabic})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Products Grid */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-brown-200/60">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brown-600">
            Showing {categoryProducts.length} pieces in {activeCategory.name}
          </p>
          <span className="text-xs text-brown-500 font-light">
            All prices in USD ($)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categoryProducts.map((prod) => {
            const isWishlisted = !!wishlist[prod.id];
            const isAdded = !!addedIds[prod.id];

            return (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="group relative bg-cream-100/90 rounded-2xl sm:rounded-3xl border border-brown-200/80 p-3.5 sm:p-4 shadow-warm hover:shadow-warm-lg transition-all duration-500 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[4/3.8] rounded-xl sm:rounded-2xl overflow-hidden mb-4 bg-cream-200 shadow-inner">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brown-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Tag */}
                    {prod.tag && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cream-100/95 backdrop-blur-sm text-brown-800 text-[9px] font-semibold tracking-wider uppercase border border-brown-200/60 shadow-sm">
                        {prod.tag}
                      </span>
                    )}

                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(prod.id, e)}
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream-100/90 hover:bg-cream-50 backdrop-blur-md border border-brown-200/70 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm z-10"
                    >
                      <Heart
                        size={14}
                        className={`transition-colors duration-300 ${
                          isWishlisted
                            ? 'fill-burgundy-600 text-burgundy-600'
                            : 'text-brown-700 hover:text-burgundy-600'
                        }`}
                      />
                    </button>

                    {/* Quick Inspect View Pill */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brown-900/85 backdrop-blur-md text-cream-100 text-[10px] font-medium shadow-sm">
                        <Eye size={12} />
                        <span>Inspect Stitch</span>
                      </span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="px-1 space-y-1.5">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-semibold text-brown-900 group-hover:text-burgundy-600 transition-colors">
                        {prod.name}
                      </h3>
                      <span className="font-serif text-base sm:text-lg font-semibold text-brown-900 shrink-0">
                        ${prod.price}
                      </span>
                    </div>

                    {prod.nameArabic && (
                      <p className="font-arabic text-sm text-brown-500 font-light">
                        {prod.nameArabic}
                      </p>
                    )}

                    <p className="text-xs sm:text-[13px] text-brown-600 font-light leading-relaxed line-clamp-2 pt-1">
                      {prod.description}
                    </p>

                    {/* Craft Attributes */}
                    <div className="pt-2.5 pb-1 flex flex-wrap gap-2 text-[10.5px] text-brown-500 font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-cream-200/80 border border-brown-200/60">
                        {prod.yarnType}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-cream-200/80 border border-brown-200/60">
                        {prod.colorName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add to Bag Action */}
                <div className="mt-4 pt-3 border-t border-brown-200/60">
                  <button
                    type="button"
                    onClick={(e) => handleAdd(prod, e)}
                    className={`w-full py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-warm-sm min-h-[40px] ${
                      isAdded
                        ? 'bg-sage-600 text-cream-100'
                        : 'bg-brown-900 hover:bg-burgundy-600 text-cream-100 hover:shadow-warm'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
