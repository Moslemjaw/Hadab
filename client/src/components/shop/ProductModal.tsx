import React, { useState, useEffect, useMemo } from 'react';
import type { Product, ColorVariant } from '../../types';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Variant & Option selection states
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [selectedFallbackColor, setSelectedFallbackColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Reset selections when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setShowTexture(false);
    setSelectedVariantIndex(0);

    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    } else {
      setSelectedSize('');
    }

    if (product?.colors && product.colors.length > 0) {
      setSelectedFallbackColor(product.colors[0]);
    } else if (product?.colorName) {
      setSelectedFallbackColor(product.colorName);
    } else {
      setSelectedFallbackColor('');
    }
  }, [product?.id]);

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

  const hasColorVariants = Boolean(product.colorVariants && product.colorVariants.length > 0);
  const currentColorVariant: ColorVariant | undefined = hasColorVariants
    ? product.colorVariants![selectedVariantIndex]
    : undefined;

  // Compute active gallery images based on selected color variant
  const galleryImages: string[] = useMemo(() => {
    if (currentColorVariant && currentColorVariant.images && currentColorVariant.images.length > 0) {
      return currentColorVariant.images;
    }
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.image];
  }, [currentColorVariant, product]);

  const activeImage = showTexture
    ? product.textureImage
    : (galleryImages[selectedImageIndex] || product.image);

  // Determine current active color name
  const activeColorNameEn = currentColorVariant?.name || selectedFallbackColor || product.colorName || 'Desert Oat';
  const activeColorNameAr = currentColorVariant?.nameArabic || currentColorVariant?.name || selectedFallbackColor || product.colorNameArabic || product.colorName || 'بيج صحراوي';
  const activeColorDisplay = isAr ? activeColorNameAr : activeColorNameEn;

  const handleSelectVariant = (index: number) => {
    setSelectedVariantIndex(index);
    setSelectedImageIndex(0);
    setShowTexture(false);
    tactileAudio.playScrubTick(360);
  };

  const handleSelectFallbackColor = (c: string) => {
    setSelectedFallbackColor(c);
    tactileAudio.playScrubTick(360);
  };

  const handleSelectSize = (s: string) => {
    setSelectedSize(s);
    tactileAudio.playScrubTick(340);
  };

  const handleAdd = () => {
    // Construct product with customer's chosen variants
    const productToAdd: Product = {
      ...product,
      selectedColor: isAr ? activeColorNameAr : activeColorNameEn,
      selectedSize: selectedSize || undefined,
      image: galleryImages[0] || product.image,
    };
    onAddToBag(productToAdd);
    tactileAudio.playChime();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const displayName = isAr && product.nameArabic ? product.nameArabic : product.name;
  const displayTag = isAr && product.tagArabic ? product.tagArabic : (product.tag || t.studioOriginal);
  const displayDesc = isAr && product.descriptionArabic ? product.descriptionArabic : product.description;
  const displayYarn = isAr && product.yarnTypeArabic ? product.yarnTypeArabic : product.yarnType;
  const displayStitch = isAr && product.stitchDetailArabic ? product.stitchDetailArabic : product.stitchDetail;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brown-950/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-cream-100 rounded-3xl sm:rounded-[36px] border border-brown-200/80 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col md:block overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-3.5 ${isAr ? 'left-3.5 sm:left-5' : 'right-3.5 sm:right-5'} sm:top-5 w-10 h-10 rounded-full bg-cream-200/90 hover:bg-cream-300 text-brown-700 hover:text-brown-950 transition-colors z-30 flex items-center justify-center shadow-md cursor-pointer`}
          aria-label={isAr ? 'إغلاق التفاصيل' : 'Close details'}
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* LEFT: Image Gallery & Macro Texture */}
          <div className="flex flex-col bg-[#F3ECE4] border-b md:border-b-0 md:border-r border-brown-200/70">
            <div className="relative aspect-[4/3] sm:aspect-square md:aspect-auto md:h-[480px] shrink-0 overflow-hidden group">
              <img
                src={activeImage}
                alt={displayName}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />

              {/* Texture Toggle Button */}
              {product.textureImage && (
                <button
                  type="button"
                  onClick={() => {
                    setShowTexture(!showTexture);
                    tactileAudio.playScrubTick(360);
                  }}
                  className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 py-2.5 px-4 rounded-full bg-brown-900/85 hover:bg-brown-900 text-cream-100 text-xs font-medium backdrop-blur-md flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <Eye size={14} />
                  <span>{showTexture ? t.showFullPiece : t.inspectStitch}</span>
                </button>
              )}
            </div>

            {/* Thumbnails Gallery Strip */}
            {galleryImages.length > 1 && !showTexture && (
              <div className="flex items-center gap-2.5 p-3.5 bg-cream-200/60 overflow-x-auto border-t border-brown-200/60 no-scrollbar">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      tactileAudio.playScrubTick(340);
                    }}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer shadow-sm ${
                      selectedImageIndex === idx
                        ? 'border-burgundy-600 scale-105 ring-2 ring-burgundy-200'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details & Interactive Variant Selectors */}
          <div className="p-6 sm:p-8 md:p-9 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              
              {/* Tag & Title */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="px-3 py-1 rounded-full bg-cream-200 text-brown-800 text-[10px] uppercase tracking-widest font-bold border border-brown-300 shadow-sm">
                    {displayTag}
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-brown-950 font-normal leading-snug">
                  {displayName}
                </h2>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-serif text-2xl font-bold text-brown-900">
                    {product.price} {isAr ? 'د.ك' : 'KWD'}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-sm text-brown-400 line-through">
                        {product.originalPrice} {isAr ? 'د.ك' : 'KWD'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-burgundy-600 text-cream-100 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {isAr
                          ? `وفر ${product.originalPrice - product.price} د.ك`
                          : `Save ${product.originalPrice - product.price} KWD`}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* INTERACTIVE COLOR SELECTOR */}
              {(hasColorVariants || (product.colors && product.colors.length > 0)) && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-brown-700">
                      {isAr ? 'اللون المحدد:' : 'Color:'}
                    </span>
                    <span className="text-xs font-semibold text-burgundy-700">
                      {activeColorDisplay}
                    </span>
                  </div>

                  {hasColorVariants ? (
                    <div className="flex flex-wrap items-center gap-2.5">
                      {product.colorVariants!.map((variant, idx) => {
                        const isSelected = selectedVariantIndex === idx;
                        const vName = isAr && variant.nameArabic ? variant.nameArabic : variant.name;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectVariant(idx)}
                            className={`group flex items-center gap-2 py-1.5 px-3 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'border-burgundy-600 bg-white ring-2 ring-burgundy-300 shadow-sm text-brown-950 font-semibold'
                                : 'border-brown-200 bg-cream-200/70 hover:bg-cream-200 text-brown-700'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0 shadow-inner"
                              style={{ backgroundColor: variant.colorHex || '#D6C7B2' }}
                            />
                            <span>{vName}</span>
                            {isSelected && <Check size={12} className="text-burgundy-600" />}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {product.colors!.map((c) => {
                        const isSelected = selectedFallbackColor === c;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleSelectFallbackColor(c)}
                            className={`py-1.5 px-3.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'border-burgundy-600 bg-white ring-2 ring-burgundy-300 text-brown-950 font-semibold shadow-sm'
                                : 'border-brown-200 bg-cream-200/70 hover:bg-cream-200 text-brown-700'
                            }`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* INTERACTIVE SIZE SELECTOR */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-brown-700">
                      {isAr ? 'المقاس المختار:' : 'Size:'}
                    </span>
                    <span className="text-xs font-semibold text-brown-900">
                      {selectedSize}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => {
                      const isSelected = selectedSize === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleSelectSize(s)}
                          className={`py-1.5 px-4 rounded-xl border text-xs font-medium transition-all cursor-pointer min-w-[50px] text-center ${
                            isSelected
                              ? 'border-[#2E221B] bg-[#2E221B] text-cream-100 shadow-sm font-semibold'
                              : 'border-brown-300 bg-cream-200/70 hover:bg-cream-200 text-brown-800'
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Narrative Description */}
              <p className="text-xs sm:text-sm text-brown-700 font-light leading-relaxed pt-1">
                {displayDesc}
              </p>

              {/* Craft Specifications */}
              <div className="pt-4 border-t border-brown-200/80 space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-brown-500 font-light">{t.yarnMaterial}</span>
                  <span className="font-medium text-brown-900">{displayYarn}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-brown-500 font-light">{t.stitchPattern}</span>
                  <span className="font-medium text-brown-900">{displayStitch}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-brown-500 font-light">{t.colorPalette}</span>
                  <span className="font-medium text-brown-900">{activeColorDisplay}</span>
                </div>
              </div>

              {/* Handmade Highlight Badge */}
              <div className="p-3.5 rounded-2xl bg-cream-200/70 border border-brown-200 text-[11px] text-brown-600 font-light flex items-center gap-2.5">
                <Sparkles size={15} className="text-burgundy-600 shrink-0" />
                <span>
                  {isAr
                    ? 'محبوك يدوياً بدقة عالية على مدار ١٤ إلى ١٨ ساعة. يصل مغلّفاً بشرائط الخيوط الطبيعية الفاخرة.'
                    : 'Individually hand-crocheted over 14–18 hours. Arrives gift-wrapped with yarn ribbon.'}
                </span>
              </div>
            </div>

            {/* ADD TO BAG BUTTON */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleAdd}
                className={`w-full py-4 px-6 rounded-full text-xs uppercase tracking-wider font-bold shadow-lg transition-all flex items-center justify-center gap-2.5 min-h-[48px] active:scale-[0.98] cursor-pointer ${
                  added
                    ? 'bg-sage-700 text-cream-100'
                    : 'bg-burgundy-600 hover:bg-burgundy-700 text-cream-100'
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    <span>{t.addedToBagNotification}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>
                      {t.addToBag} • {product.price} {isAr ? 'د.ك' : 'KWD'}
                    </span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

