import React, { useState } from 'react';
import { useShopData } from '../../context/ShopDataContext';
import type { Product } from '../../types';
import { Eye, ShoppingBag, Sparkles } from 'lucide-react';
import { tactileAudio } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

interface ProductGridProps {
  onAddToBag: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  onAddToBag,
  onSelectProduct,
}) => {
  const { language, t } = useLanguage();
  const { format } = useCurrency();
  const isAr = language === 'ar';
  const { products, categories } = useShopData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTextureId, setActiveTextureId] = useState<string | null>(null);

  const filteredProducts = products.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const categoryTabs = [
    { id: 'all', label: language === 'ar' ? 'جميع القطع' : 'All Pieces' },
    ...categories.map((c) => ({
      id: c.id,
      label: language === 'ar' ? (c.nameArabic || c.name) : c.name,
    })),
  ];

  return (
    <section id="catalog" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-100 border border-brown-200 text-xs font-semibold uppercase tracking-widest text-brown-600 mb-4">
          <Sparkles size={12} className="text-burgundy-500" />
          <span>{language === 'ar' ? 'أعمال الاستوديو الكاملة' : 'The Complete Studio Work'}</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl text-brown-800 font-normal">
          {language === 'ar' ? 'مجموعة محبوكة يدوياً' : 'Hand-hooked collection'}
        </h2>
        <p className="mt-3 text-brown-500 max-w-md font-light text-base">
          {language === 'ar'
            ? 'استكشف الحقائب الفردية وحقائب التسوق والإكسسوارات المصنوعة بدقة يدوية عالية.'
            : 'Explore individual bags, structured totes, and everyday accessories created in small numbered batches.'}
        </p>
      </div>

      {/* Filter Tabs - Smooth horizontal swipe on mobile, wrapped on desktop */}
      <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap mb-10 sm:mb-14">
        {categoryTabs.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedCategory(tab.id);
                tactileAudio.playScrubTick(320);
              }}
              className={`px-4 xs:px-5 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 shrink-0 min-h-[38px] flex items-center justify-center ${
                isActive
                  ? 'bg-brown-800 text-cream-100 shadow-warm'
                  : 'bg-cream-100 text-brown-600 border border-brown-200 hover:bg-cream-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {filteredProducts.map((product) => {
          const isTextureView = activeTextureId === product.id;

          return (
            <div
              key={product.id}
              className="group flex flex-col bg-cream-100/70 rounded-2xl overflow-hidden border border-brown-200/70 transition-all duration-300 hover:shadow-warm-lg hover:-translate-y-1"
            >
              {/* Product Image Area */}
              <div
                className="relative aspect-[4/5] overflow-hidden bg-cream-200 cursor-pointer"
                onClick={() => onSelectProduct(product)}
                onMouseEnter={() => setActiveTextureId(product.id)}
                onMouseLeave={() => setActiveTextureId(null)}
              >
                <img
                  src={isTextureView ? product.textureImage : product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />



                {/* Inspect Yarn button - Always visible on mobile, hover-reveal on desktop */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(product);
                  }}
                  className={`absolute bottom-3 ${language === 'ar' ? 'left-3' : 'right-3'} px-3 py-1.5 rounded-full bg-brown-800/85 text-cream-100 text-[10px] font-medium backdrop-blur-md flex items-center gap-1.5 transition-all opacity-95 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-brown-900 min-h-[32px]`}
                >
                  <Eye size={12} />
                  <span>{language === 'ar' ? 'معاينة القطعة' : 'Inspect Piece'}</span>
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-serif text-lg text-brown-800 font-medium group-hover:text-burgundy-500 transition-colors cursor-pointer"
                    >
                      {language === 'ar' ? (product.nameArabic || product.name) : product.name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      {product.originalPrice && (
                        <span className="text-xs text-brown-400 line-through">
                          {format(product.originalPrice, isAr)}
                        </span>
                      )}
                      <span className="text-base font-semibold text-brown-800">
                        {format(product.price, isAr)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-brown-500 font-light leading-relaxed mb-4 line-clamp-2">
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

                {/* Action with 42px touch target */}
                <button
                  type="button"
                  onClick={() => {
                    onAddToBag(product);
                    tactileAudio.playChime();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-brown-700 hover:bg-burgundy-500 text-cream-100 text-xs font-medium tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-warm-sm min-h-[42px] active:scale-[0.98]"
                >
                  <ShoppingBag size={14} />
                  <span>{t.addToBag}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
