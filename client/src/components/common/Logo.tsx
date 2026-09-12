import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showArabic?: boolean;
  variant?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
}) => {
  const { language } = useLanguage();
  const iconDimensions = {
    sm: { w: 24, h: 24, stroke: 2.2 },
    md: { w: 32, h: 32, stroke: 2.4 },
    lg: { w: 44, h: 44, stroke: 2.8 },
    hero: { w: 72, h: 72, stroke: 3.2 },
  }[size];

  const textSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    hero: 'text-5xl md:text-6xl',
  }[size];

  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${isLight ? 'text-cream-100' : 'text-brown-700'} ${className}`}>
      {/* Symmetrical Two-Loop Stitch Motif */}
      <svg
        width={iconDimensions.w}
        height={iconDimensions.h}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
      >
        {/* Left yarn loop */}
        <path
          d="M32 46C22 46 14 38 14 28C14 18 22 14 28 14C34 14 36 22 36 28C36 38 26 46 32 50C38 46 28 38 28 28C28 22 30 14 36 14C42 14 50 18 50 28C50 38 42 46 32 46Z"
          stroke="currentColor"
          strokeWidth={iconDimensions.stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Central connecting stitch knot */}
        <circle cx="32" cy="28" r="2.5" fill="currentColor" />
      </svg>

      {/* Brand Wordmark - pure Arabic or pure English according to active language */}
      <div className="flex flex-col leading-none justify-center">
        {language === 'ar' ? (
          <img
            src={isLight ? '/arabic.png' : '/arabic-dark.png'}
            alt="هَدَب"
            className={`${
              size === 'sm' ? 'h-4' : size === 'md' ? 'h-5' : size === 'lg' ? 'h-7' : 'h-9 md:h-10'
            } w-auto object-contain`}
          />
        ) : (
          <span className={`font-display font-medium tracking-tight lowercase ${isLight ? 'text-cream-100' : 'text-brown-700'} ${textSize}`}>
            hadab
          </span>
        )}
      </div>
    </div>
  );
};

