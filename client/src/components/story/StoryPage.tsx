import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface StoryPageProps {
  onBackToHome: () => void;
  onExploreCollection: () => void;
  onOpenCategories?: () => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({
  onBackToHome,
  onExploreCollection,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <article className="w-full bg-cream-200 text-brown-800 font-sans selection:bg-blush-200 selection:text-brown-900 min-h-screen pb-24">
      {/* Minimal Sticky Sub-Header Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="sticky top-[53px] sm:top-[63px] z-30 border-b border-brown-200/60 bg-cream-200/90 backdrop-blur-md transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-brown-700 hover:text-brown-950 transition-colors cursor-pointer min-h-[44px]"
          >
            <ArrowLeft
              size={14}
              className={isAr ? 'rotate-180 group-hover:translate-x-1 transition-transform' : 'group-hover:-translate-x-1 transition-transform'}
            />
            <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </button>

          <div className="flex items-center gap-4">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-brown-400 hidden sm:inline">
              HADAB • {isAr ? 'قصتنا' : 'Our Story'}
            </span>
            <button
              type="button"
              onClick={onExploreCollection}
              className="text-xs uppercase tracking-[0.18em] font-bold text-brown-900 hover:text-burgundy-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{isAr ? 'المجموعة' : 'The Collection'}</span>
              <ArrowRight size={13} className={isAr ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-12 sm:pt-20 lg:pt-28 space-y-20 sm:space-y-32 lg:space-y-40">
        {/* Section 1: Editorial Opening Hero */}
        <header className="text-center space-y-6 sm:space-y-8 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-100/80 border border-brown-200/80 text-brown-600 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold shadow-2xs">
            <Sparkles size={12} className="text-burgundy-600" />
            <span>{isAr ? 'قصتنا' : 'Our Story'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] text-brown-950 font-normal leading-[1.14] tracking-tight">
            {isAr ? (
              <>
                بدأت <span className="font-arabic italic">هَدَب</span> بحب صنع الأشياء باليد.
              </>
            ) : (
              <>
                HADAB started with a love for <span className="italic font-serif">making things by hand.</span>
              </>
            )}
          </h1>

          <div className="w-16 h-px bg-brown-300/80 mx-auto mt-6 sm:mt-8" />
        </header>

        {/* Section 2: Personal Memory (Teta at 12) with Rich Editorial Spread */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-warm border border-brown-200/80 bg-cream-100 group max-w-md lg:max-w-none mx-auto">
              <img
                src="/products/hadab-bag.jpg"
                alt={isAr ? 'حياكة يدوية' : 'Handmade crochet piece'}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-950/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 inset-x-6 text-center">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.26em] text-cream-100/95 font-medium">
                  {isAr ? 'حياكة يدوية بالغرزة الواحدة' : 'Handmade stitch by stitch'}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-5 sm:space-y-7 lg:pl-4">
            <span className="text-xs uppercase tracking-[0.3em] text-brown-400 font-semibold block">
              {isAr ? 'البداية • من الذاكرة' : 'The Beginning'}
            </span>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] text-brown-950 font-normal leading-[1.28]">
              {isAr ? (
                <>
                  تعلّمتُ الكروشيه من <span className="italic font-arabic text-brown-950 font-medium">تيتة</span> عندما كنتُ في الثانية عشرة من عمري.
                </>
              ) : (
                <>
                  I learned how to crochet from my <span className="italic font-serif">teta</span> when I was 12.
                </>
              )}
            </p>
            <p className="text-base sm:text-lg md:text-xl text-brown-600 font-light leading-relaxed max-w-2xl">
              {isAr ? (
                'ما بدأ كشيء أصنعه لمجرد المتعة، تحوّل رويداً رويداً إلى وسيلة لأبتكر قطعاً صغيرة تحمل روحاً خاصة، مختلفة، ومصنوعة لتُحب.'
              ) : (
                'What started as something I made just for fun slowly became a way for me to create little pieces that feel personal, different, and made to be loved.'
              )}
            </p>
          </div>
        </section>

        {/* Section 3: The Centerpiece — Etymology of HADAB — هَدَب */}
        <section className="p-8 sm:p-14 lg:p-20 xl:p-24 rounded-3xl lg:rounded-[2.5rem] bg-cream-100/90 border border-brown-300/60 shadow-warm relative overflow-hidden text-center space-y-8 lg:space-y-10">
          {/* Subtle Watermark Motifs */}
          <div className="absolute -bottom-12 -right-12 opacity-[0.03] select-none pointer-events-none font-arabic text-[16rem] lg:text-[24rem] leading-none text-brown-900">
            هَدَب
          </div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-7 lg:space-y-9">
            {/* Arabic Calligraphy & Pronunciation */}
            <div className="space-y-3">
              <span className="font-arabic text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-brown-950 font-normal block leading-tight">
                هَدَب
              </span>
              <div className="flex items-center justify-center gap-3 text-xs sm:text-sm uppercase tracking-[0.3em] text-brown-500 font-mono">
                <span>[ ha · dab ]</span>
                <span>•</span>
                <span>{isAr ? 'اسم عربي' : 'Arabic Noun'}</span>
              </div>
            </div>

            <div className="w-14 h-px bg-brown-300/80 mx-auto" />

            {/* The Definition */}
            <p className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-[2rem] text-brown-950 font-normal leading-relaxed max-w-3xl mx-auto">
              {isAr ? (
                <>
                  اسم <span className="font-arabic font-medium">هَدَب</span> يأتي من التفاصيل الصغيرة. في العربية،{' '}
                  <span className="italic font-arabic">هَدَب</span> يشير إلى تلك الخيوط الرقيقة والشراشيب المنسدلة من حواف القطعة — تفاصيل قد تبدو بسيطة، لكنها تمنح كل شيء رونقاً مميزاً واستثنائياً.
                </>
              ) : (
                <>
                  The name <span className="font-serif font-medium">HADAB — هَدَب</span> comes from the small details. In Arabic,{' '}
                  <span className="italic font-serif">هَدَب</span> refers to the delicate threads and fringes that fall from the edges of a piece — little details that might seem simple, but somehow make everything feel more special.
                </>
              )}
            </p>

            {/* Essence Highlight */}
            <div className="pt-6 sm:pt-8 border-t border-brown-300/50 max-w-2xl mx-auto space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-brown-500">
                {isAr ? 'هذا هو جوهر هَدَب' : 'That’s what HADAB is about'}
              </p>
              <p className="font-serif italic text-lg sm:text-xl md:text-2xl lg:text-3xl text-brown-900 leading-snug">
                {isAr
                  ? '«قطع مصنوعة يدوياً، تفاصيل مليئة بالعناية، وأشياء تشبهك.»'
                  : '“Handmade pieces, thoughtful details, and things that feel like you.”'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Evolution & The Creative Space */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-5 sm:space-y-7 lg:pr-4">
            <span className="text-xs uppercase tracking-[0.3em] text-brown-400 font-semibold block">
              {isAr ? 'رؤيتنا • أكثر من حرفة' : 'The Evolution'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] text-brown-950 font-normal leading-[1.28]">
              {isAr ? (
                'بدأنا بالكروشيه، لكن هَدَب لم تكن يوماً لتقتصر على حرفة واحدة.'
              ) : (
                'We started with crochet, but HADAB was never meant to be limited to one craft.'
              )}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-brown-600 font-light leading-relaxed max-w-2xl">
              {isAr ? (
                'إنها مساحة حرة للابتكار، والتجربة، وتحويل الأفكار الصغيرة إلى قطع تقتنيها وتبقى معك.'
              ) : (
                'It’s a space for creating, experimenting, and turning little ideas into pieces you’ll want to keep.'
              )}
            </p>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-warm border border-brown-200/80 bg-cream-100 group max-w-md lg:max-w-none mx-auto">
              <img
                src="/products/hadab-cardigan.jpg"
                alt={isAr ? 'تفاصيل حرفية هَدَب' : 'HADAB craft detail'}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-950/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 inset-x-6 text-center">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.26em] text-cream-100/95 font-medium">
                  {isAr ? 'إبداع مستمر' : 'Craft & Exploration'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Signature Close & Invitation */}
        <footer className="pt-12 sm:pt-20 lg:pt-24 pb-8 text-center space-y-8 sm:space-y-10 border-t border-brown-200/60 max-w-4xl mx-auto">
          <div className="space-y-4">
            <p className="font-serif italic text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-brown-950 font-normal">
              {isAr ? '«لمسة من هَدَب، صُنعت لأجلك.»' : '“A little bit of HADAB, made for you.”'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="w-10 h-px bg-brown-300" />
              <img src="/motif-cream.png" alt="HADAB" className="w-5 h-5 opacity-40 invert object-contain" />
              <span className="w-10 h-px bg-brown-300" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={onExploreCollection}
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-brown-900 hover:bg-brown-950 text-cream-100 text-xs uppercase tracking-[0.22em] font-semibold shadow-warm transition-all duration-300 hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 min-h-[48px]"
            >
              <span>{isAr ? 'استكشف المجموعة' : 'Explore the Pieces'}</span>
              <ArrowRight size={14} className={isAr ? 'rotate-180' : ''} />
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-brown-300 hover:border-brown-400 bg-white hover:bg-cream-100 text-brown-800 text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 active:scale-95 cursor-pointer min-h-[48px]"
            >
              <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </button>
          </div>
        </footer>
      </main>
    </article>
  );
};

export default StoryPage;
