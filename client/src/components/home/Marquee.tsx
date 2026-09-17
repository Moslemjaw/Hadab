import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const Marquee: React.FC = () => {
  const { isArabic: isAr } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);

  const itemsEn = ['Handmade', 'Kuwait', 'Crochet', 'Cotton Cord', 'One of a Kind'];
  const itemsAr = ['يدوي', 'الكويت', 'كروشيه', 'حبال قطنية', 'قطعة فريدة'];
  const items = isAr ? itemsAr : itemsEn;

  const renderSequence = () => (
    <div className="flex items-center">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span>{item}</span>
          <span className="opacity-50 px-4">·</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div 
      className="w-full h-[60px] flex items-center border-y border-brown-200/60 overflow-hidden relative bg-transparent"
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
        className="flex items-center whitespace-nowrap text-xs uppercase tracking-[0.3em] text-brown-400 font-medium w-max"
        style={{
          animation: 'marquee-scroll 25s linear infinite',
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* We duplicate the sequence 4 times. 
            The animation translates to -50%, which exactly spans 2 sequences,
            ensuring a seamless loop without jumping. */}
        {renderSequence()}
        {renderSequence()}
        {renderSequence()}
        {renderSequence()}
      </div>
    </div>
  );
};

export default Marquee;
