import React, { useState, useEffect } from 'react';
import { X, Share, PlusSquare, Bell, Smartphone } from 'lucide-react';
import { isIos, isStandalone } from '../../services/pushNotifications';
import { useLanguage } from '../../context/LanguageContext';

export const IosInstallBanner: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on iOS devices when NOT in standalone mode
    if (typeof window === 'undefined') return;
    const isIosDevice = isIos();
    const isInstalled = isStandalone();
    const isDismissed = localStorage.getItem('hadab_ios_install_dismissed') === 'true';

    if (isIosDevice && !isInstalled && !isDismissed) {
      // Delay display slightly so it doesn't obstruct initial page load
      const timer = setTimeout(() => {
        setShow(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('hadab_ios_install_dismissed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[80] bg-[#2E221B] text-cream-100 rounded-3xl p-5 shadow-2xl border border-cream-200/20 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-500"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cream-100/10 flex items-center justify-center text-cream-200">
            <Smartphone size={18} />
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-cream-100">
              {isAr ? 'تثبيت تطبيق هَدَب على الآيفون' : 'Install HADAB on iPhone'}
            </h4>
            <div className="flex items-center gap-1.5 text-[10px] text-blush-200">
              <Bell size={11} />
              <span>{isAr ? 'لتصلك إشعارات الطلبات فوراً' : 'For instant order notifications'}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-cream-100/60 hover:text-cream-100 p-1 transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      <p className="text-xs text-cream-200/80 leading-relaxed mb-4">
        {isAr
          ? 'لتحصل على تجربة التطبيق الكاملة واستلام الإشعارات عند تحديث الطلبات، أضف المتجر لشاشتك الرئيسية:'
          : 'For a native app experience and instant push notifications on your iPhone, add HADAB to your Home Screen:'}
      </p>

      {/* 2-Step Instructions for Safari on iOS */}
      <div className="bg-cream-100/5 rounded-2xl p-3 space-y-2 text-xs border border-cream-100/10 mb-3">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 rounded-full bg-cream-100/20 flex items-center justify-center text-[10px] font-bold text-cream-200">
            1
          </span>
          <span className="flex-1 text-cream-100/90 text-[11px]">
            {isAr ? (
              <>
                اضغط على زر المشاركة <Share size={13} className="inline mx-1 text-cream-200" /> في أسفل سفاري
              </>
            ) : (
              <>
                Tap the Share button <Share size={13} className="inline mx-1 text-cream-200" /> in Safari
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-5 h-5 rounded-full bg-cream-100/20 flex items-center justify-center text-[10px] font-bold text-cream-200">
            2
          </span>
          <span className="flex-1 text-cream-100/90 text-[11px]">
            {isAr ? (
              <>
                اختر <span className="font-semibold text-cream-100">"إضافة إلى الصفحة الرئيسية"</span>{' '}
                <PlusSquare size={13} className="inline mx-1 text-cream-200" />
              </>
            ) : (
              <>
                Select <span className="font-semibold text-cream-100">"Add to Home Screen"</span>{' '}
                <PlusSquare size={13} className="inline mx-1 text-cream-200" />
              </>
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-cream-200/50">
          {isAr ? 'يعمل بدون الحاجة لـ App Store' : 'Direct install — no App Store needed'}
        </span>
        <button
          onClick={handleDismiss}
          className="text-xs font-semibold text-blush-200 hover:text-cream-100 underline underline-offset-2 transition-colors"
        >
          {isAr ? 'فهمت' : 'Got it'}
        </button>
      </div>
    </div>
  );
};
