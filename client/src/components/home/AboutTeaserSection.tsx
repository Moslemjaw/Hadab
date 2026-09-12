import React from 'react';
import { ThreadKnot } from '../common/ThreadSpine';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const AboutTeaserSection: React.FC = () => {
  const { language } = useLanguage();

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="relative rounded-3xl bg-cream-100 border border-brown-200 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-warm">
        {/* Decorative background watermark */}
        <div className="absolute -bottom-10 -right-10 font-arabic text-9xl text-brown-200/20 select-none pointer-events-none">
          {language === 'ar' ? 'هَدَب' : 'HADAB'}
        </div>

        <div className="relative z-10 max-w-2xl">
          <ThreadKnot
            color="brown"
            label={language === 'ar' ? 'الغرزة السابعة • الاسم والجوهر' : 'STITCH VII • THE NAME'}
            className="!items-start mb-6"
          />

          <h2 className="font-serif text-3xl sm:text-4xl text-brown-800 font-normal leading-tight mb-6">
            {language === 'ar'
              ? 'التفاصيل الدقيقة التي تمنح كل قطعة هويتها المستقلة.'
              : 'The small details that make each piece special.'}
          </h2>

          <p className="text-brown-600 text-base sm:text-lg leading-relaxed font-light mb-4">
            {language === 'ar' ? (
              <>
                <strong className="font-semibold text-brown-800">«هَدَب»</strong> هي الخيوط أو الأطراف المنسوجة على حافة القماش. قد تبدو بسيطة وعابرة للوهلة الأولى، لكنها العنصر الذي يمنح القطعة اكتمالها وروحها المميزة.
              </>
            ) : (
              <>
                <strong>HADAB</strong> refers to the delicate fringes and threads gracing the edge of woven fabric. Seemingly understated, yet they are what make a crafted piece truly complete.
              </>
            )}
          </p>

          <p className="text-brown-500 text-sm sm:text-base leading-relaxed font-light mb-8">
            {language === 'ar'
              ? 'كل غرزة ننسجها في حقائبنا وإكسسواراتنا تنبع من هذه الرؤية: أن الجمال الحقيقي يكمن في التفاصيل الهادئة والانسجام العفوي مع حياتك اليومية.'
              : 'Every stitch we hand-craft embodies this philosophy: true luxury resides in thoughtful proportions, tactile honesty, and timeless everyday presence.'}
          </p>

          <a
            href="#story"
            className="inline-flex items-center gap-2 text-sm font-semibold text-burgundy-500 hover:text-burgundy-600 group transition-colors"
          >
            <span>{language === 'ar' ? 'اقرأ قصة الاستوديو الكاملة' : 'Read our complete studio story'}</span>
            {language === 'ar' ? (
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            )}
          </a>
        </div>
      </div>
    </section>
  );
};
