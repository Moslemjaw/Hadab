import React, { useState } from 'react';
import { useShopData } from '../../context/ShopDataContext';
import type { Product } from '../../types';
import { ThreadKnot } from '../common/ThreadSpine';
import { Eye, ShoppingBag, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FeaturedProductsSectionProps {
  onAddToBag?: (product: Product) => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onAddToBag,
}) => {
  const { language, t } = useLanguage();
  const { featuredProducts, products } = useShopData();
  const [activeTextureId, setActiveTextureId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const displayProducts = featuredProducts.length > 0 ? featuredProducts.slice(0, 4) : products.slice(0, 4);

  const handleAdd = (product: Product) => {
    setAddedIds((prev) => [...prev, product.id]);
    if (onAddToBag) onAddToBag(product);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1800);
  };

  return (
    <section id="featured" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <ThreadKnot
          color="brown"
          label={language === 'ar' ? 'الغرزة الثانية • قطع مختارة' : 'STITCH II • FEATURED PIECES'}
          className="mb-6"
        />
        <h2 className="font-serif text-3xl sm:text-4xl text-brown-800 font-normal">
          {language === 'ar' ? 'قطع صُنعت بتأنٍ وصبر' : 'Pieces made with time'}
        </h2>
        <p className="mt-3 text-brown-500 max-w-lg font-light text-base">
          {language === 'ar'
            ? 'تصاميم منتقاة ليومياتك الأنيقة. مرر الفأرة أو انقر لفحص ملمس وتفاصيل الغرزة الدقيقة.'
            : 'Curated shapes for your day-to-day. Hover each piece to inspect the close-up yarn stitch and texture.'}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayProducts.map((product) => {
          const isTextureView = activeTextureId === product.id;
          const isAdded = addedIds.includes(product.id);

          return (
            <div
              key={product.id}
              className="group flex flex-col bg-cream-100/70 rounded-2xl overflow-hidden border border-brown-200/70 transition-all duration-300 hover:shadow-warm hover:-translate-y-1"
            >
              {/* Image Container with Texture Toggle */}
              <div
                className="relative aspect-[4/5] overflow-hidden bg-cream-200 cursor-pointer"
                onClick={() => setActiveTextureId((prev) => (prev === product.id ? null : product.id))}
                onMouseEnter={() => setActiveTextureId(product.id)}
                onMouseLeave={() => setActiveTextureId(null)}
              >
                {/* Main Product Image */}
                <img
                  src={isTextureView ? product.textureImage : product.image}
                  alt={language === 'ar' ? (product.nameArabic || product.name) : product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Texture view toggle button / indicator */}
                <div
                  className={`absolute bottom-3 ${
                    language === 'ar' ? 'left-3' : 'right-3'
                  } px-2.5 py-1 rounded-full bg-brown-800/80 text-cream-100 text-[10px] font-medium backdrop-blur-sm flex items-center gap-1.5 transition-opacity min-h-[30px]`}
                >
                  <Eye size={12} />
                  <span>
                    {language === 'ar'
                      ? isTextureView
                        ? 'عرض الغرزة'
                        : 'فحص الخيط'
                      : isTextureView
                      ? 'Stitch View'
                      : 'Inspect Yarn'}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <h3 className="font-serif text-lg text-brown-800 font-medium group-hover:text-burgundy-500 transition-colors">
                      {language === 'ar' ? (product.nameArabic || product.name) : product.name}
                    </h3>
                    <span className="text-base font-semibold text-brown-800">
                      {product.price} {language === 'ar' ? 'د.ك' : 'KWD'}
                    </span>
                  </div>

                  <p className="text-xs text-brown-500 leading-relaxed font-light mb-4 line-clamp-2">
                    {language === 'ar' ? (product.descriptionArabic || product.description) : product.description}
                  </p>

                  <div className="pt-2 border-t border-brown-200/50 text-[11px] text-brown-400 space-y-1 mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                      <span>{language === 'ar' ? (product.stitchDetailArabic || product.stitchDetail) : product.stitchDetail}</span>
                    </div>
                    <div className="text-brown-500 font-medium">
                      {language === 'ar' ? (product.yarnTypeArabic || product.yarnType) : product.yarnType}
                    </div>
                  </div>
                </div>

                {/* Tactile "Add to bag" button with stitch knot animation */}
                <button
                  type="button"
                  onClick={() => handleAdd(product)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 min-h-[44px] active:scale-[0.98] ${
                    isAdded
                      ? 'bg-sage-600 text-cream-100'
                      : 'bg-brown-700 hover:bg-burgundy-500 text-cream-100 shadow-warm-sm'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={14} />
                      <span>{language === 'ar' ? 'تمت الإضافة للحقيبة' : 'Added to Bag'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={14} />
                      <span>{t.addToBag}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
