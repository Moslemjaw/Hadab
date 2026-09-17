import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const BrandStatement: React.FC = () => {
  const { isArabic: isAr } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const lines = [
    { en: 'Every piece is handmade.', ar: 'كل قطعة مصنوعة يدوياً.' },
    { en: 'Every stitch is intentional.', ar: 'كل غرزة مقصودة.' },
    { en: 'Made in Kuwait.', ar: 'صُنع في الكويت.' },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-[50vh] md:min-h-[60vh] bg-cream-200 flex flex-col justify-center items-center px-6 overflow-hidden py-16"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div
        className={`w-[60px] h-px bg-brown-300/50 mb-8 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
        }`}
        style={{ transitionDelay: '0ms' }}
      ></div>

      <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
        {lines.map((line, index) => (
          <h2
            key={index}
            className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brown-800 font-normal leading-relaxed transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
            }`}
            style={{
              transitionDelay: `${(index + 1) * 200}ms`,
            }}
          >
            {isAr ? line.ar : line.en}
          </h2>
        ))}
      </div>
    </section>
  );
};

export default BrandStatement;
