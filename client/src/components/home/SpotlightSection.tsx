import React from 'react';
import { useShopData } from '../../context/ShopDataContext';
import { ThreadKnot } from '../common/ThreadSpine';
import type { Product } from '../../types';
import { ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SpotlightSectionProps {
  onAddToBag?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const SpotlightSection: React.FC<SpotlightSectionProps> = ({ onAddToBag, onSelectProduct }) => {
  const { language, t } = useLanguage();
  const { saleProducts, products } = useShopData();
  const displayItems = saleProducts.length > 0 ? saleProducts.slice(0, 3) : products.slice(0, 3);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream-100/80 border-y border-brown-200/60">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-14">
          <ThreadKnot
            color="burgundy"
            label={language === 'ar' ? 'الغرزة الرابعة • أرشيف الاستوديو' : 'STITCH IV • STUDIO ARCHIVE'}
            className="mb-6"
          />
          <h2 className="font-serif text-3xl sm:text-4xl text-brown-800 font-normal">
            {language === 'ar' ? 'إصدارات محدودة وقطع الأرشيف' : 'Limited batch & archive editions'}
          </h2>
          <p className="mt-2 text-brown-500 max-w-lg font-light text-base">
            {language === 'ar'
              ? 'قطع من مواسم سابقة وتجارب لونية خاصة أُنتجت بأعداد حصرية ومحدودة جداً.'
              : 'Pieces from past yarn runs and small experimental color stories, made in very limited numbers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="bg-cream-200/80 rounded-2xl overflow-hidden border border-brown-200/70 p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-warm"
            >
              <div>
                <div
                  onClick={() => onSelectProduct && onSelectProduct(item)}
                  className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-cream-300/40 cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={language === 'ar' ? (item.nameArabic || item.name) : item.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className={`absolute top-3 ${language === 'ar' ? 'right-3' : 'left-3'} px-2.5 py-1 rounded-full bg-burgundy-500 text-cream-100 text-[10px] font-medium tracking-wider uppercase shadow-sm`}>
                    {language === 'ar' ? (item.tagArabic || item.tag) : item.tag}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-1">
                  <h3
                    onClick={() => onSelectProduct && onSelectProduct(item)}
                    className="font-serif text-lg text-brown-800 font-medium cursor-pointer hover:text-burgundy-600 transition-colors"
                  >
                    {language === 'ar' ? (item.nameArabic || item.name) : item.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {item.originalPrice && (
                      <span className="text-xs text-brown-400 line-through">
                        {item.originalPrice} {language === 'ar' ? 'د.ك' : 'KWD'}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-burgundy-500">
                      {item.price} {language === 'ar' ? 'د.ك' : 'KWD'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-brown-500 font-light leading-relaxed mb-3">
                  {language === 'ar' ? (item.descriptionArabic || item.description) : item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-brown-200/60 flex items-center justify-between">
                <span className="text-[11px] text-brown-400 font-medium">
                  {language === 'ar' ? (item.yarnTypeArabic || item.yarnType) : item.yarnType}
                </span>
                <button
                  type="button"
                  onClick={() => onAddToBag && onAddToBag(item)}
                  className="px-3 py-1.5 rounded-lg bg-brown-700 hover:bg-burgundy-500 text-cream-100 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <ShoppingBag size={13} />
                  <span>{t.addToBag}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
