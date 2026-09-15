import React, { useEffect, useState } from 'react';
import { CATEGORIES } from '../../constants/mockData';
import { ArrowLeft, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { tactileAudio } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

interface CategoriesPageProps {
  onSelectCategory: (categoryId: string) => void;
  onBackToHome: () => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  onSelectCategory,
  onBackToHome,
}) => {
  const { language, t } = useLanguage();
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const loadCategories = async () => {
      try {
        const live = await api.getCategories();
        if (Array.isArray(live) && live.length > 0) {
          setCategoriesList(
            live.map((c: any) => ({
              id: c.slug || c.id || c._id,
              name: c.name,
              nameArabic: c.nameAr || c.nameArabic || c.name,
              description: c.description || '',
              descriptionArabic: c.descriptionAr || c.descriptionArabic || '',
              image: c.image || '/products/hadab-bag.jpg',
              count: c.count || 0,
              color: c.color || '#D9B99B',
              accentBg: c.accentBg || 'bg-cream-100',
              accentBorder: c.accentBorder || 'border-brown-200',
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = (catId: string) => {
    tactileAudio.playScrubTick(440);
    onSelectCategory(catId);
  };

  return (
    <div className="min-h-screen bg-cream-200 text-brown-800 font-sans pb-24 selection:bg-blush-200 selection:text-brown-900">
      {/* Sub-Header Bar with Back Navigation */}
      <div className="border-b border-brown-200/70 bg-cream-100/90 backdrop-blur-md sticky top-[53px] sm:top-[63px] z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-brown-700 hover:text-burgundy-600 transition-colors min-h-[44px]"
          >
            <ArrowLeft size={14} className={`${language === 'ar' ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'} transition-transform`} />
            <span>{t.backToHome}</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] font-semibold text-brown-500">
            <Layers size={13} className="text-burgundy-600" />
            <span>{categoriesList.length} {t.navCategories}</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <section className="pt-12 sm:pt-16 pb-10 sm:pb-14 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cream-100 border border-brown-200 text-[10.5px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-burgundy-600 shadow-warm-sm mb-5">
          <Sparkles size={12} className="text-burgundy-600" />
          <span>{t.categoriesBadge}</span>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap mb-4">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-brown-900 font-normal tracking-tight">
            {t.categoriesTitle}
          </h1>
        </div>

        <p className="text-sm sm:text-base lg:text-lg text-brown-600 font-light leading-relaxed max-w-2xl mx-auto">
          {t.categoriesSubtitle}
        </p>
      </section>

      {/* Simple Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {categoriesList.map((cat, index) => {
            const catTitle = language === 'ar' ? cat.nameArabic : cat.name;
            const catDesc = language === 'ar' && cat.descriptionArabic ? cat.descriptionArabic : cat.description;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative bg-cream-100/90 rounded-3xl border border-brown-200/80 p-5 sm:p-7 shadow-warm hover:shadow-warm-lg transition-all duration-500 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5 active:scale-[0.98] overflow-hidden"
              >
                {/* Category Image Banner */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-6 bg-cream-200 shadow-inner">
                  <img
                    src={cat.image}
                    alt={catTitle}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-950/60 via-brown-950/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Top Badge: Number & Item Count */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-cream-100/90 backdrop-blur-md text-brown-900 text-[10px] font-semibold tracking-widest uppercase border border-brown-200/60 shadow-sm">
                      0{index + 1}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-brown-900/85 backdrop-blur-md text-cream-100 text-[11px] font-medium tracking-wide shadow-sm">
                      {cat.count} {t.piecesCount}
                    </span>
                  </div>

                  {/* Bottom Overlay Title in Selected Language */}
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between">
                    <span className={`text-2xl sm:text-3xl text-cream-100 drop-shadow-md ${language === 'ar' ? 'font-arabic font-normal' : 'font-serif font-medium'}`}>
                      {catTitle}
                    </span>
                  </div>
                </div>

                {/* Information */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-brown-900 group-hover:text-burgundy-600 transition-colors">
                        {catTitle}
                      </h2>
                    </div>

                    <p className="text-sm text-brown-600 font-light leading-relaxed mb-6">
                      {catDesc}
                    </p>
                  </div>

                  {/* Bottom CTA Button */}
                  <div className="pt-4 border-t border-brown-200/60 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold text-brown-700 group-hover:text-burgundy-600 transition-colors flex items-center gap-2">
                      <span>{t.exploreThisFamily}</span>
                      <ArrowRight
                        size={14}
                        className={`${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'} transition-transform duration-300`}
                      />
                    </span>

                    <span className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-cream-200/80 group-hover:bg-burgundy-600 group-hover:text-cream-100 text-brown-700 flex items-center justify-center transition-colors duration-300 shadow-sm">
                      <ArrowRight size={15} className={language === 'ar' ? 'rotate-180' : ''} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner: View All Products */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-10 rounded-3xl bg-cream-100/90 border border-brown-200/80 shadow-warm text-center flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl text-brown-900 font-normal">
              {language === 'ar' ? 'هل تودين استعراض جميع القطع معاً؟' : 'Want to view all pieces together?'}
            </h3>
            <p className="text-xs sm:text-sm text-brown-600 font-light">
              {language === 'ar' ? 'تصفحي أرشيفنا الكامل مع فلاتر نوع الخيط، اللون، والأسعار.' : 'Browse our complete permanent archive with filters for materials, colors, and prices.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleCategoryClick('all')}
            className="shrink-0 px-6 py-3.5 w-full sm:w-auto rounded-full bg-brown-900 hover:bg-burgundy-600 text-cream-100 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-warm hover:shadow-warm-lg flex items-center justify-center gap-2.5"
          >
            <span>{language === 'ar' ? 'عرض جميع القطع' : 'View All Pieces'}</span>
            <ArrowRight size={14} className={language === 'ar' ? 'rotate-180' : ''} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;
