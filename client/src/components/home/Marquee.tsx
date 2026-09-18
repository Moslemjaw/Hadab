import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const Marquee: React.FC = () => {
  const { isArabic: isAr } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);

  const itemsEn = ['Handmade', 'Jordan', 'Kuwait', 'Crochet', 'Cotton Cord', 'One of a Kind'];
  const itemsAr = ['صنع يدوي', 'الأردن', 'الكويت', 'كروشيه', 'حبال قطنية', 'قطعة فريدة'];
  const items = isAr ? itemsAr : itemsEn;

  const renderSequence = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex items-center shrink-0">
      {items.map((item, index) => (
        <React.Fragment key={`${keyPrefix}-${index}`}>
          <span className="inline-block whitespace-nowrap">{item}</span>
          <span className="text-cream-300/40 px-5 sm:px-8 text-sm sm:text-base select-none">·</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div 
      className="w-full min-h-[56px] sm:min-h-[64px] md:min-h-[70px] py-4 sm:py-5 flex items-center overflow-hidden relative bg-brown-900 border-y border-brown-950/80 shadow-md"
      dir="ltr"
    >
      <style>
        {`
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
      <div
        className="flex items-center whitespace-nowrap text-xs sm:text-sm md:text-[15px] uppercase tracking-[0.25em] sm:tracking-[0.32em] text-cream-100 font-medium w-max select-none cursor-default"
        style={{
          animation: 'marquee-scroll 35s linear infinite',
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* First half (0% to -50% translation) */}
        <div className="flex items-center shrink-0">
          {Array.from({ length: 4 }).map((_, i) => renderSequence(`a-${i}`))}
        </div>
        {/* Second half (seamless replica so -50% loop is seamless across wide screens) */}
        <div className="flex items-center shrink-0">
          {Array.from({ length: 4 }).map((_, i) => renderSequence(`b-${i}`))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;

