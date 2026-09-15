import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { X, ShoppingBag, Eye, Sparkles, Check } from 'lucide-react';
import { tactileAudio } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToBag: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToBag,
}) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const [showTexture, setShowTexture] = useState(false);
  const [added, setAdded] = useState(false);

  // Background body scroll lock on mobile & desktop
  useEffect(() => {
    if (product) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [product, onClose]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToBag(product);
    tactileAudio.playChime();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const displayName = isAr && product.nameArabic ? product.nameArabic : product.name;
  const displayTag = isAr && product.tagArabic ? product.tagArabic : (product.tag || t.studioOriginal);
  const displayDesc = isAr && product.descriptionArabic ? product.descriptionArabic : product.description;
  const displayYarn = isAr && product.yarnTypeArabic ? product.yarnTypeArabic : product.yarnType;
  const displayStitch = isAr && product.stitchDetailArabic ? product.stitchDetailArabic : product.stitchDetail;
  const displayColor = isAr && product.colorNameArabic ? product.colorNameArabic : product.colorName;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brown-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-cream-100 rounded-2xl sm:rounded-3xl border border-brown-200 shadow-warm-lg overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col md:block overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-3 ${isAr ? 'left-3 sm:left-4' : 'right-3 sm:right-4'} sm:top-4 w-10 h-10 rounded-full bg-cream-200/90 hover:bg-cream-300 text-brown-600 hover:text-brown-900 transition-colors z-20 flex items-center justify-center shadow-sm`}
          aria-label={isAr ? 'إغلاق التفاصيل' : 'Close details'}
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Texture Switcher - Max height on mobile to prevent pushing details down */}
          <div className="relative aspect-[4/3] sm:aspect-square md:aspect-auto max-h-[35vh] sm:max-h-[45vh] md:max-h-none bg-cream-200 shrink-0">
            <img
              src={showTexture ? product.textureImage : product.image}
              alt={displayName}
              className="w-full h-full object-cover transition-all duration-500"
            />

            {/* Toggle between Product Shot and Macro Yarn Texture */}
            <button
              type="button"
              onClick={() => {
                setShowTexture(!showTexture);
                tactileAudio.playScrubTick(360);
              }}
              className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 py-2 px-3 rounded-full bg-brown-800/85 text-cream-100 text-xs font-medium backdrop-blur-md flex items-center justify-center gap-2 hover:bg-brown-900 transition-colors shadow-warm-sm min-h-[38px] active:scale-95"
            >
              <Eye size={14} />
              <span>{showTexture ? t.showFullPiece : t.inspectStitch}</span>
            </button>
          </div>

          {/* Details */}
          <div className="p-5 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cream-200 text-brown-700 text-[10px] uppercase tracking-wider font-semibold border border-brown-300">
                  {displayTag}
                </span>
              </div>

              <h3 className="font-serif text-2xl text-brown-800 font-normal">
                {displayName}
              </h3>

              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-serif text-xl font-semibold text-brown-800">
                  {product.price} {isAr ? 'د.ك' : 'KWD'}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-brown-400 line-through">
                    {product.originalPrice} {isAr ? 'د.ك' : 'KWD'}
                  </span>
                )}
              </div>

              <p className="mt-4 text-xs sm:text-sm text-brown-600 font-light leading-relaxed">
                {displayDesc}
              </p>

              <div className="mt-6 pt-5 border-t border-brown-200 space-y-2.5 text-xs text-brown-600">
                <div className="flex justify-between">
                  <span className="text-brown-400">{t.yarnMaterial}</span>
                  <span className="font-medium text-brown-800">{displayYarn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown-400">{t.stitchPattern}</span>
                  <span className="font-medium text-brown-800">{displayStitch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown-400">{t.colorPalette}</span>
                  <span className="font-medium text-brown-800">{displayColor}</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-cream-200/50 border border-brown-200 text-[11px] text-brown-500 font-light flex items-center gap-2">
                <Sparkles size={14} className="text-burgundy-500 flex-shrink-0" />
                <span>
                  {isAr
                    ? 'محبوك يدوياً على مدار ١٤ إلى ١٨ ساعة. يصل مغلّفاً بشرائط الخيوط الطبيعية الفاخرة.'
                    : 'Individually hand-crocheted over 14–18 hours. Arrives gift-wrapped with yarn ribbon.'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`mt-5 sm:mt-6 w-full py-3.5 px-6 rounded-full text-xs uppercase tracking-wider font-semibold shadow-warm transition-all flex items-center justify-center gap-2 min-h-[46px] active:scale-[0.98] ${
                added
                  ? 'bg-sage-600 text-cream-100'
                  : 'bg-burgundy-500 hover:bg-burgundy-600 text-cream-100'
              }`}
            >
              {added ? (
                <>
                  <Check size={16} />
                  <span>{t.addedToBagNotification}</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>{t.addToBag} • {product.price} {language === 'ar' ? 'د.ك' : 'KWD'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

