import React from 'react';
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
            <div className={`text-center ${isAr ? 'md:text-right' : 'md:text-left'} pointer-events-auto max-w-sm sm:max-w-md mt-[42vh] xs:mt-[43vh] md:mt-0 md:-translate-y-6 lg:-translate-y-12`}>
              <div className={`flex items-baseline justify-center ${isAr ? 'md:justify-start' : 'md:justify-start'} gap-2.5 sm:gap-3`}>
                {isAr ? (
                  <h1 className="font-arabic text-5xl xs:text-6xl sm:text-7xl font-medium tracking-wide text-brown-900 leading-normal select-none pt-1">
                    هدب
                  </h1>
                ) : (
                  <h1 className="font-display text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-brown-900 lowercase leading-none select-none">
                    hadab
                  </h1>
                )}
              </div>

              <p className="font-serif italic text-lg sm:text-xl lg:text-2xl text-brown-800 leading-snug mt-3">
                {isAr ? 'صُنع يدوياً ليومك.' : 'Handmade for your day.'}
              </p>
            </div>

            <div className="hidden lg:block flex-1 min-w-[340px]" />
          </div>
        </div>

        {/* BEAT 1: THE FORM & BAG FRAME (Frames 8 - 18) */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={getBeatStyle(1)}
        >
          <div className="w-full max-w-[1700px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            {/* Left sentence on desktop */}
            <div className={`text-center ${isAr ? 'md:text-right' : 'md:text-left'} pointer-events-auto max-w-xs sm:max-w-sm lg:max-w-md`}>
              <p className="font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-brown-900 font-normal tracking-tight select-none">
                {t.beat1Title1}
              </p>
            </div>

            {/* Guaranteed Center Safe Zone for Bag */}
            <div className="hidden md:block flex-shrink-0 w-[420px] lg:w-[500px] xl:w-[580px]" />

            {/* Right sentence on desktop */}
            <div className={`text-center ${isAr ? 'md:text-left' : 'md:text-right'} pointer-events-auto max-w-xs sm:max-w-sm lg:max-w-md`}>
              <p className="font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-brown-900 font-normal tracking-tight select-none">
                {t.beat1Title2}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Luxury Scroll Cue */}
      <div 
        onClick={() => {
          const target = document.getElementById('shop-showcase') || document.getElementById('featured');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          } else if (onExploreCatalog) {
            onExploreCatalog();
          }
        }}
        className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 pointer-events-auto z-30 flex flex-col items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity select-none"
      >
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-medium text-brown-600">
          {isAr ? 'مرّر' : 'scroll'}
        </span>
        <div className="w-[1px] h-7 bg-brown-400/30 overflow-hidden relative">
          <div className="w-full h-1/2 bg-brown-800 animate-pulse absolute top-0" style={{ animationDuration: '1.8s' }} />
        </div>
      </div>
    </div>
  );
};
