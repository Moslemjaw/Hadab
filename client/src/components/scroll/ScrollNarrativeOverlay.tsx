import React, { useState, useEffect } from 'react';
import { ArrowDown, ChevronRight, ShoppingBag, Eye, Heart } from 'lucide-react';
import type { Product } from '../../types';
import { FEATURED_PRODUCTS, CATEGORIES } from '../../constants/mockData';
import { tactileAudio } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

interface ScrollNarrativeOverlayProps {
  currentFrame: number;
  floatFrame?: number;
  activeBeat: number;
  onAddToBag: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onExploreCatalog?: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const ScrollNarrativeOverlay: React.FC<ScrollNarrativeOverlayProps> = ({
  currentFrame,
  floatFrame,
  activeBeat,
  onAddToBag,
  onSelectProduct,
  onExploreCatalog,
  onSelectCategory,
}) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const [categorySlide, setCategorySlide] = useState(0);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
    tactileAudio.playScrubTick(440);
  };

  // Automatically advance craft family slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCategorySlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const effectiveFrame = floatFrame ?? currentFrame;

  // Continuous Hermite smoothstep mathematical easing: zero jitter, zero snap, zero CSS lag
  const getBeatStyle = (beatIndex: number): React.CSSProperties => {
    let opacity = 0;
    let translateY = 0;

    if (beatIndex === 0) {
      // Beat 0: Hero / Overture (Frames 0 to 11)
      if (effectiveFrame <= 8) {
        opacity = 1;
        translateY = 0;
      } else if (effectiveFrame < 10.5) {
        const t = (effectiveFrame - 8) / 2.5;
        opacity = 1 - t;
        translateY = -t * 18;
      } else {
        opacity = 0;
        translateY = -18;
      }
    } else if (beatIndex === 1) {
      // Beat 1: The Form & Philosophy (Frames 12 to 20)
      if (effectiveFrame < 11.5) {
        opacity = 0;
        translateY = 18;
      } else if (effectiveFrame < 13.5) {
        const t = (effectiveFrame - 11.5) / 2;
        opacity = t;
        translateY = (1 - t) * 18;
      } else if (effectiveFrame <= 18.5) {
        opacity = 1;
        translateY = 0;
      } else if (effectiveFrame < 20.5) {
        const t = (effectiveFrame - 18.5) / 2;
        opacity = 1 - t;
        translateY = -t * 18;
      } else {
        opacity = 0;
        translateY = -18;
      }
    } else if (beatIndex === 2) {
      // Beat 2: Curated Collection / Featured Products (Frames 21 to 29)
      if (effectiveFrame < 21.5) {
        opacity = 0;
        translateY = 18;
      } else if (effectiveFrame < 23.5) {
        const t = (effectiveFrame - 21.5) / 2;
        opacity = t;
        translateY = (1 - t) * 18;
      } else if (effectiveFrame <= 27.5) {
        opacity = 1;
        translateY = 0;
      } else if (effectiveFrame < 29.5) {
        const t = (effectiveFrame - 27.5) / 2;
        opacity = 1 - t;
        translateY = -t * 18;
      } else {
        opacity = 0;
        translateY = -18;
      }
    } else if (beatIndex === 3) {
      // Beat 3: Categories / Craft Families (Frames 30 to 35)
      if (effectiveFrame < 30.5) {
        opacity = 0;
        translateY = 18;
      } else if (effectiveFrame < 32.5) {
        const t = (effectiveFrame - 30.5) / 2;
        opacity = t;
        translateY = (1 - t) * 18;
      } else {
        opacity = 1;
        translateY = 0;
      }
    }

    // Smoothstep Hermite curve: 3t^2 - 2t^3
    const smoothOpacity = opacity * opacity * (3 - 2 * opacity);
    const clampedOpacity = Math.max(0, Math.min(1, smoothOpacity));

    if (clampedOpacity <= 0.005) {
      return {
        opacity: 0,
        pointerEvents: 'none',
        display: 'none',
      };
    }

    return {
      opacity: clampedOpacity,
      transform: `translateY(${translateY.toFixed(1)}px)`,
      pointerEvents: clampedOpacity > 0.4 ? 'auto' : 'none',
      willChange: 'opacity, transform',
    };
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between px-3 xs:px-4 sm:px-10 pt-2 pb-5 select-none overflow-hidden font-sans safe-top safe-bottom">

      {/* =========================================================================
          MAIN CINEMATIC STAGE — NEVER COVERS THE CENTER ARTWORK!
      ========================================================================== */}
      <div className="relative w-full max-w-[1600px] mx-auto flex-1 flex items-center justify-center my-auto">
        {/* =========================================================================
            BEAT 0: HERO / THE OVERTURE (Frames 0 - 11)
            Aligned with navbar start, responsive padding and font sizing
        ========================================================================== */}
        <div
          className="absolute inset-0 flex flex-col justify-start md:justify-center md:items-center pointer-events-none"
          style={getBeatStyle(0)}
        >
          <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 flex flex-col md:flex-row items-center md:items-center justify-between">
            {/* Editorial Statement: Positioned directly below logo on mobile with minimal gap, Left on desktop */}
            <div className={`text-center ${isAr ? 'md:text-right' : 'md:text-left'} pointer-events-auto max-w-sm sm:max-w-sm mt-[43vh] xs:mt-[44vh] md:mt-0 md:-translate-y-6 lg:-translate-y-14`}>
              {/* Provenance eyebrow */}
              <div className={`flex items-center justify-center ${isAr ? 'md:justify-start' : 'md:justify-start'} gap-2 mb-2 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.28em] font-semibold text-burgundy-600`}>
                <span className="w-1.5 h-1.5 rounded-full bg-burgundy-500" />
                <span>{t.heroEyebrow}</span>
              </div>

              {/* Brand Title: single language according to active switch */}
              <div className={`flex items-baseline justify-center ${isAr ? 'md:justify-start' : 'md:justify-start'} gap-2.5 sm:gap-3 mb-2`}>
                {isAr ? (
                  <h1 className="font-arabic text-4xl xs:text-5xl sm:text-6xl font-medium tracking-wide text-brown-900 leading-none select-none">
                    هَدَب
                  </h1>
                ) : (
                  <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-brown-900 lowercase leading-none select-none">
                    hadab
                  </h1>
                )}
              </div>

              {/* Signature Hook / Tagline */}
              <p className="font-serif italic text-base sm:text-lg text-brown-800 leading-snug mb-1.5">
                {t.heroTagline}
              </p>

              {/* Minimal sub-line */}
              <p className="text-xs sm:text-[13px] text-brown-600 font-light leading-relaxed tracking-wide max-w-xs mx-auto md:mx-0">
                {t.heroSubtitle}
              </p>

              {/* Clean minimal action affordance with 40px+ touch target */}
              <div className={`mt-3.5 sm:mt-4 flex items-center justify-center ${isAr ? 'md:justify-start' : 'md:justify-start'} gap-3`}>
                <a
                  href="#catalog"
                  className="inline-flex items-center gap-2 px-5 py-2 sm:py-1.5 rounded-full bg-brown-900 text-cream-100 text-xs sm:text-[10.5px] uppercase tracking-[0.16em] sm:tracking-[0.18em] font-medium hover:bg-burgundy-600 transition-colors shadow-warm-sm min-h-[38px] sm:min-h-[34px]"
                >
                  <span>{t.exploreWorks}</span>
                  <ChevronRight size={12} className={isAr ? 'rotate-180' : ''} />
                </a>
              </div>
            </div>

            {/* Generous breathing room so central motif is completely clear */}
            <div className="hidden lg:block flex-1 min-w-[340px]" />
          </div>
        </div>

        {/* =========================================================================
            BEAT 1: THE FORM & BRAND LINE (Frames 12 - 20)
            Mobile-optimized: stacks top & bottom around the center bag on portrait screens,
            side-by-side on desktop.
        ========================================================================== */}
        <div
          className="absolute inset-0 flex items-center pointer-events-none"
          style={getBeatStyle(1)}
        >
          <div className="w-full max-w-[1400px] mx-auto px-4 xs:px-6 sm:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between h-[65vh] md:h-auto py-6 md:py-0">
            {/* Top on mobile / Left on desktop */}
            <div className={`text-center ${isAr ? 'md:text-right' : 'md:text-left'} pointer-events-auto`}>
              <p className="font-serif italic text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brown-900 font-normal tracking-tight whitespace-normal sm:whitespace-nowrap select-none animate-breathe-left transition-transform duration-700">
                {t.beat1Title1}
              </p>
            </div>

            {/* Center Area: Completely open for the 3D Bag */}
            <div className="hidden lg:block flex-1 min-w-[280px]" />

            {/* Bottom on mobile / Right on desktop */}
            <div className={`text-center ${isAr ? 'md:text-left' : 'md:text-right'} pointer-events-auto`}>
              <p className="font-serif italic text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brown-900 font-normal tracking-tight whitespace-normal sm:whitespace-nowrap select-none animate-breathe-right transition-transform duration-700">
                {t.beat1Title2}
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BEAT 2: CURATED COLLECTION / FEATURED PIECES (Frames 21 - 29)
            Responsive padding, readable mobile typography, touch-friendly targets
        ========================================================================== */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none p-1.5 xs:p-2 sm:p-4"
          style={getBeatStyle(2)}
        >
          <div className="w-full max-w-[1240px] mx-auto pointer-events-auto flex flex-col justify-center my-auto px-2 xs:px-3 sm:px-8">
            {/* Header: Compact on mobile */}
            <div className="w-full text-center mb-2 xs:mb-3 sm:mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-cream-100/90 backdrop-blur-md border border-brown-200/60 text-burgundy-600 text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.22em] sm:tracking-[0.28em] mb-1.5 sm:mb-2 shadow-warm-sm">
                <span>{t.archiveBadge}</span>
              </div>
              <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl lg:text-5xl text-brown-800 font-normal leading-tight">
                {t.curatedTitle}
              </h2>
              <p className="text-xs sm:text-sm text-brown-600 font-light mt-1 sm:mt-2 max-w-lg mx-auto leading-relaxed line-clamp-2 sm:line-clamp-none">
                {t.curatedSubtitle}
              </p>
            </div>

            {/* 1 Row of Product Cards: 2 cols on mobile, 4 cols on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-5">
              {FEATURED_PRODUCTS.slice(0, 4).map((prod) => {
                const prodName = isAr && prod.nameArabic ? prod.nameArabic : prod.name;
                const prodStitch = isAr && prod.stitchDetailArabic ? prod.stitchDetailArabic : prod.stitchDetail;
                return (
                  <div
                    key={prod.id}
                    onClick={() => onSelectProduct && onSelectProduct(prod)}
                    className="group relative bg-cream-100/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-brown-200/70 p-2 xs:p-2.5 sm:p-3 shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.99] hover:-translate-y-0.5"
                  >
                    <div>
                      {/* Editorial Image Container */}
                      <div className="relative aspect-[4/3.2] sm:aspect-[4/3.5] rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-3 bg-cream-200 shadow-inner">
                        <img
                          src={prod.image}
                          alt={prodName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brown-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Wishlist Heart Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleWishlist(prod.id, e)}
                          aria-label={wishlist[prod.id] ? `Remove ${prodName} from wishlist` : `Add ${prodName} to wishlist`}
                          className={`absolute top-1.5 ${isAr ? 'left-1.5 xs:left-2' : 'right-1.5 xs:right-2'} xs:top-2 w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-cream-100/90 hover:bg-cream-50 backdrop-blur-md border border-brown-200/60 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm z-10`}
                        >
                          <Heart
                            size={13}
                            className={`transition-colors duration-200 ${
                              wishlist[prod.id]
                                ? 'fill-burgundy-600 text-burgundy-600'
                                : 'text-brown-700 hover:text-burgundy-600'
                            }`}
                          />
                        </button>

                        {/* Quick View Pill - Visible on mobile for touch clarity */}
                        <div className={`absolute bottom-1.5 ${isAr ? 'left-1.5 xs:left-2' : 'right-1.5 xs:right-2'} xs:bottom-2 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300`}>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-full bg-brown-900/80 backdrop-blur-md text-cream-100 text-[9px] xs:text-[9.5px] font-medium shadow-sm">
                            <Eye size={10} />
                            <span>{t.details}</span>
                          </span>
                        </div>
                      </div>

                      {/* Product Metadata */}
                      <div className="px-0.5">
                        <div className="flex justify-between items-baseline mb-0.5 sm:mb-1">
                          <h3 className="font-serif text-xs xs:text-sm sm:text-base font-semibold text-brown-900 group-hover:text-burgundy-600 transition-colors truncate pr-1">
                            {prodName}
                          </h3>
                          <span className="font-serif text-xs xs:text-sm sm:text-base font-semibold text-brown-900 shrink-0">
                            ${prod.price}
                          </span>
                        </div>

                        <p className="text-[10px] xs:text-[11px] text-brown-600 font-light line-clamp-1 mb-2 sm:mb-3 leading-relaxed">
                          {prodStitch}
                        </p>
                      </div>
                    </div>

                    {/* Clean Single Action Button with 38px+ touch target */}
                    <div className="pt-1.5 sm:pt-2 border-t border-brown-200/50">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToBag(prod);
                        }}
                        className="w-full py-2 sm:py-2.5 px-2.5 rounded-lg sm:rounded-xl bg-brown-900 hover:bg-burgundy-600 text-cream-100 text-[10px] xs:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.16em] font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-warm active:scale-[0.98] min-h-[38px] sm:min-h-[40px]"
                      >
                        <ShoppingBag size={13} />
                        <span>{t.addToBag}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View More Button */}
            <div className="mt-3 sm:mt-5 text-center">
              <button
                type="button"
                onClick={() => onExploreCatalog && onExploreCatalog()}
                className="inline-flex items-center gap-2.5 px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-brown-900 hover:bg-burgundy-600 text-cream-100 text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase transition-all duration-300 shadow-warm hover:shadow-warm-lg active:scale-95 group"
              >
                <span>{t.viewMore}</span>
                <ChevronRight size={16} className={`transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BEAT 3: CRAFT FAMILIES / CATEGORIES (Frames 30 - 35)
            Responsive stack on mobile, clean side-by-side on desktop
        ========================================================================== */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none p-1.5 xs:p-2 sm:p-4"
          style={getBeatStyle(3)}
        >
          <div className="w-full max-w-[1280px] mx-auto pointer-events-auto flex flex-col justify-center my-auto px-3 xs:px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-5 lg:gap-24 xl:gap-32 items-center mb-2 sm:mb-5">
              {/* Left Page: Title, Description, and (on desktop) Slide Controls — Frosted card on mobile for legibility over threads */}
              <div className={`w-full max-w-[420px] mx-auto ${isAr ? 'lg:mr-auto lg:ml-8 xl:ml-12 lg:items-end lg:text-right' : 'lg:ml-auto lg:mr-8 xl:mr-12 lg:items-start lg:text-left'} flex flex-col items-center text-center shrink-0 bg-cream-100/95 backdrop-blur-md rounded-2xl border border-brown-200/60 p-4 shadow-warm lg:bg-transparent lg:backdrop-blur-none lg:rounded-none lg:border-0 lg:p-0 lg:shadow-none`}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-100/90 backdrop-blur-md border border-brown-200/60 text-burgundy-600 text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.22em] sm:tracking-[0.25em] mb-2 sm:mb-3 shadow-warm-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy-600 animate-pulse" />
                  <span>{t.craftFamiliesBadge}</span>
                </div>
                <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl lg:text-[42px] text-brown-900 font-normal leading-[1.15]">
                  {t.craftFamiliesTitle} <br className="hidden sm:inline" />
                  <span className="italic text-burgundy-600">{t.craftFamiliesHighlight}</span>
                </h2>
                <p className="text-xs xs:text-sm sm:text-base text-brown-700 font-light mt-2 sm:mt-3 leading-relaxed max-w-sm lg:max-w-none">
                  {t.craftFamiliesSubtitle}
                </p>

                {/* DESKTOP ONLY: Category Pill Buttons in Left Column */}
                <div className="hidden lg:flex items-center gap-2.5 mt-5 pt-4 border-t border-brown-200/70 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setCategorySlide(0);
                      tactileAudio.playScrubTick(320);
                    }}
                    className={`text-[11px] uppercase tracking-wider font-semibold px-4 py-2 rounded-full transition-all min-h-[38px] flex items-center justify-center ${
                      categorySlide === 0
                        ? 'bg-burgundy-600 text-cream-100 shadow-sm'
                        : 'bg-cream-100/80 text-brown-700 hover:text-brown-900 border border-brown-200/80 hover:bg-cream-100 backdrop-blur-sm'
                    }`}
                  >
                    {t.family01Tab}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategorySlide(1);
                      tactileAudio.playScrubTick(360);
                    }}
                    className={`text-[11px] uppercase tracking-wider font-semibold px-4 py-2 rounded-full transition-all min-h-[38px] flex items-center justify-center ${
                      categorySlide === 1
                        ? 'bg-burgundy-600 text-cream-100 shadow-sm'
                        : 'bg-cream-100/80 text-brown-700 hover:text-brown-900 border border-brown-200/80 hover:bg-cream-100 backdrop-blur-sm'
                    }`}
                  >
                    {t.family02Tab}
                  </button>
                </div>
              </div>

              {/* Right Page: 2 Cards stacked (+ MOBILE ONLY: Buttons Underneath) */}
              <div className={`w-full max-w-[450px] mx-auto ${isAr ? 'lg:ml-auto lg:mr-2 xl:mr-4' : 'lg:mr-auto lg:ml-2 xl:ml-4'} flex flex-col gap-3 sm:gap-4 relative`}>
                <div
                  key={categorySlide}
                  className="flex flex-col gap-2.5 sm:gap-3.5 animate-slide-swap"
                >
                  {(categorySlide === 0 ? CATEGORIES.slice(0, 2) : CATEGORIES.slice(2, 4)).map((cat, idx) => {
                    const familyNum = categorySlide * 2 + idx + 1;
                    const catName = isAr && cat.nameArabic ? cat.nameArabic : cat.name;
                    const catDesc = isAr && cat.descriptionArabic ? cat.descriptionArabic : cat.description;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          if (onSelectCategory) {
                            onSelectCategory(cat.id);
                          } else if (onExploreCatalog) {
                            onExploreCatalog();
                          } else {
                            const catEl = document.getElementById('catalog');
                            if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="group relative bg-cream-100/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-brown-200/80 p-2.5 xs:p-3 sm:p-4 shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-row items-center gap-3 sm:gap-4 cursor-pointer hover:-translate-y-0.5 active:scale-[0.99]"
                      >
                        {/* Enlarged Image Container */}
                        <div className="relative w-24 xs:w-28 sm:w-36 aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden shrink-0 bg-cream-200 shadow-inner">
                          <img
                            src={cat.image}
                            alt={catName}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brown-950/60 via-transparent to-transparent" />
                          <span className={`absolute bottom-1 ${isAr ? 'right-2' : 'left-2'} font-serif text-base sm:text-xl text-cream-100 font-normal drop-shadow`}>
                            {catName}
                          </span>
                          <span className={`absolute top-1 ${isAr ? 'left-1' : 'right-1'} px-1.5 py-0.5 rounded-full bg-cream-100/90 backdrop-blur-sm text-brown-800 text-[8.5px] sm:text-[9px] font-semibold`}>
                            {cat.count} {t.pieces}
                          </span>
                        </div>

                        {/* Metadata */}
                        <div className={`flex-1 min-w-0 flex flex-col justify-between py-0.5 sm:py-1 ${isAr ? 'text-right' : 'text-left'}`}>
                          <div>
                            <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-burgundy-600 font-bold mb-0.5">
                              {t.familyPrefix} 0{familyNum}
                            </div>
                            <h3 className="font-serif text-base sm:text-xl font-semibold text-brown-800 group-hover:text-burgundy-600 transition-colors truncate">
                              {catName}
                            </h3>
                            <p className="text-[11px] xs:text-xs sm:text-[13px] text-brown-600 font-light line-clamp-1 xs:line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed">
                              {catDesc}
                            </p>
                          </div>

                          <div className="mt-1.5 sm:mt-2.5 pt-1.5 sm:pt-2 border-t border-brown-200/50 flex items-center justify-between text-[11px] sm:text-[11.5px] text-burgundy-600 font-medium">
                            <span>{t.viewCollection}</span>
                            <ChevronRight size={13} className={`transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* MOBILE ONLY: The Two Category Pill Buttons Under Categories */}
                <div className="flex lg:hidden items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCategorySlide(0);
                      tactileAudio.playScrubTick(320);
                    }}
                    className={`text-[10px] xs:text-[11px] uppercase tracking-wider font-semibold px-4 py-2 rounded-full transition-all min-h-[38px] flex items-center justify-center ${
                      categorySlide === 0
                        ? 'bg-burgundy-600 text-cream-100 shadow-sm'
                        : 'bg-cream-100/90 text-brown-700 hover:text-brown-900 border border-brown-200/80 hover:bg-cream-100 backdrop-blur-sm shadow-warm-sm'
                    }`}
                  >
                    {t.family01Tab}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategorySlide(1);
                      tactileAudio.playScrubTick(360);
                    }}
                    className={`text-[10px] xs:text-[11px] uppercase tracking-wider font-semibold px-4 py-2 rounded-full transition-all min-h-[38px] flex items-center justify-center ${
                      categorySlide === 1
                        ? 'bg-burgundy-600 text-cream-100 shadow-sm'
                        : 'bg-cream-100/90 text-brown-700 hover:text-brown-900 border border-brown-200/80 hover:bg-cream-100 backdrop-blur-sm shadow-warm-sm'
                    }`}
                  >
                    {t.family02Tab}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Atelier Cue - Accessible with safe-area offset and touch target */}
      <div className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 pointer-events-auto z-30">
        <button
          type="button"
          onClick={() => {
            if (activeBeat === 3 && onSelectCategory) {
              onSelectCategory('bags');
            } else if (onExploreCatalog) {
              onExploreCatalog();
            } else {
              const catEl = document.getElementById('catalog');
              if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-cream-100/90 hover:bg-cream-50 backdrop-blur-md border border-brown-300/70 shadow-warm text-brown-700 transition-all hover:scale-105 active:scale-95 select-none min-h-[38px]"
        >
          <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em] sm:tracking-[0.22em] font-semibold text-brown-800">
            {activeBeat === 3 ? (isAr ? 'تصفح المتجر' : 'Explore Shop') : (isAr ? 'مرّر للاستكشاف' : 'Scroll to Explore')}
          </span>
          <ArrowDown size={13} className="text-burgundy-600 animate-bounce" />
        </button>
      </div>

    </div>
  );
};
