import React, { useState, useEffect, useMemo } from 'react';
import type { Product, ColorVariant } from '../../types';
import { X, ShoppingBag, Sparkles, Check, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [added, setAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Variant & Option selection states
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [selectedFallbackColor, setSelectedFallbackColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Reset selections when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
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

  const hasColorVariants = Boolean(product?.colorVariants && product.colorVariants.length > 0);
  const currentColorVariant: ColorVariant | undefined = hasColorVariants && product?.colorVariants
    ? product.colorVariants[selectedVariantIndex]
    : undefined;

  // Compute all available images for the slider:
  // Combines all variant images, product images, and texture/detail image into one cohesive carousel!
  const galleryImages: string[] = useMemo(() => {
    if (!product) return [];

    const imagesSet = new Set<string>();

    // 1. Prioritize images from all color variants if they exist
    if (product.colorVariants && product.colorVariants.length > 0) {
      product.colorVariants.forEach((v) => {
        v.images?.forEach((img) => img && imagesSet.add(img));
      });
    }

    // 2. Add product.images
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => img && imagesSet.add(img));
    }

    // 3. Add base product.image
    if (product.image) {
      imagesSet.add(product.image);
    }

    // 4. Include close-up texture image directly in the slider alongside other pics
    if (
      product.textureImage &&
      product.textureImage !== '/products/hadab-bag.jpg'
    ) {
      imagesSet.add(product.textureImage);
    }

    return Array.from(imagesSet);
  }, [product]);

  // AUTO-SLIDE AFTER EACH 3 SECONDS (3000ms)
  useEffect(() => {
    if (!product || isPaused || galleryImages.length <= 1) return;

    const variants = product.colorVariants;
    const colors = product.colors;
    const timer = setInterval(() => {
      setSelectedImageIndex((prev) => {
        const nextIndex = (prev + 1) % galleryImages.length;
        const nextUrl = galleryImages[nextIndex];

        // Sync active color variant if this slide matches a variant's photo
        if (variants && variants.length > 0) {
          let matchedIdx = variants.findIndex(
            (v) => v.images && v.images.includes(nextUrl)
          );
          if (matchedIdx === -1 && nextIndex < variants.length) {
            matchedIdx = nextIndex;
          }
          if (matchedIdx !== -1) {
            setSelectedVariantIndex(matchedIdx);
          }
        } else if (colors && nextIndex < colors.length) {
          setSelectedFallbackColor(colors[nextIndex]);
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [product, isPaused, galleryImages]);

  if (!product) return null;

  const activeImage = galleryImages[selectedImageIndex] || product.image;

  // Determine current active color name
  const activeColorNameEn = currentColorVariant?.name || selectedFallbackColor || product.colorName || 'Desert Oat';
  const activeColorNameAr = currentColorVariant?.nameArabic || currentColorVariant?.name || selectedFallbackColor || product.colorNameArabic || product.colorName || 'بيج صحراوي';
  const activeColorDisplay = isAr ? activeColorNameAr : activeColorNameEn;

  const handleSelectVariant = (index: number) => {
    setSelectedVariantIndex(index);
    const variant = product?.colorVariants?.[index];

    let targetIdx = -1;
    // 1. If this variant has explicitly assigned images, find its index in galleryImages
    if (variant && variant.images && variant.images.length > 0) {
      const foundIdx = galleryImages.indexOf(variant.images[0]);
      if (foundIdx !== -1) targetIdx = foundIdx;
    }

    // 2. Direct 1-to-1 index fallback (e.g. 1st color -> 1st image, 2nd color -> 2nd image)
    if (targetIdx === -1 && index < galleryImages.length) {
      targetIdx = index;
    }

    if (targetIdx !== -1) {
      setSelectedImageIndex(targetIdx);
    }
    tactileAudio.playScrubTick(360);
  };

  const handleSelectFallbackColor = (c: string) => {
    setSelectedFallbackColor(c);
    if (product?.colors && product.colors.length > 0) {
      const cIdx = product.colors.indexOf(c);
      if (cIdx !== -1 && cIdx < galleryImages.length) {
        setSelectedImageIndex(cIdx);
      }
    }
    tactileAudio.playScrubTick(360);
  };

  const handleSelectSize = (s: string) => {
    setSelectedSize(s);
    tactileAudio.playScrubTick(340);
  };

  const handleSelectImage = (idx: number) => {
    setSelectedImageIndex(idx);
    tactileAudio.playScrubTick(340);

    // Sync active color variant if this thumbnail matches a variant
    if (product?.colorVariants && product.colorVariants.length > 0) {
      const clickedUrl = galleryImages[idx];
      let matchedIdx = product.colorVariants.findIndex(
        (v) => v.images && v.images.includes(clickedUrl)
      );
      if (matchedIdx === -1 && idx < product.colorVariants.length) {
        matchedIdx = idx;
      }
      if (matchedIdx !== -1) {
        setSelectedVariantIndex(matchedIdx);
      }
    } else if (product?.colors && idx < product.colors.length) {
      setSelectedFallbackColor(product.colors[idx]);
    }
  };

  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    tactileAudio.playScrubTick(340);
    if (galleryImages.length > 1) {
      const prevIdx = (selectedImageIndex - 1 + galleryImages.length) % galleryImages.length;
      handleSelectImage(prevIdx);
    }
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    tactileAudio.playScrubTick(340);
    if (galleryImages.length > 1) {
      const nextIdx = (selectedImageIndex + 1) % galleryImages.length;
      handleSelectImage(nextIdx);
    }
  };

  const handleAdd = () => {
    const productToAdd: Product = {
      ...product,
      selectedColor: isAr ? activeColorNameAr : activeColorNameEn,
      selectedSize: selectedSize || undefined,
      image: activeImage,
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
        className="fixed inset-0 bg-brown-950/65 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-cream-100 rounded-3xl sm:rounded-[36px] border border-brown-200/80 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col md:block overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-3.5 ${isAr ? 'left-3.5 sm:left-5' : 'right-3.5 sm:right-5'} sm:top-5 w-10 h-10 rounded-full bg-cream-100/90 hover:bg-cream-200 text-brown-700 hover:text-brown-950 transition-colors z-30 flex items-center justify-center shadow-md cursor-pointer border border-brown-200/60`}
          aria-label={isAr ? 'إغلاق التفاصيل' : 'Close details'}
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 md:items-stretch min-h-[540px]">
          
          {/* LEFT: Consistent Full-Height Auto-Sliding Carousel with Always-Visible Thumbnails */}
          <div
            className="relative flex flex-col justify-between bg-[#F4EDE4] border-b md:border-b-0 md:border-r border-brown-200/70 h-full min-h-[380px] sm:min-h-[440px] md:min-h-[580px] overflow-hidden group select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Main Picture Container */}
            <div className="relative flex-1 w-full h-full min-h-[320px] overflow-hidden flex items-center justify-center bg-[#F2EAE0]">
              <img
                key={activeImage}
                src={activeImage}
                alt={displayName}
                className="w-full h-full object-cover object-center transition-all duration-700 ease-in-out transform group-hover:scale-105 animate-in fade-in duration-500"
              />

              {/* Prev / Next Slide Arrows (Hover) */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'} w-9 h-9 rounded-full bg-brown-950/50 hover:bg-brown-950/80 text-cream-100 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer z-20 active:scale-95`}
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={18} className={isAr ? 'rotate-180' : ''} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'left-3' : 'right-3'} w-9 h-9 rounded-full bg-brown-950/50 hover:bg-brown-950/80 text-cream-100 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer z-20 active:scale-95`}
                    aria-label="Next slide"
                  >
                    <ChevronRight size={18} className={isAr ? 'rotate-180' : ''} />
                  </button>
                </>
              )}

              {/* 3-Second Slide Pagination Indicators */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 px-3 py-1.5 rounded-full bg-brown-950/40 backdrop-blur-md shadow-sm">
                  {galleryImages.map((_, idx) => {
                    const isActive = selectedImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectImage(idx)}
                        className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                          isActive
                            ? 'w-6 bg-cream-100 shadow-sm'
                            : 'w-1.5 bg-cream-100/50 hover:bg-cream-100/80'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Thumbnail Strip: Always Visible at the Bottom */}
            {galleryImages.length > 0 && (
              <div className="flex items-center justify-center gap-2.5 p-3.5 bg-cream-200/80 border-t border-brown-200/70 overflow-x-auto no-scrollbar shrink-0">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectImage(idx)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer shadow-sm ${
                      selectedImageIndex === idx
                        ? 'border-burgundy-600 scale-105 ring-2 ring-burgundy-300'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
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
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-brown-500">
                      {isAr ? 'اللون:' : 'COLOR'}
                    </span>
                    <span className="text-xs font-serif italic text-burgundy-700">
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
                            className={`group flex items-center gap-2 py-1.5 px-3.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
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
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-brown-500">
                      {isAr ? 'المقاس:' : 'SIZE'}
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
              <p className="text-xs sm:text-[13px] text-brown-700 font-light leading-relaxed pt-1">
                {displayDesc}
              </p>

              {/* Craft Specifications Card */}
              <div className="p-3.5 rounded-2xl bg-cream-200/50 border border-brown-200/70 space-y-2 text-xs">
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
              <div className="p-3 rounded-2xl bg-cream-200/70 border border-brown-200 text-[11px] text-brown-600 font-light flex items-center gap-2.5">
                <Sparkles size={15} className="text-burgundy-600 shrink-0" />
                <span>
                  {isAr
                    ? 'محبوك يدوياً بدقة عالية على مدار ١٤ إلى ١٨ ساعة. يصل مغلّفاً بشرائط الخيوط الطبيعية الفاخرة.'
                    : 'Individually hand-crocheted over 14–18 hours. Arrives gift-wrapped with yarn ribbon.'}
                </span>
              </div>
            </div>

            {/* ADD TO BAG BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAdd}
                className={`w-full py-4 px-6 rounded-full text-xs uppercase tracking-wider font-bold shadow-lg transition-all flex items-center justify-center gap-2.5 min-h-[48px] active:scale-[0.98] cursor-pointer ${
                  added
                    ? 'bg-sage-700 text-cream-100'
                    : 'bg-[#2E221B] hover:bg-[#3D2D25] text-cream-100'
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

