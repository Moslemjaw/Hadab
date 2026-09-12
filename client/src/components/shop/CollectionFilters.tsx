import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Check,
  RotateCcw,
  Percent,
  Layers,
  Palette,
  DollarSign,
  ArrowUpDown,
  LayoutGrid,
  Grid3X3,
  Sparkles,
} from 'lucide-react';
import { CATEGORIES } from '../../constants/mockData';
import type { Product } from '../../types';
import { tactileAudio } from '../../utils/audio';

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
  { id: 'all', label: 'All Fibers', match: '' },
  { id: 'cotton', label: 'Organic & Recycled Cotton', match: 'cotton' },
  { id: 'linen', label: 'Natural Linen & Flax', match: 'linen' },
  { id: 'bamboo', label: 'Bamboo & Silk Blends', match: 'bamboo' },
  { id: 'trapillo', label: 'Trapillo Cord', match: 'trapillo' },
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
    const colorMap = new Map<string, { name: string; hex: string; count: number }>();
    products.forEach((p) => {
      if (!colorMap.has(p.colorName)) {
        colorMap.set(p.colorName, { name: p.colorName, hex: p.colorHex, count: 1 });
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
    featured: 'Featured First',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'name-asc': 'Alphabetical (A–Z)',
  };

  return (
    <div className="w-full space-y-4" ref={filterBarRef}>
      {/* 1. ATELIER CATEGORY BUTTONS (Craft Families) */}
      <div className="w-full">
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1.5 -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* "All Pieces" Tab */}
          <button
            type="button"
            onClick={() => {
              onUpdateFilters({ selectedCategory: 'all' });
              tactileAudio.playScrubTick(300);
            }}
            className={`group relative h-11 px-4 sm:px-5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 shrink-0 flex items-center gap-2.5 border ${
              filters.selectedCategory === 'all'
                ? 'bg-brown-900 border-brown-900 text-cream-100 shadow-warm'
                : 'bg-cream-100/90 hover:bg-cream-50 text-brown-800 border-brown-200/80 hover:border-brown-400/80 shadow-warm-sm'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
              filters.selectedCategory === 'all' ? 'bg-blush-200' : 'bg-brown-400 group-hover:bg-brown-600'
            }`} />
            <span>All Pieces</span>
            <span className={`font-arabic text-[11px] font-normal normal-case transition-opacity ${
              filters.selectedCategory === 'all' ? 'text-cream-200/80' : 'text-brown-500'
            }`}>
              (المجموعة)
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold transition-colors ${
                filters.selectedCategory === 'all'
                  ? 'bg-cream-100/20 text-cream-100'
                  : 'bg-cream-200/90 text-brown-600'
              }`}
            >
              {products.length}
            </span>
          </button>

          {/* Individual Category Tabs */}
          {CATEGORIES.map((cat) => {
            const isActive = filters.selectedCategory === cat.id;
            const count = products.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onUpdateFilters({ selectedCategory: cat.id });
                  tactileAudio.playScrubTick(320);
                }}
                className={`group relative h-11 px-4 sm:px-5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 shrink-0 flex items-center gap-2.5 border ${
                  isActive
                    ? 'bg-brown-900 border-brown-900 text-cream-100 shadow-warm'
                    : 'bg-cream-100/90 hover:bg-cream-50 text-brown-800 border-brown-200/80 hover:border-brown-400/80 shadow-warm-sm'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isActive ? 'bg-blush-200' : 'bg-brown-400 group-hover:bg-brown-600'
                }`} />
                <span>{cat.name}</span>
                <span className={`font-arabic text-[11px] font-normal normal-case transition-opacity ${
                  isActive ? 'text-cream-200/80' : 'text-brown-500'
                }`}>
                  ({cat.nameArabic})
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold transition-colors ${
                    isActive
                      ? 'bg-cream-100/20 text-cream-100'
                      : 'bg-cream-200/90 text-brown-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ELEVATED ATELIER REFINEMENT TOOLBAR */}
      <div className="relative z-30 pt-2 pb-1 border-y border-brown-200/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* LEFT GROUP: REFINEMENT PILLS & POPOVERS */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-semibold text-brown-500 mr-1">
              <SlidersHorizontal size={13} className="text-brown-400" />
              <span>Filter:</span>
            </span>

            {/* Archive & Sale Toggle */}
            <button
              type="button"
              onClick={() => {
                onUpdateFilters({ onlySale: !filters.onlySale });
                tactileAudio.playScrubTick(380);
              }}
              className={`h-9 px-3.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 border transition-all duration-200 ${
                filters.onlySale
                  ? 'bg-burgundy-600 border-burgundy-700 text-cream-100 shadow-sm'
                  : 'bg-cream-100/80 hover:bg-cream-100 border-brown-200/80 text-brown-800 hover:border-burgundy-300'
              }`}
            >
              <Percent size={12} className={filters.onlySale ? 'text-cream-100' : 'text-burgundy-600'} />
              <span>Archive & Sale</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  filters.onlySale
                    ? 'bg-cream-100/20 text-cream-100'
                    : 'bg-burgundy-100 text-burgundy-700'
                }`}
              >
                {saleCount}
              </span>
            </button>

            {/* Price Filter Popover Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => togglePopover('price')}
                className={`h-9 px-3.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all duration-200 ${
                  activePopover === 'price' || filters.priceBracket !== 'all' || filters.maxPrice < maxDatasetPrice
                    ? 'bg-brown-900 border-brown-900 text-cream-100 shadow-sm font-semibold'
                    : 'bg-cream-100/80 hover:bg-cream-100 border-brown-200/80 text-brown-800 hover:border-brown-400'
                }`}
              >
                <DollarSign size={13} className={activePopover === 'price' || filters.priceBracket !== 'all' || filters.maxPrice < maxDatasetPrice ? 'text-cream-300' : 'text-brown-500'} />
                <span>
                  {filters.priceBracket !== 'all'
                    ? filters.priceBracket === 'under-75'
                      ? '< $75'
                      : filters.priceBracket === '75-120'
                      ? '$75–$120'
                      : '$120+'
                    : filters.maxPrice < maxDatasetPrice
                    ? `≤ $${filters.maxPrice}`
                    : 'Price'}
                </span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${activePopover === 'price' ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Price Popover Panel */}
              {activePopover === 'price' && (
                <div className="absolute top-full left-0 sm:left-0 -left-4 mt-2.5 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-cream-50 rounded-2xl border border-brown-200 shadow-warm-lg p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-brown-200/60">
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={14} className="text-brown-700" />
                      <span className="font-serif text-sm font-semibold text-brown-900">Price Range</span>
                    </div>
                    <span className="text-xs font-serif font-bold text-burgundy-600">
                      Up to ${filters.maxPrice}
                    </span>
                  </div>

                  {/* Preset Price Brackets */}
                  <div className="py-3">
                    <span className="text-[10px] uppercase tracking-wider text-brown-400 font-semibold block mb-2">
                      Quick Brackets
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'all', label: 'All Prices' },
                        { id: 'under-75', label: 'Under $75' },
                        { id: '75-120', label: '$75 – $120' },
                        { id: 'over-120', label: '$120+' },
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            onUpdateFilters({ priceBracket: b.id as PriceBracket });
                            tactileAudio.playScrubTick(320);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                            filters.priceBracket === b.id
                              ? 'bg-brown-900 border-brown-900 text-cream-100 shadow-sm'
                              : 'bg-cream-100/80 border-brown-200 text-brown-700 hover:bg-cream-100'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Range Slider */}
                  <div className="py-3 border-t border-brown-200/60">
                    <div className="flex items-center justify-between text-xs text-brown-500 mb-2">
                      <span>Min: ${minDatasetPrice}</span>
                      <span className="font-semibold text-brown-900">Max: ${filters.maxPrice}</span>
                      <span>Cap: ${maxDatasetPrice}</span>
                    </div>
                    <input
                      type="range"
                      min={minDatasetPrice}
                      max={maxDatasetPrice}
                      step={5}
                      value={filters.maxPrice}
                      onChange={(e) => onUpdateFilters({ maxPrice: Number(e.target.value) })}
                      className="w-full accent-brown-900 cursor-pointer h-1.5 bg-brown-200 rounded-lg"
                    />
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-brown-200/60 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateFilters({ maxPrice: maxDatasetPrice, priceBracket: 'all' });
                        tactileAudio.playScrubTick(280);
                      }}
                      className="text-brown-500 hover:text-burgundy-600 font-medium"
                    >
                      Reset Price
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePopover(null)}
                      className="px-4 py-1.5 rounded-full bg-brown-900 text-cream-100 text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-600 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fiber / Material Popover Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => togglePopover('material')}
                className={`h-9 px-3.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all duration-200 ${
                  activePopover === 'material' || filters.selectedMaterial !== 'all'
                    ? 'bg-brown-900 border-brown-900 text-cream-100 shadow-sm font-semibold'
                    : 'bg-cream-100/80 hover:bg-cream-100 border-brown-200/80 text-brown-800 hover:border-brown-400'
                }`}
              >
                <Layers size={13} className={activePopover === 'material' || filters.selectedMaterial !== 'all' ? 'text-cream-300' : 'text-brown-500'} />
                <span>
                  {filters.selectedMaterial !== 'all'
                    ? FIBER_OPTIONS.find((f) => f.id === filters.selectedMaterial)?.label.split(' ')[0] || 'Material'
                    : 'Fiber'}
                </span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${activePopover === 'material' ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Material Popover Panel */}
              {activePopover === 'material' && (
                <div className="absolute top-full -left-16 sm:left-0 mt-2.5 w-[calc(100vw-2rem)] sm:w-72 max-w-sm bg-cream-50 rounded-2xl border border-brown-200 shadow-warm-lg p-3 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-1.5 pb-2.5 mb-1.5 border-b border-brown-200/60">
                    <Layers size={14} className="text-brown-700" />
                    <span className="font-serif text-sm font-semibold text-brown-900">Craft Fiber & Yarn</span>
                  </div>
                  <div className="space-y-1">
                    {FIBER_OPTIONS.map((fiber) => {
                      const isSelected = filters.selectedMaterial === fiber.id;
                      const count =
                        fiber.id === 'all'
                          ? products.length
                          : products.filter((p) => p.yarnType.toLowerCase().includes(fiber.match)).length;

                      return (
                        <button
                          key={fiber.id}
                          type="button"
                          onClick={() => {
                            onUpdateFilters({ selectedMaterial: fiber.id });
                            tactileAudio.playScrubTick(320);
                            setActivePopover(null);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                            isSelected
                              ? 'bg-brown-900 text-cream-100 font-medium'
                              : 'text-brown-800 hover:bg-cream-200/70'
                          }`}
                        >
                          <span className="truncate">{fiber.label}</span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                isSelected ? 'bg-cream-100/20 text-cream-100' : 'text-brown-400'
                              }`}
                            >
                              {count}
                            </span>
                            {isSelected && <Check size={13} className="text-cream-100" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Color Palette Popover Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => togglePopover('color')}
                className={`h-9 px-3.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all duration-200 ${
                  activePopover === 'color' || filters.selectedColor !== 'all'
                    ? 'bg-brown-900 border-brown-900 text-cream-100 shadow-sm font-semibold'
                    : 'bg-cream-100/80 hover:bg-cream-100 border-brown-200/80 text-brown-800 hover:border-brown-400'
                }`}
              >
                <Palette size={13} className={activePopover === 'color' || filters.selectedColor !== 'all' ? 'text-cream-300' : 'text-brown-500'} />
                {filters.selectedColor !== 'all' ? (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/20 inline-block"
                      style={{
                        backgroundColor:
                          distinctColors.find((c) => c.name === filters.selectedColor)?.hex || '#4A382F',
                      }}
                    />
                    <span className="truncate max-w-[80px]">{filters.selectedColor}</span>
                  </span>
                ) : (
                  <span>Palette</span>
                )}
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${activePopover === 'color' ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Color Popover Panel */}
              {activePopover === 'color' && (
                <div className="absolute top-full -left-28 sm:left-0 mt-2.5 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-cream-50 rounded-2xl border border-brown-200 shadow-warm-lg p-3.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-brown-200/60">
                    <div className="flex items-center gap-1.5">
                      <Palette size={14} className="text-brown-700" />
                      <span className="font-serif text-sm font-semibold text-brown-900">Organic Plant Dyes</span>
                    </div>
                    {filters.selectedColor !== 'all' && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateFilters({ selectedColor: 'all' });
                          tactileAudio.playScrubTick(280);
                        }}
                        className="text-[11px] text-burgundy-600 hover:underline font-medium"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateFilters({ selectedColor: 'all' });
                        tactileAudio.playScrubTick(320);
                        setActivePopover(null);
                      }}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs text-left transition-colors col-span-2 ${
                        filters.selectedColor === 'all'
                          ? 'bg-brown-900 text-cream-100 font-medium'
                          : 'text-brown-800 hover:bg-cream-200/70'
                      }`}
                    >
                      <Sparkles size={12} className="text-blush-300" />
                      <span>All Natural Tones</span>
                    </button>
                    {distinctColors.map((color) => {
                      const isSelected = filters.selectedColor === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => {
                            onUpdateFilters({ selectedColor: color.name });
                            tactileAudio.playScrubTick(340);
                            setActivePopover(null);
                          }}
                          className={`flex items-center gap-2 p-2 rounded-xl text-xs text-left transition-all ${
                            isSelected
                              ? 'bg-brown-900 text-cream-100 font-medium shadow-sm'
                              : 'text-brown-800 hover:bg-cream-200/70 bg-cream-100/50'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0 shadow-sm"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="truncate text-[11px]">{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile / Full Filter Drawer Button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileDrawerOpen(true);
                tactileAudio.playScrubTick(300);
              }}
              className="lg:hidden h-9 px-3.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 bg-cream-100/80 hover:bg-cream-100 border border-brown-200/80 text-brown-800"
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-burgundy-600 text-cream-100 text-[9px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* RIGHT GROUP: RESULTS COUNT, SORT & GRID TOGGLE */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-4 pt-1 lg:pt-0">
            {/* Live Count */}
            <span className="text-xs text-brown-600 font-light whitespace-nowrap">
              Showing <strong className="text-brown-900 font-semibold font-serif text-sm">{filteredCount}</strong> of{' '}
              {products.length} works
            </span>

            <div className="flex items-center gap-2.5">
              {/* Custom Luxury Sort Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => togglePopover('sort')}
                  className="h-9 px-3.5 rounded-full text-xs font-medium flex items-center gap-1.5 bg-cream-100/80 hover:bg-cream-100 border border-brown-200/80 text-brown-800 hover:border-brown-400 transition-colors"
                >
                  <ArrowUpDown size={12} className="text-brown-500" />
                  <span className="hidden sm:inline text-brown-400 font-normal">Sort:</span>
                  <span className="font-semibold text-brown-900">{sortLabels[filters.sortBy]}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${activePopover === 'sort' ? 'rotate-180' : ''}`}
                  />
                </button>

                {activePopover === 'sort' && (
                  <div className="absolute top-full right-0 mt-2.5 w-52 bg-cream-50 rounded-2xl border border-brown-200 shadow-warm-lg p-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                    {(Object.keys(sortLabels) as SortOption[]).map((opt) => {
                      const isSelected = filters.sortBy === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            onUpdateFilters({ sortBy: opt });
                            tactileAudio.playScrubTick(300);
                            setActivePopover(null);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                            isSelected
                              ? 'bg-brown-900 text-cream-100 font-medium'
                              : 'text-brown-800 hover:bg-cream-200/70'
                          }`}
                        >
                          <span>{sortLabels[opt]}</span>
                          {isSelected && <Check size={13} className="text-cream-100" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Grid Column Switcher (Editorial 3-col vs Compact 4-col) */}
              <div className="hidden sm:flex items-center bg-cream-100/80 p-0.5 rounded-full border border-brown-200/80">
                <button
                  type="button"
                  title="Editorial 3-column view"
                  onClick={() => {
                    onUpdateFilters({ gridCols: 3 });
                    tactileAudio.playScrubTick(320);
                  }}
                  className={`p-1.5 rounded-full transition-colors ${
                    filters.gridCols === 3
                      ? 'bg-brown-900 text-cream-100 shadow-sm'
                      : 'text-brown-500 hover:text-brown-900'
                  }`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  type="button"
                  title="Compact 4-column view"
                  onClick={() => {
                    onUpdateFilters({ gridCols: 4 });
                    tactileAudio.playScrubTick(320);
                  }}
                  className={`p-1.5 rounded-full transition-colors ${
                    filters.gridCols === 4
                      ? 'bg-brown-900 text-cream-100 shadow-sm'
                      : 'text-brown-500 hover:text-brown-900'
                  }`}
                >
                  <Grid3X3 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE FILTERS CHIP STRIP */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 animate-in fade-in duration-200">
          <span className="text-[11px] text-brown-400 font-medium uppercase tracking-wider mr-0.5">
            Active:
          </span>

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-cream-100 border border-brown-200/80 text-brown-800 text-xs shadow-warm-sm">
              <span>Search: "{filters.searchQuery}"</span>
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
              <span>Category: {CATEGORIES.find((c) => c.id === filters.selectedCategory)?.name}</span>
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
              <span>Archive & Sale</span>
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
                Price: {filters.priceBracket === 'under-75' ? '< $75' : filters.priceBracket === '75-120' ? '$75–$120' : '$120+'}
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
              <span>Max: ${filters.maxPrice}</span>
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
              <span>Fiber: {FIBER_OPTIONS.find((f) => f.id === filters.selectedMaterial)?.label}</span>
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
              <span>Color: {filters.selectedColor}</span>
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
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* 4. MASTER MOBILE FILTER DRAWER */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-brown-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          <div className="relative ml-auto w-full max-w-sm bg-cream-50 h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-brown-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={17} className="text-brown-900" />
                  <h3 className="font-serif text-lg text-brown-900 font-medium">Refine Collection</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-full text-brown-400 hover:text-brown-800 hover:bg-cream-200"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Craft Families (Categories) */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-brown-400 font-semibold mb-2.5">
                  Craft Family
                </h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateFilters({ selectedCategory: 'all' });
                      tactileAudio.playScrubTick(320);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                      filters.selectedCategory === 'all'
                        ? 'bg-brown-900 text-cream-100 font-medium'
                        : 'text-brown-700 hover:bg-cream-200/70'
                    }`}
                  >
                    <span>All Pieces (المجموعة الكاملة)</span>
                    <span>{products.length}</span>
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onUpdateFilters({ selectedCategory: cat.id });
                        tactileAudio.playScrubTick(320);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                        filters.selectedCategory === cat.id
                          ? 'bg-brown-900 text-cream-100 font-medium'
                          : 'text-brown-700 hover:bg-cream-200/70'
                      }`}
                    >
                      <span>
                        {cat.name} ({cat.nameArabic})
                      </span>
                      <span>{products.filter((p) => p.category === cat.id).length}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Archive & Offers */}
              <div className="pt-4 border-t border-brown-200/60">
                <h4 className="text-xs uppercase tracking-wider text-brown-400 font-semibold mb-2.5">
                  Special Releases
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
                    Archive Drops & Seasonal Sale ({saleCount})
                  </span>
                </label>
              </div>

              {/* Price Filter */}
              <div className="pt-4 border-t border-brown-200/60">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs uppercase tracking-wider text-brown-400 font-semibold">
                    Price Ceiling
                  </h4>
                  <span className="text-xs font-bold text-brown-900">${filters.maxPrice}</span>
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
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-75', label: '< $75' },
                    { id: '75-120', label: '$75–$120' },
                    { id: 'over-120', label: '$120+' },
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
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fiber / Materials */}
              <div className="pt-4 border-t border-brown-200/60">
                <h4 className="text-xs uppercase tracking-wider text-brown-400 font-semibold mb-2.5">
                  Fiber & Yarn
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
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                        filters.selectedMaterial === f.id
                          ? 'bg-brown-900 text-cream-100 font-medium'
                          : 'text-brown-700 hover:bg-cream-200/60'
                      }`}
                    >
                      <span>{f.label}</span>
                      {filters.selectedMaterial === f.id && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="pt-4 border-t border-brown-200/60">
                <h4 className="text-xs uppercase tracking-wider text-brown-400 font-semibold mb-2.5">
                  Natural Plant Dyes
                </h4>
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                  {distinctColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        onUpdateFilters({
                          selectedColor: filters.selectedColor === color.name ? 'all' : color.name,
                        });
                        tactileAudio.playScrubTick(340);
                      }}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-[11px] text-left border ${
                        filters.selectedColor === color.name
                          ? 'bg-brown-900 text-cream-100 border-brown-900 font-medium'
                          : 'border-brown-200 text-brown-800 bg-cream-100/70'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="truncate">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Order */}
              <div className="pt-4 border-t border-brown-200/60">
                <h4 className="text-xs uppercase tracking-wider text-brown-400 font-semibold mb-2.5">
                  Sort Order
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
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
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
                className="w-1/3 py-3 rounded-xl border border-brown-300 text-brown-800 text-xs font-medium"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  tactileAudio.playChime();
                }}
                className="w-2/3 py-3 rounded-xl bg-brown-900 text-cream-100 text-xs font-semibold uppercase tracking-wider shadow-warm"
              >
                Show {filteredCount} Works
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
