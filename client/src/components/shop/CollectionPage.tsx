import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  X,
  ShoppingBag,
  Eye,
  Heart,
  Sparkles,
  ArrowLeft,
  Tag,
} from 'lucide-react';
import { ALL_PRODUCTS, CATEGORIES } from '../../constants/mockData';
import type { Product } from '../../types';
import { tactileAudio } from '../../utils/audio';
import { CollectionFilters, type FilterState } from './CollectionFilters';
import { useLanguage } from '../../context/LanguageContext';

interface CollectionPageProps {
  onAddToBag: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onBackToHome: () => void;
  initialCategory?: string;
  initialSearch?: string;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  onAddToBag,
  onSelectProduct,
  onBackToHome,
  initialCategory = 'all',
  initialSearch = '',
}) => {
  const { language, t } = useLanguage();
  // Price bounds from dataset
  const minDatasetPrice = useMemo(
    () => Math.min(...ALL_PRODUCTS.map((p) => p.price)),
    []
  );
  const maxDatasetPrice = useMemo(
    () => Math.max(...ALL_PRODUCTS.map((p) => p.price)),
    []
  );

  // Filter & Search states
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialSearch,
    selectedCategory: initialCategory,
    maxPrice: maxDatasetPrice,
    priceBracket: 'all',
    onlySale: false,
    selectedMaterial: 'all',
    selectedColor: 'all',
    sortBy: 'featured',
    gridCols: 4,
    mobileGridCols: 2,
  });

  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    tactileAudio.playScrubTick(440);
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateFilters = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCategory: 'all',
      maxPrice: maxDatasetPrice,
      priceBracket: 'all',
      onlySale: false,
      selectedMaterial: 'all',
      selectedColor: 'all',
      sortBy: 'featured',
      gridCols: filters.gridCols,
    });
    tactileAudio.playScrubTick(300);
  };

  // Quick search keywords
  const popularKeywords = language === 'ar'
    ? [
        { label: 'حقائب توت', query: 'توت' },
        { label: 'قبعات', query: 'قبعة' },
        { label: 'كارديجان', query: 'كارديجان' },
        { label: 'كلاتش', query: 'كلاتش' },
        { label: 'حبال قطنية', query: 'قطن' },
        { label: 'كتان طبيعي', query: 'كتان' },
      ]
    : [
        { label: 'Tote', query: 'Tote' },
        { label: 'Bucket Hat', query: 'Bucket Hat' },
        { label: 'Cardigan', query: 'Cardigan' },
        { label: 'Clutch', query: 'Clutch' },
        { label: 'Cotton Cord', query: 'Cotton Cord' },
        { label: 'Organic Linen', query: 'Organic Linen' },
      ];

  // Filtering & Sorting pipeline
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      // 1. Enhanced Tokenized Search Query
      if (filters.searchQuery.trim()) {
        const queryTerms = filters.searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
        const searchableText = [
          product.name,
          product.nameArabic || '',
          product.description,
          product.yarnType,
          product.stitchDetail,
          product.tag || '',
          product.colorName,
          CATEGORIES.find((c) => c.id === product.category)?.name || product.category,
          String(product.price),
        ].join(' ').toLowerCase();

        const matchesAll = queryTerms.every((term) => searchableText.includes(term));
        if (!matchesAll) {
          return false;
        }
      }

      // 2. Category Filter
      if (filters.selectedCategory !== 'all' && product.category !== filters.selectedCategory) {
        return false;
      }

      // 3. Discount Filter
      if (filters.onlySale && !product.isSale && !product.originalPrice) {
        return false;
      }

      // 4. Price Bracket Filter
      if (filters.priceBracket === 'under-75' && product.price >= 75) return false;
      if (filters.priceBracket === '75-120' && (product.price < 75 || product.price > 120)) return false;
      if (filters.priceBracket === 'over-120' && product.price <= 120) return false;

      // 5. Max Price Slider
      if (product.price > filters.maxPrice) return false;

      // 6. Fiber & Material Filter
      if (filters.selectedMaterial !== 'all') {
        const matchKey = filters.selectedMaterial.toLowerCase();
        if (!product.yarnType.toLowerCase().includes(matchKey)) {
          return false;
        }
      }

      // 7. Color / Palette Filter
      if (filters.selectedColor !== 'all' && product.colorName !== filters.selectedColor) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'name-asc') return a.name.localeCompare(b.name);
      // 'featured'
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-cream-200 text-brown-800 pb-28 select-none font-sans">
      {/* Top Editorial Banner */}
      <section className="relative bg-[#2E221B] text-cream-100 pt-3.5 pb-6 sm:pt-14 sm:pb-16 px-4 sm:px-8 border-b border-brown-900 overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10 pointer-events-none">
          <img src={language === 'ar' ? '/arabic.png' : '/PNG-HADAB-CREAM.png'} alt="" className="w-64 sm:w-96 h-auto" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb Navigation */}
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.2em] text-cream-300 hover:text-blush-200 transition-colors mb-1.5 sm:mb-6 group"
          >
            <ArrowLeft size={12} className={language === 'ar' ? 'rotate-180 group-hover:translate-x-1 transition-transform' : 'group-hover:-translate-x-1 transition-transform'} />
            <span className="hidden sm:inline">{language === 'ar' ? 'العودة للصفحة الرئيسية' : 'Return to Home'}</span>
            <span className="sm:hidden inline">{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6">
            <div>
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-100/10 border border-cream-200/20 text-[10px] uppercase font-semibold tracking-[0.26em] text-blush-200 mb-3">
                <Sparkles size={11} className="text-blush-300" />
                <span>{language === 'ar' ? 'الأرشيف الدائم • الأردن والكويت' : 'The Permanent Archive • Jordan & Kuwait'}</span>
              </div>
              <div className="flex items-baseline gap-2.5">
                <h1 className="font-serif text-2xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-cream-100 leading-tight">
                  {t.collectionHeroTitle}
                </h1>
              </div>
              <p className="hidden sm:block mt-2 text-cream-300/80 text-xs sm:text-sm font-light max-w-xl leading-relaxed">
                {t.collectionHeroSubtitle}
              </p>
            </div>

            {/* Desktop Quick Stats Card */}
            <div className="hidden sm:flex items-center gap-3 self-start md:self-end bg-cream-100/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-cream-200/15">
              <div className={language === 'ar' ? 'text-left' : 'text-right'}>
                <span className="block text-2xl font-serif font-medium text-cream-100 leading-none">
                  {filteredProducts.length}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-cream-300/70 font-light">
                  {language === 'ar' ? 'قطعة متوفرة' : 'Pieces Available'}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-cream-100/20" />
              <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                <span className="block text-2xl font-serif font-medium text-cream-100 leading-none">
                  4
                </span>
                <span className="text-[10px] uppercase tracking-widest text-cream-300/70 font-light">
                  {language === 'ar' ? 'عائلات حرفة' : 'Craft Families'}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Search Bar inside Header */}
          <div className="mt-5 sm:mt-8 mb-1.5 sm:mb-0 max-w-2xl relative" ref={searchContainerRef}>
            <div className="relative flex items-center">
              <Search
                size={17}
                className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} text-brown-400 pointer-events-none`}
              />
              <input
                type="text"
                value={filters.searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  handleUpdateFilters({ searchQuery: e.target.value });
                  setIsSearchFocused(true);
                }}
                placeholder={t.searchCollectionPlaceholder}
                className={`w-full ${language === 'ar' ? 'pr-11 pl-24' : 'pl-11 pr-24'} py-3 sm:py-3.5 rounded-full bg-cream-100 text-brown-900 placeholder:text-brown-400 text-xs sm:text-sm font-light shadow-warm focus:outline-none focus:ring-2 focus:ring-blush-300/80 transition-all`}
              />

              {/* Action buttons inside search */}
              <div className={`absolute ${language === 'ar' ? 'left-3' : 'right-3'} flex items-center gap-1.5`}>
                {filters.searchQuery && (
                  <>
                    <span className="text-[10.5px] text-brown-500 font-medium hidden xs:inline px-1">
                      {filteredProducts.length} {t.searchCountWorks}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateFilters({ searchQuery: '' });
                        tactileAudio.playScrubTick(280);
                      }}
                      className="p-1 rounded-full text-brown-400 hover:text-brown-700 hover:bg-cream-200 transition-colors"
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Live Instant Search Suggestions & Results Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-cream-50 rounded-2xl border border-brown-200/90 shadow-warm-lg p-3.5 z-40 animate-in fade-in zoom-in-95 duration-150 text-brown-900">
                {filters.searchQuery.trim() ? (
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-brown-200/60 text-xs">
                      <span className="font-semibold font-serif text-brown-900">
                        {language === 'ar' ? `منتجات مطابقة (${filteredProducts.length})` : `Matching Products (${filteredProducts.length})`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsSearchFocused(false)}
                        className="text-[11px] text-brown-500 hover:text-brown-800"
                      >
                        {language === 'ar' ? 'إغلاق' : 'Close'}
                      </button>
                    </div>

                    {filteredProducts.length === 0 ? (
                      <p className="text-xs text-brown-500 py-3 text-center">
                        {language === 'ar' ? `لم نجد قطعاً تطابق "${filters.searchQuery}". جربي البحث بنوع الخيط أو القطعة.` : `No pieces found for "${filters.searchQuery}". Try searching by yarn like "cotton", "linen" or piece type like "tote".`}
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                        {filteredProducts.slice(0, 4).map((p) => {
                          const pName = language === 'ar' && p.nameArabic ? p.nameArabic : p.name;
                          const pYarn = language === 'ar' && p.yarnTypeArabic ? p.yarnTypeArabic : p.yarnType;
                          const catObj = CATEGORIES.find((c) => c.id === p.category);
                          const pCat = catObj ? (language === 'ar' ? catObj.nameArabic : catObj.name) : p.category;
                          return (
                            <div
                              key={p.id}
                              onClick={() => {
                                onSelectProduct(p);
                                setIsSearchFocused(false);
                              }}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-cream-200/70 cursor-pointer transition-colors group"
                            >
                              <img
                                src={p.image}
                                alt={pName}
                                className="w-10 h-10 rounded-lg object-cover bg-cream-200 shrink-0 border border-brown-200/60"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-serif text-xs sm:text-sm font-medium text-brown-900 group-hover:text-burgundy-600 transition-colors truncate">
                                    {pName}
                                  </span>
                                  <span className="font-serif text-xs font-semibold text-brown-900 shrink-0">
                                    {p.price} {language === 'ar' ? 'د.ك' : 'KWD'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-brown-500">
                                  <span>{pCat}</span>
                                  <span>•</span>
                                  <span className="truncate">{pYarn}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {filteredProducts.length > 4 && (
                          <button
                            type="button"
                            onClick={() => setIsSearchFocused(false)}
                            className="w-full py-2 text-center text-xs font-semibold text-burgundy-600 hover:underline pt-2 border-t border-brown-200/40"
                          >
                            {language === 'ar' ? `عرض كل الـ ${filteredProducts.length} قطعة في المجموعة` : `View all ${filteredProducts.length} pieces in collection`}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10.5px] uppercase tracking-wider font-semibold text-brown-500">
                        {language === 'ar' ? 'عمليات البحث الشائعة' : 'Popular Searches'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsSearchFocused(false)}
                        className="text-[11px] text-brown-400 hover:text-brown-700"
                      >
                        {language === 'ar' ? 'إغلاق' : 'Close'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {popularKeywords.map((kw) => (
                        <button
                          key={kw.label}
                          type="button"
                          onClick={() => {
                            handleUpdateFilters({ searchQuery: kw.query });
                            tactileAudio.playScrubTick(340);
                            setIsSearchFocused(false);
                          }}
                          className="px-3 py-1.5 rounded-full bg-cream-200/80 hover:bg-brown-900 hover:text-cream-100 text-brown-800 text-xs transition-all flex items-center gap-1.5 border border-brown-200/60"
                        >
                          <Tag size={11} className="text-burgundy-600" />
                          <span>{kw.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Keyword Quick Chips below Search */}
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 mt-2.5 overflow-x-auto no-scrollbar py-1 text-[10.5px]">
              <span className="text-cream-300/60 shrink-0 font-light text-[10px] sm:text-xs">
                {language === 'ar' ? 'بحث سريع:' : 'Quick search:'}
              </span>
              {popularKeywords.map((kw) => (
                <button
                  key={kw.label}
                  type="button"
                  onClick={() => {
                    handleUpdateFilters({ searchQuery: kw.query });
                    tactileAudio.playScrubTick(360);
                  }}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all shrink-0 ${
                    filters.searchQuery.toLowerCase() === kw.query.toLowerCase()
                      ? 'bg-blush-200 text-brown-900 font-medium'
                      : 'bg-cream-100/10 hover:bg-cream-100/20 text-cream-200'
                  }`}
                >
                  {kw.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">
        {/* NEW ENHANCED SHOP FILTERS SYSTEM */}
        <CollectionFilters
          products={ALL_PRODUCTS}
          filteredCount={filteredProducts.length}
          filters={filters}
          minDatasetPrice={minDatasetPrice}
          maxDatasetPrice={maxDatasetPrice}
          onUpdateFilters={handleUpdateFilters}
          onResetFilters={resetFilters}
        />

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center justify-center bg-cream-100/50 rounded-3xl border border-dashed border-brown-300 mt-6">
            <div className="w-14 h-14 rounded-full bg-cream-200 flex items-center justify-center text-brown-400 mb-4">
              <Search size={24} />
            </div>
            <h3 className="font-serif text-2xl text-brown-800 font-normal">
              {t.noMatchTitle}
            </h3>
            <p className="text-xs sm:text-sm text-brown-500 font-light mt-2 max-w-sm">
              {t.noMatchSubtitle}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 px-5 py-2.5 rounded-full bg-brown-900 text-cream-100 text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-600 transition-colors shadow-warm"
            >
              {t.clearAllFilters}
            </button>
          </div>
        ) : (
          <div
            className={`grid ${
              filters.mobileGridCols === 1
                ? 'grid-cols-1 gap-4'
                : 'grid-cols-2 gap-2.5 sm:gap-4 md:gap-6'
            } sm:grid-cols-2 ${
              filters.gridCols === 3
                ? 'lg:grid-cols-3 sm:gap-6 lg:gap-8'
                : 'lg:grid-cols-3 xl:grid-cols-4 sm:gap-5 lg:gap-6'
            } mt-4 sm:mt-6`}
          >
            {filteredProducts.map((product) => {
              const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
              const discountPercent = hasDiscount
                ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group relative bg-cream-100/90 rounded-xl sm:rounded-2xl overflow-hidden border border-brown-200/80 hover:border-brown-400/80 shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.99] hover:-translate-y-1"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative aspect-[4/3.8] sm:aspect-[4/3.5] bg-cream-200 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brown-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Top Badges */}
                      <div className="absolute top-2 start-2 sm:top-2.5 sm:start-2.5 flex flex-col gap-1 z-10">
                        {product.tag && (
                          <span className="px-1.5 sm:px-2.5 py-0.5 rounded-full bg-cream-100/95 backdrop-blur-md text-brown-800 text-[8px] sm:text-[9.5px] uppercase tracking-wider font-semibold border border-brown-200/60 shadow-sm">
                            {language === 'ar' && product.tagArabic ? product.tagArabic : product.tag}
                          </span>
                        )}
                        {hasDiscount && (
                          <span className="px-1.5 sm:px-2.5 py-0.5 rounded-full bg-burgundy-600 text-cream-100 text-[8px] sm:text-[9.5px] uppercase tracking-wider font-bold shadow-sm flex items-center gap-0.5">
                            <span>-{discountPercent}%</span>
                          </span>
                        )}
                      </div>

                      {/* Wishlist Heart */}
                      <button
                        type="button"
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className="absolute top-2 end-2 sm:top-2.5 sm:end-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cream-100/90 hover:bg-cream-50 backdrop-blur-md border border-brown-200/60 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm z-10"
                        aria-label={language === 'ar' ? 'المفضلة' : 'Wishlist'}
                      >
                        <Heart
                          size={13}
                          className={`transition-colors duration-200 ${
                            wishlist[product.id]
                              ? 'fill-burgundy-600 text-burgundy-600'
                              : 'text-brown-700 hover:text-burgundy-600'
                          }`}
                        />
                      </button>

                      {/* Inspect Piece Pill button (Desktop only to prevent mobile clutter) */}
                      <div className="hidden sm:inline-flex absolute bottom-2.5 end-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brown-900/85 backdrop-blur-md text-cream-100 text-[10px] font-medium shadow-sm">
                          <Eye size={11} />
                          <span>{t.inspect}</span>
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-2.5 sm:p-4">
                      {/* Craft Family indicator */}
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-brown-400 font-semibold block mb-0.5">
                        {(() => {
                          const cat = CATEGORIES.find((c) => c.id === product.category);
                          return cat ? (language === 'ar' ? cat.nameArabic : cat.name) : product.category;
                        })()}
                      </span>

                      {/* Product Name */}
                      <h3 className="font-serif text-xs sm:text-base font-semibold text-brown-900 group-hover:text-burgundy-600 transition-colors line-clamp-1 leading-snug">
                        {language === 'ar' && product.nameArabic ? product.nameArabic : product.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-1.5 mt-0.5 sm:mt-1">
                        <span className={`font-serif text-xs sm:text-base font-semibold ${hasDiscount ? 'text-burgundy-600' : 'text-brown-900'}`}>
                          {product.price} {language === 'ar' ? 'د.ك' : 'KWD'}
                        </span>
                        {hasDiscount && (
                          <span className="font-serif text-[10px] sm:text-xs text-brown-400 line-through">
                            {product.originalPrice} {language === 'ar' ? 'د.ك' : 'KWD'}
                          </span>
                        )}
                      </div>

                      {/* Description (Desktop only to keep 2-column mobile cards clean) */}
                      <p className="hidden md:block text-xs text-brown-600 font-light line-clamp-2 leading-relaxed mt-1.5 mb-2">
                        {language === 'ar' && product.descriptionArabic ? product.descriptionArabic : product.description}
                      </p>

                      {/* Clean Yarn & Color Line */}
                      <div className="flex items-center gap-1.5 text-[10px] text-brown-500 mt-1.5">
                        <span
                          className="w-2 h-2 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: product.colorHex }}
                        />
                        <span className="truncate">
                          {language === 'ar' && product.colorNameArabic ? product.colorNameArabic : product.colorName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Bag Action */}
                  <div className="p-2.5 pt-0 sm:p-4 sm:pt-0 border-t border-brown-200/40 mt-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToBag(product);
                        tactileAudio.playChime();
                      }}
                      className="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-brown-900 hover:bg-burgundy-600 text-cream-100 text-[10.5px] sm:text-[11px] uppercase tracking-[0.14em] font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] min-h-[34px] sm:min-h-[38px]"
                    >
                      <ShoppingBag size={12} className="shrink-0" />
                      <span>{t.addToBag}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
