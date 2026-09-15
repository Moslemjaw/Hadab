import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Check,
  RotateCcw,
  Percent,
  ArrowUpDown,
  LayoutGrid,
  Grid3X3,
  Grid2X2,
  Square,
} from 'lucide-react';
import { CATEGORIES } from '../../constants/mockData';
import type { Product } from '../../types';
import { tactileAudio } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
export type PriceBracket = 'all' | 'under-75' | '75-120' | 'over-120';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  maxPrice: number;
  priceBracket: PriceBracket;
  onlySale: boolean;
  selectedMaterial: string;
  selectedColor: string;
  sortBy: SortOption;
  gridCols: 3 | 4;
  mobileGridCols?: 1 | 2;
}

interface CollectionFiltersProps {
  products: Product[];
  filteredCount: number;
  filters: FilterState;
  minDatasetPrice: number;
  maxDatasetPrice: number;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

// Curated fiber families for artisan crochet
const FIBER_OPTIONS = [
  { id: 'all', label: 'All Fibers', labelArabic: 'جميع الخيوط', match: '' },
  { id: 'cotton', label: 'Organic & Recycled Cotton', labelArabic: 'قطن نقي ومعاد تدويره', match: 'cotton' },
  { id: 'linen', label: 'Natural Linen & Flax', labelArabic: 'كتان طبيعي', match: 'linen' },
  { id: 'bamboo', label: 'Bamboo & Silk Blends', labelArabic: 'مزيج بامبو وحرير', match: 'bamboo' },
  { id: 'trapillo', label: 'Trapillo Cord', labelArabic: 'حبال ترابيلو سميكة', match: 'trapillo' },
];



export const CollectionFilters: React.FC<CollectionFiltersProps> = ({
  products,
  filteredCount,
  filters,
  minDatasetPrice,
  maxDatasetPrice,
  onUpdateFilters,
  onResetFilters,
}) => {
  const { language, t } = useLanguage();
  // Popover state: 'price' | 'material' | 'color' | 'sort' | null
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const filterBarRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
        setActivePopover(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivePopover(null);
        setIsMobileDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const togglePopover = (name: string) => {
    tactileAudio.playScrubTick(340);
    setActivePopover((prev) => (prev === name ? null : name));
  };

  // Distinct colors extracted from product catalog
  const distinctColors = useMemo(() => {
    const colorMap = new Map<string, { name: string; nameArabic?: string; hex: string; count: number }>();
    products.forEach((p) => {
      if (!colorMap.has(p.colorName)) {
        colorMap.set(p.colorName, { name: p.colorName, nameArabic: p.colorNameArabic, hex: p.colorHex, count: 1 });
      } else {
        colorMap.get(p.colorName)!.count++;
      }
    });
    return Array.from(colorMap.values());
  }, [products]);

  // Total items on sale in catalog
  const saleCount = useMemo(
    () => products.filter((p) => p.isSale || p.originalPrice).length,
    [products]
  );

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim()) count++;
    if (filters.selectedCategory !== 'all') count++;
    if (filters.onlySale) count++;
    if (filters.priceBracket !== 'all') count++;
    if (filters.maxPrice < maxDatasetPrice) count++;
    if (filters.selectedMaterial !== 'all') count++;
    if (filters.selectedColor !== 'all') count++;
    return count;
  }, [filters, maxDatasetPrice]);

  const sortLabels: Record<SortOption, string> = {
    featured: t.sortFeatured,
    'price-asc': t.sortPriceAsc,
    'price-desc': t.sortPriceDesc,
    'name-asc': t.sortNameAsc,
  };

  return (
    <div className="w-full space-y-4" ref={filterBarRef}>
      {/* 1. EDITORIAL CRAFT FAMILIES NAVIGATION (Pure luxury text tabs, zero chunky buttons) */}
      <div className="w-full border-b border-brown-300/60">
        <div className="flex items-center gap-6 sm:gap-9 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
          <button
            type="button"
            onClick={() => {
              onUpdateFilters({ selectedCategory: 'all' });
              tactileAudio.playScrubTick(300);
            }}
            className={`pb-2.5 text-xs sm:text-[13px] tracking-[0.14em] uppercase transition-all whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              filters.selectedCategory === 'all'
                ? 'text-brown-950 font-bold border-brown-900'
                : 'text-brown-400 hover:text-brown-800 font-medium border-transparent'
            }`}
          >
            <span>{t.allCategories}</span>
            <span className="text-[10px] font-normal opacity-60">({products.length})</span>
          </button>

          {CATEGORIES.map((cat) => {
            const isActive = filters.selectedCategory === cat.id;
            const count = products.filter((p) => p.category === cat.id).length;
            const label = language === 'ar' ? cat.nameArabic : cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onUpdateFilters({ selectedCategory: cat.id });
                  tactileAudio.playScrubTick(320);
                }}
                className={`pb-2.5 text-xs sm:text-[13px] tracking-[0.14em] uppercase transition-all whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-brown-950 font-bold border-brown-900'
                    : 'text-brown-400 hover:text-brown-800 font-medium border-transparent'
                }`}
              >
                <span>{label}</span>
                <span className="text-[10px] font-normal opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. UNIFIED ATELIER REFINEMENT BAR (Mobile & Computer) */}
      <div className="py-2 border-b border-brown-200/60 flex items-center justify-between gap-3">
        {/* LEFT: Master Filters Trigger & Quick Sale Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsMobileDrawerOpen(true);
              tactileAudio.playScrubTick(300);
            }}
            className={`h-8.5 px-3.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all shadow-sm active:scale-95 border ${
              activeFiltersCount > 0
                ? 'bg-burgundy-600 border-burgundy-700 text-cream-100'
                : 'bg-cream-100/90 hover:bg-cream-50 text-brown-900 border-brown-300/80 hover:border-brown-400'
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>{t.filtersButton}</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-cream-100 text-burgundy-600 text-[9.5px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Quick Sale Pill */}
          <button
            type="button"
            onClick={() => {
              onUpdateFilters({ onlySale: !filters.onlySale });
              tactileAudio.playScrubTick(380);
            }}
            className={`h-8.5 px-3 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 border transition-all ${
              filters.onlySale
                ? 'bg-burgundy-600 border-burgundy-700 text-cream-100 shadow-sm'
                : 'bg-cream-100/60 hover:bg-cream-100 border-brown-200/70 text-brown-700'
            }`}
          >
            <Percent size={11} className={filters.onlySale ? 'text-cream-100' : 'text-burgundy-600'} />
            <span>{t.saleFilter}</span>
            <span className={`text-[9.5px] font-bold ${filters.onlySale ? 'text-cream-100' : 'text-burgundy-700'}`}>
              {saleCount}
            </span>
          </button>
        </div>

        {/* MIDDLE: Piece Count (Hidden on mobile) */}
        <div className="hidden sm:block text-xs text-brown-500 font-light">
          {t.showingOf} <strong className="font-serif text-sm font-semibold text-brown-900">{filteredCount}</strong> {language === 'ar' ? 'من' : 'of'} {products.length} {t.pieces}
        </div>

        {/* RIGHT: Sort Dropdown & Grid View Toggle */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => togglePopover('sort')}
              className="h-8.5 px-3 rounded-full text-xs font-medium flex items-center gap-1.5 bg-cream-100/80 hover:bg-cream-100 border border-brown-200/80 text-brown-800 transition-colors"
            >
              <ArrowUpDown size={11} className="text-brown-500" />
              <span className="hidden xs:inline text-brown-400 font-normal">{t.sortLabel}:</span>
              <span className="font-semibold text-brown-900 text-xs">
                {sortLabels[filters.sortBy]}
              </span>
              <ChevronDown size={11} className={`transition-transform duration-150 ${activePopover === 'sort' ? 'rotate-180' : ''}`} />
            </button>

            {activePopover === 'sort' && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-cream-50 rounded-2xl border border-brown-200 shadow-warm-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onUpdateFilters({ sortBy: opt });
                      tactileAudio.playScrubTick(300);
                      setActivePopover(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                      filters.sortBy === opt
                        ? 'bg-brown-900 text-cream-100 font-medium'
                        : 'text-brown-800 hover:bg-cream-200/70'
                    }`}
                  >
                    <span>{sortLabels[opt]}</span>
                    {filters.sortBy === opt && <Check size={12} className="text-cream-100" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Grid Switcher (2-col vs 1-col) */}
          <div className="sm:hidden flex items-center bg-cream-100/80 p-0.5 rounded-full border border-brown-200/80">
            <button
              type="button"
              title={language === 'ar' ? 'قطعتان لكل صف' : '2 pieces per row'}
              aria-label={language === 'ar' ? 'قطعتان لكل صف' : '2 pieces per row'}
              onClick={() => {
                onUpdateFilters({ mobileGridCols: 2 });
                tactileAudio.playScrubTick(320);
              }}
              className={`p-1.5 rounded-full transition-colors ${
                filters.mobileGridCols !== 1 ? 'bg-brown-900 text-cream-100 shadow-sm' : 'text-brown-500 hover:text-brown-900'
              }`}
            >
              <Grid2X2 size={12} />
            </button>
            <button
              type="button"
              title={language === 'ar' ? 'قطعة واحدة لكل صف' : '1 piece per row'}
              aria-label={language === 'ar' ? 'قطعة واحدة لكل صف' : '1 piece per row'}
              onClick={() => {
                onUpdateFilters({ mobileGridCols: 1 });
                tactileAudio.playScrubTick(320);
              }}
              className={`p-1.5 rounded-full transition-colors ${
                filters.mobileGridCols === 1 ? 'bg-brown-900 text-cream-100 shadow-sm' : 'text-brown-500 hover:text-brown-900'
              }`}
            >
              <Square size={12} />
            </button>
          </div>

          {/* Desktop Grid Switcher (Editorial 3-col vs Compact 4-col) */}
          <div className="hidden sm:flex items-center bg-cream-100/80 p-0.5 rounded-full border border-brown-200/80">
            <button
              type="button"
              title={language === 'ar' ? 'عرض تحريري ۳ أعمدة' : 'Editorial 3-column view'}
              aria-label={language === 'ar' ? 'عرض تحريري ۳ أعمدة' : 'Editorial 3-column view'}
              onClick={() => {
                onUpdateFilters({ gridCols: 3 });
                tactileAudio.playScrubTick(320);
              }}
              className={`p-1.5 rounded-full transition-colors ${
                filters.gridCols === 3 ? 'bg-brown-900 text-cream-100 shadow-sm' : 'text-brown-500 hover:text-brown-900'
              }`}
            >
              <LayoutGrid size={13} />
            </button>
            <button
              type="button"
              title={language === 'ar' ? 'عرض مدمج ٤ أعمدة' : 'Compact 4-column view'}
              aria-label={language === 'ar' ? 'عرض مدمج ٤ أعمدة' : 'Compact 4-column view'}
              onClick={() => {
                onUpdateFilters({ gridCols: 4 });
                tactileAudio.playScrubTick(320);
              }}
              className={`p-1.5 rounded-full transition-colors ${
                filters.gridCols === 4 ? 'bg-brown-900 text-cream-100 shadow-sm' : 'text-brown-500 hover:text-brown-900'
              }`}
            >
              <Grid3X3 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE FILTERS CHIP STRIP */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 animate-in fade-in duration-200">
          <span className="text-[11px] text-brown-400 font-medium uppercase tracking-wider mr-0.5">
            {language === 'ar' ? 'المفعلة:' : 'Active:'}
          </span>

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-cream-100 border border-brown-200/80 text-brown-800 text-xs shadow-warm-sm">
              <span>{language === 'ar' ? `بحث: "${filters.searchQuery}"` : `Search: "${filters.searchQuery}"`}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdateFilters({ searchQuery: '' });
                }}
                className="p-0.5 rounded-full hover:bg-brown-200 text-brown-500 hover:text-brown-800 transition-colors"
                aria-label="Remove search filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-cream-100 border border-brown-200/80 text-brown-800 text-xs shadow-warm-sm">
              <span>
                {language === 'ar'
                  ? `التصنيف: ${CATEGORIES.find((c) => c.id === filters.selectedCategory)?.nameArabic || filters.selectedCategory}`
                  : `Category: ${CATEGORIES.find((c) => c.id === filters.selectedCategory)?.name || filters.selectedCategory}`}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdateFilters({ selectedCategory: 'all' });
                }}
                className="p-0.5 rounded-full hover:bg-brown-200 text-brown-500 hover:text-brown-800 transition-colors"
                aria-label="Remove category filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.onlySale && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-burgundy-50 border border-burgundy-200 text-burgundy-600 text-xs shadow-warm-sm font-medium">
              <span>{language === 'ar' ? 'التخفيضات والأرشيف' : 'Archive & Sale'}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdateFilters({ onlySale: false });
                }}
                className="p-0.5 rounded-full hover:bg-burgundy-100 text-burgundy-500 hover:text-burgundy-700 transition-colors"
                aria-label="Remove sale filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.priceBracket !== 'all' && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-cream-100 border border-brown-200/80 text-brown-800 text-xs shadow-warm-sm">
              <span>
                {language === 'ar' ? 'السعر: ' : 'Price: '}
                {filters.priceBracket === 'under-75' ? (language === 'ar' ? 'أقل من ٧٥ د.ك' : '< 75 KD') : filters.priceBracket === '75-120' ? (language === 'ar' ? '٧٥–١٢٠ د.ك' : '75–120 KD') : (language === 'ar' ? 'أكثر من ١٢٠ د.ك' : '120+ KD')}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdateFilters({ priceBracket: 'all' });
                }}
                className="p-0.5 rounded-full hover:bg-brown-200 text-brown-500 hover:text-brown-800 transition-colors"
                aria-label="Remove price bracket filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.maxPrice < maxDatasetPrice && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-cream-100 border border-brown-200/80 text-brown-800 text-xs shadow-warm-sm">
              <span>{language === 'ar' ? `الحد الأقصى: ${filters.maxPrice} د.ك` : `Max: ${filters.maxPrice} KD`}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdateFilters({ maxPrice: maxDatasetPrice });
                }}
                className="p-0.5 rounded-full hover:bg-brown-200 text-brown-500 hover:text-brown-800 transition-colors"
                aria-label="Reset max price filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.selectedMaterial !== 'all' && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-cream-100 border border-brown-200/80 text-brown-800 text-xs shadow-warm-sm">
              <span>
                {language === 'ar'
                  ? `الخيط: ${FIBER_OPTIONS.find((f) => f.id === filters.selectedMaterial)?.labelArabic || filters.selectedMaterial}`
                  : `Fiber: ${FIBER_OPTIONS.find((f) => f.id === filters.selectedMaterial)?.label}`}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdateFilters({ selectedMaterial: 'all' });
                }}
                className="p-0.5 rounded-full hover:bg-brown-200 text-brown-500 hover:text-brown-800 transition-colors"
                aria-label="Remove material filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.selectedColor !== 'all' && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-cream-100 border border-brown-200/80 text-brown-800 text-xs shadow-warm-sm">
              <span
                className="w-2 h-2 rounded-full border border-black/15"
                style={{
                  backgroundColor:
                    distinctColors.find((c) => c.name === filters.selectedColor)?.hex || '#4A382F',
                }}
              />
              <span>
                {language === 'ar'
                  ? `اللون: ${distinctColors.find((c) => c.name === filters.selectedColor)?.nameArabic || filters.selectedColor}`
                  : `Color: ${filters.selectedColor}`}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdateFilters({ selectedColor: 'all' });
                }}
                className="p-0.5 rounded-full hover:bg-brown-200 text-brown-500 hover:text-brown-800 transition-colors"
                aria-label="Remove color filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {/* Reset All Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onResetFilters();
            }}
            className="inline-flex items-center gap-1 text-xs text-burgundy-600 hover:text-burgundy-800 underline underline-offset-2 ml-2 font-medium cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>{language === 'ar' ? 'إعادة ضبط الكل' : 'Reset All'}</span>
          </button>
        </div>
      )}

      {/* 4. MASTER FILTER DRAWER (Mobile & Computer) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-brown-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          <div className={`relative ${language === 'ar' ? 'mr-auto ml-0 animate-in slide-in-from-left' : 'ml-auto mr-0 animate-in slide-in-from-right'} w-full max-w-sm bg-cream-50 h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 duration-300`}>
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-brown-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={17} className="text-brown-900" />
                  <h3 className="font-serif text-lg text-brown-900 font-medium">{t.filterDrawerTitle}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-full text-brown-400 hover:text-brown-800 hover:bg-cream-200"
                  aria-label={language === 'ar' ? 'إغلاق الفلاتر' : 'Close filters'}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Craft Families (Categories) */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-brown-400 font-semibold mb-2.5">
                  {t.craftFamiliesBadge}
                </h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateFilters({ selectedCategory: 'all' });
                      tactileAudio.playScrubTick(320);
                    }}
                    className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'} px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                      filters.selectedCategory === 'all'
                        ? 'bg-brown-900 text-cream-100 font-medium'
                        : 'text-brown-700 hover:bg-cream-200/70'
                    }`}
                  >
                    <span>{t.allCategories}</span>
                    <span>{products.length}</span>
                  </button>
                  {CATEGORIES.map((cat) => {
                    const label = language === 'ar' ? cat.nameArabic : cat.name;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          onUpdateFilters({ selectedCategory: cat.id });
                          tactileAudio.playScrubTick(320);
                        }}
                        className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'} px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                          filters.selectedCategory === cat.id
                            ? 'bg-brown-900 text-cream-100 font-medium'
                            : 'text-brown-700 hover:bg-cream-200/70'
                        }`}
                      >
                        <span>{label}</span>
                        <span>{products.filter((p) => p.category === cat.id).length}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Archive & Offers */}
              <div className="pt-4 border-t border-brown-200/60">
                <h4 className="text-xs uppercase tracking-wider text-brown-400 font-semibold mb-2.5">
                  {language === 'ar' ? 'إصدارات خاصة' : 'Special Releases'}
                </h4>
                <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl bg-cream-100/60 border border-brown-200">
                  <input
                    type="checkbox"
                    checked={filters.onlySale}
                    onChange={(e) => {
                      onUpdateFilters({ onlySale: e.target.checked });
                      tactileAudio.playScrubTick(360);
                    }}
                    className="w-4 h-4 rounded accent-burgundy-600"
                  />
                  <span className="text-xs text-brown-900 font-medium">
                    {language === 'ar' ? `تخفيضات وعروض خاصة (${saleCount})` : `Special Offers & Sale (${saleCount})`}
                  </span>
                </label>
              </div>

              {/* Price Filter */}
              <div className="pt-4 border-t border-brown-200/60">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs uppercase tracking-wider text-brown-400 font-semibold">
                    {t.priceCeiling}
                  </h4>
                  <span className="text-xs font-bold text-brown-900">{filters.maxPrice} {language === 'ar' ? 'د.ك' : 'KD'}</span>
                </div>
                <input
                  type="range"
                  min={minDatasetPrice}
                  max={maxDatasetPrice}
                  step={5}
                  value={filters.maxPrice}
                  onChange={(e) => onUpdateFilters({ maxPrice: Number(e.target.value) })}
                  className="w-full accent-brown-900"
                />
                <div className="grid grid-cols-2 gap-1.5 mt-3">
                  {[
                    { id: 'all', label: 'All Prices', labelArabic: 'جميع الأسعار' },
                    { id: 'under-75', label: '< 75 KD', labelArabic: 'أقل من ٧٥ د.ك' },
                    { id: '75-120', label: '75–120 KD', labelArabic: '٧٥–١٢٠ د.ك' },
                    { id: 'over-120', label: '120+ KD', labelArabic: 'أكثر من ١٢٠ د.ك' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        onUpdateFilters({ priceBracket: b.id as PriceBracket });
                        tactileAudio.playScrubTick(320);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-[11px] border ${
                        filters.priceBracket === b.id
                          ? 'bg-brown-900 border-brown-900 text-cream-100 font-medium'
                          : 'border-brown-200 text-brown-700 bg-cream-100'
                      }`}
                    >
                      {language === 'ar' ? b.labelArabic : b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fiber / Materials */}
              <div className="pt-4 border-t border-brown-200/60">
                <h4 className="text-xs uppercase tracking-wider text-brown-400 font-semibold mb-2.5">
                  {language === 'ar' ? 'الخيوط والألياف' : 'Fiber & Yarn'}
                </h4>
                <div className="space-y-1">
                  {FIBER_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        onUpdateFilters({ selectedMaterial: f.id });
                        tactileAudio.playScrubTick(320);
                      }}
                      className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'} px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                        filters.selectedMaterial === f.id
                          ? 'bg-brown-900 text-cream-100 font-medium'
                          : 'text-brown-700 hover:bg-cream-200/60'
                      }`}
                    >
                      <span>{language === 'ar' ? (f.labelArabic || f.label) : f.label}</span>
                      {filters.selectedMaterial === f.id && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="pt-4 border-t border-brown-200/60">
                <h4 className="text-xs uppercase tracking-wider text-brown-400 font-semibold mb-2.5">
                  {language === 'ar' ? 'الألوان والصبغات الطبيعية' : 'Natural Plant Dyes'}
                </h4>
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                  {distinctColors.map((color) => {
                    const colorLabel = language === 'ar' && color.nameArabic ? color.nameArabic : color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => {
                          onUpdateFilters({
                            selectedColor: filters.selectedColor === color.name ? 'all' : color.name,
                          });
                          tactileAudio.playScrubTick(340);
                        }}
                        className={`flex items-center gap-2 p-1.5 rounded-lg text-[11px] ${language === 'ar' ? 'text-right' : 'text-left'} border ${
                          filters.selectedColor === color.name
                            ? 'bg-brown-900 text-cream-100 border-brown-900 font-medium'
                            : 'border-brown-200 text-brown-800 bg-cream-100/70'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="truncate">{colorLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Order */}
              <div className="pt-4 border-t border-brown-200/60">
                <h4 className="text-xs uppercase tracking-wider text-brown-400 font-semibold mb-2.5">
                  {language === 'ar' ? 'ترتيب النتائج' : 'Sort Order'}
                </h4>
                <div className="space-y-1">
                  {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onUpdateFilters({ sortBy: opt });
                        tactileAudio.playScrubTick(300);
                      }}
                      className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'} px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                        filters.sortBy === opt
                          ? 'bg-brown-900 text-cream-100 font-medium'
                          : 'text-brown-700 hover:bg-cream-200/60'
                      }`}
                    >
                      <span>{sortLabels[opt]}</span>
                      {filters.sortBy === opt && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 pb-[env(safe-area-inset-bottom)] border-t border-brown-200 flex gap-2">
              <button
                type="button"
                onClick={onResetFilters}
                className="w-1/3 py-3 rounded-xl border border-brown-300 text-brown-800 text-xs font-medium hover:bg-cream-100 transition-colors"
              >
                {t.resetFilters}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  tactileAudio.playChime();
                }}
                className="w-2/3 py-3 rounded-xl bg-brown-900 text-cream-100 text-xs font-semibold uppercase tracking-wider shadow-warm hover:bg-burgundy-600 transition-colors"
              >
                {language === 'ar' ? `عرض (${filteredCount}) قطعة` : `Show ${filteredCount} Works`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
