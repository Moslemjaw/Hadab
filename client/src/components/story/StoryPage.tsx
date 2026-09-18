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
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
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

      <main className="max-w-4xl mx-auto px-5 sm:px-8 pt-14 sm:pt-24 space-y-16 sm:space-y-24">
        {/* Section 1: Minimal Opening */}
        <header className="text-center space-y-5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-200/70 border border-brown-200/80 text-brown-600 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-semibold">
            <Sparkles size={12} className="text-brown-500" />
            <span>{isAr ? 'قصتنا' : 'Our Story'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-brown-900 font-normal leading-[1.18] tracking-tight">
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

          <div className="w-12 h-px bg-brown-300/70 mx-auto mt-6" />
        </header>

        {/* Section 2: Personal Memory (Teta at 12) with Artistic Asymmetric Photo */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-warm border border-brown-200/80 bg-cream-100 group">
              <img
                src="/products/hadab-bag.jpg"
                alt={isAr ? 'حياكة يدوية' : 'Handmade crochet piece'}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-950/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 inset-x-4 text-center">
                <span className="text-[10px] uppercase tracking-[0.24em] text-cream-100/90 font-medium">
                  {isAr ? 'حياكة يدوية بالغرزة الواحدة' : 'Handmade stitch by stitch'}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 order-1 md:order-2 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.28em] text-brown-400 font-semibold block">
              {isAr ? 'البداية • من الذاكرة' : 'The Beginning'}
            </span>
            <p className="font-serif text-xl sm:text-2xl md:text-3xl text-brown-900 font-normal leading-relaxed">
              {isAr ? (
                <>
                  تعلّمتُ الكروشيه من <span className="italic font-arabic text-brown-900 font-medium">تيتة</span> عندما كنتُ في الثانية عشرة من عمري.
                </>
              ) : (
                <>
                  I learned how to crochet from my <span className="italic font-serif">teta</span> when I was 12.
                </>
              )}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-brown-600 font-light leading-relaxed pt-2">
              {isAr ? (
                'ما بدأ كشيء أصنعه لمجرد المتعة، تحوّل رويداً رويداً إلى وسيلة لأبتكر قطعاً صغيرة تحمل روحاً خاصة، مختلفة، ومصنوعة لتُحب.'
              ) : (
                'What started as something I made just for fun slowly became a way for me to create little pieces that feel personal, different, and made to be loved.'
              )}
            </p>
          </div>
        </section>

        {/* Section 3: The Centerpiece — Etymology of HADAB — هَدَب */}
        <section className="p-8 sm:p-14 md:p-16 rounded-3xl bg-cream-100/90 border border-brown-300/60 shadow-warm relative overflow-hidden text-center space-y-6">
          {/* Subtle Watermark Motifs */}
          <div className="absolute -bottom-10 -right-10 opacity-[0.03] select-none pointer-events-none font-arabic text-[14rem] leading-none text-brown-900">
            هَدَب
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            {/* Arabic Calligraphy & Pronunciation */}
            <div className="space-y-2">
              <span className="font-arabic text-5xl sm:text-6xl md:text-7xl text-brown-900 font-normal block leading-tight">
                هَدَب
              </span>
              <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.25em] text-brown-500 font-mono">
                <span>[ ha · dab ]</span>
                <span>•</span>
                <span>{isAr ? 'اسم عربي' : 'Arabic Noun'}</span>
              </div>
            </div>

            <div className="w-10 h-px bg-brown-300/80 mx-auto" />

            {/* The Definition */}
            <p className="font-serif text-lg sm:text-xl md:text-2xl text-brown-900 font-normal leading-relaxed">
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
            <div className="pt-4 border-t border-brown-300/50 space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] font-bold text-brown-500">
                {isAr ? 'هذا هو جوهر هَدَب' : 'That’s what HADAB is about'}
              </p>
              <p className="font-serif italic text-base sm:text-lg md:text-xl text-brown-900">
                {isAr
                  ? '«قطع مصنوعة يدوياً، تفاصيل مليئة بالعناية، وأشياء تشبهك.»'
                  : '“Handmade pieces, thoughtful details, and things that feel like you.”'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Evolution & The Creative Space */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.28em] text-brown-400 font-semibold block">
              {isAr ? 'رؤيتنا • أكثر من حرفة' : 'The Evolution'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-brown-900 font-normal leading-snug">
              {isAr ? (
                'بدأنا بالكروشيه، لكن هَدَب لم تكن يوماً لتقتصر على حرفة واحدة.'
              ) : (
                'We started with crochet, but HADAB was never meant to be limited to one craft.'
              )}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-brown-600 font-light leading-relaxed pt-2">
              {isAr ? (
                'إنها مساحة حرة للابتكار، والتجربة، وتحويل الأفكار الصغيرة إلى قطع تقتنيها وتبقى معك.'
              ) : (
                'It’s a space for creating, experimenting, and turning little ideas into pieces you’ll want to keep.'
              )}
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-warm border border-brown-200/80 bg-cream-100 group">
              <img
                src="/products/hadab-cardigan.jpg"
                alt={isAr ? 'تفاصيل حرفية هَدَب' : 'HADAB craft detail'}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-950/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 inset-x-4 text-center">
                <span className="text-[10px] uppercase tracking-[0.24em] text-cream-100/90 font-medium">
                  {isAr ? 'إبداع مستمر' : 'Craft & Exploration'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Signature Close & Invitation */}
        <footer className="pt-8 sm:pt-12 pb-6 text-center space-y-8 border-t border-brown-200/60">
          <div className="space-y-3">
            <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-brown-900 font-normal">
              {isAr ? '«لمسة من هَدَب، صُنعت لأجلك.»' : '“A little bit of HADAB, made for you.”'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="w-8 h-px bg-brown-300" />
              <img src="/motif-cream.png" alt="HADAB" className="w-5 h-5 opacity-40 invert object-contain" />
              <span className="w-8 h-px bg-brown-300" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              type="button"
              onClick={onExploreCollection}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brown-900 hover:bg-brown-950 text-cream-100 text-xs uppercase tracking-[0.2em] font-semibold shadow-warm transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>{isAr ? 'استكشف المجموعة' : 'Explore the Pieces'}</span>
              <ArrowRight size={14} className={isAr ? 'rotate-180' : ''} />
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-brown-300 hover:border-brown-400 bg-white hover:bg-cream-200/60 text-brown-800 text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 active:scale-95 cursor-pointer min-h-[48px]"
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
