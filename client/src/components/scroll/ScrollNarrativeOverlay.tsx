import React from 'react';
import { ArrowDown, ChevronRight } from 'lucide-react';
import type { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ScrollNarrativeOverlayProps {
  currentFrame: number;
  floatFrame?: number;
  activeBeat: number;
  onAddToBag?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onExploreCatalog?: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const ScrollNarrativeOverlay: React.FC<ScrollNarrativeOverlayProps> = ({
  currentFrame,
  floatFrame,
  onExploreCatalog,
}) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const effectiveFrame = floatFrame ?? currentFrame;

  // Continuous Hermite smoothstep mathematical easing: zero jitter, zero snap, zero CSS lag
  const getBeatStyle = (beatIndex: number): React.CSSProperties => {
    let opacity = 0;
    let translateY = 0;

    if (beatIndex === 0) {
      // Beat 0: Hero / Overture (Frames 0 to 8)
      if (effectiveFrame <= 6) {
        opacity = 1;
        translateY = 0;
      } else if (effectiveFrame < 8.5) {
        const t = (effectiveFrame - 6) / 2.5;
        opacity = 1 - t;
        translateY = -t * 18;
      } else {
        opacity = 0;
        translateY = -18;
      }
    } else if (beatIndex === 1) {
      // Beat 1: The Form & Bag Frame (Frames 8 to 18)
      if (effectiveFrame < 7) {
        opacity = 0;
        translateY = 18;
      } else if (effectiveFrame < 9.5) {
        const t = (effectiveFrame - 7) / 2.5;
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
      {/* MAIN CINEMATIC STAGE */}
      <div className="relative w-full max-w-[1600px] mx-auto flex-1 flex items-center justify-center my-auto">
        {/* BEAT 0: HERO / THE OVERTURE (Frames 0 - 8) */}
        <div
          className="absolute inset-0 flex flex-col justify-start md:justify-center md:items-center pointer-events-none"
          style={getBeatStyle(0)}
        >
          <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between">
            <div className={`text-center ${isAr ? 'md:text-right' : 'md:text-left'} pointer-events-auto max-w-sm sm:max-w-sm mt-[43vh] xs:mt-[44vh] md:mt-0 md:-translate-y-6 lg:-translate-y-14`}>
              <div className={`flex items-center justify-center ${isAr ? 'md:justify-start' : 'md:justify-start'} gap-2 mb-3 sm:mb-4 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.28em] font-semibold text-burgundy-600`}>
                <span className="w-1.5 h-1.5 rounded-full bg-burgundy-500" />
                <span>{t.heroEyebrow}</span>
              </div>

              <div className={`flex items-baseline justify-center ${isAr ? 'md:justify-start' : 'md:justify-start'} gap-2.5 sm:gap-3 mb-2 mt-2 sm:mt-3`}>
                {isAr ? (
                  <h1 className="font-arabic text-4xl xs:text-5xl sm:text-6xl font-medium tracking-wide text-brown-900 leading-normal select-none pt-1">
                    هدب
                  </h1>
                ) : (
                  <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-brown-900 lowercase leading-none select-none">
                    hadab
                  </h1>
                )}
              </div>

              <p className="font-serif italic text-base sm:text-lg text-brown-800 leading-snug mb-1.5">
                {t.heroTagline}
              </p>

              <p className="text-xs sm:text-[13px] text-brown-600 font-light leading-relaxed tracking-wide max-w-xs mx-auto md:mx-0">
                {t.heroSubtitle}
              </p>

              <div className={`mt-3.5 sm:mt-4 flex items-center justify-center ${isAr ? 'md:justify-start' : 'md:justify-start'} gap-3`}>
                <button
                  type="button"
                  onClick={() => {
                    const shopEl = document.getElementById('shop-showcase') || document.getElementById('featured');
                    if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
                    else if (onExploreCatalog) onExploreCatalog();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2 sm:py-1.5 rounded-full bg-brown-900 text-cream-100 text-xs sm:text-[10.5px] uppercase tracking-[0.16em] sm:tracking-[0.18em] font-medium hover:bg-burgundy-600 transition-colors shadow-warm-sm min-h-[38px] sm:min-h-[34px] cursor-pointer active:scale-95"
                >
                  <span>{t.exploreWorks}</span>
                  <ChevronRight size={12} className={isAr ? 'rotate-180' : ''} />
                </button>
              </div>
            </div>

            <div className="hidden lg:block flex-1 min-w-[340px]" />
          </div>
        </div>

        {/* BEAT 1: THE FORM & BAG FRAME (Frames 8 - 18) */}
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

            {/* Center Area: Completely open for the centered Bag Frame */}
            <div className="hidden lg:block flex-1 min-w-[280px]" />

            {/* Bottom on mobile / Right on desktop */}
            <div className={`text-center ${isAr ? 'md:text-left' : 'md:text-right'} pointer-events-auto`}>
              <p className="font-serif italic text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brown-900 font-normal tracking-tight whitespace-normal sm:whitespace-nowrap select-none animate-breathe-right transition-transform duration-700">
                {t.beat1Title2}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 pointer-events-auto z-30">
        <button
          type="button"
          onClick={() => {
            const target = document.getElementById('shop-showcase') || document.getElementById('featured');
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            } else if (onExploreCatalog) {
              onExploreCatalog();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-cream-100/95 hover:bg-cream-50 backdrop-blur-md border border-brown-300/70 shadow-warm text-brown-700 transition-all hover:scale-105 active:scale-95 select-none min-h-[38px] cursor-pointer"
        >
          <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em] sm:tracking-[0.22em] font-semibold text-brown-800">
            {isAr ? 'مرّر للاستكشاف' : 'Scroll to Explore Shop'}
          </span>
          <ArrowDown size={13} className="text-burgundy-600 animate-bounce" />
        </button>
      </div>
    </div>
  );
};
