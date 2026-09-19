import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LegalModal, type LegalDocType } from './LegalModal';

interface FooterProps {
  onOpenCategories?: (catId?: string) => void;
  onOpenCollection?: (catId?: string) => void;
  onOpenStory?: () => void;
  onGoHome?: () => void;
  onOpenLegal?: (doc: LegalDocType) => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCategories,
  onOpenCollection,
  onOpenStory,
  onGoHome,
  onOpenLegal,
  onOpenContact,
}) => {
  const { language, t } = useLanguage();
  const [internalLegalDoc, setInternalLegalDoc] = useState<LegalDocType | null>(null);

  const handleTriggerLegal = (doc: LegalDocType) => {
    if (onOpenLegal) {
      onOpenLegal(doc);
    } else {
      setInternalLegalDoc(doc);
    }
  };


  return (
    <footer className="relative bg-brown-900 text-cream-200 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 px-4 xs:px-6 sm:px-12 border-t border-brown-950 overflow-hidden select-none font-sans">
      {/* Atmospheric Watermark - refined opacity so text is completely legible on mobile */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.016] sm:opacity-[0.03] select-none overflow-hidden px-6">
        <img
          src={language === 'ar' ? '/arabic.png' : '/PNG-HADAB-CREAM.png'}
          alt=""
          className={`${
            language === 'ar' ? 'w-[45vw] max-w-md sm:max-w-lg' : 'w-[82vw] max-w-5xl'
          } object-contain`}
        />
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Main Content Layout */}
        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-10 sm:pb-12 border-b border-brown-800/60">
          {/* Column 1: Store Identity */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <img
                src="/motif-cream.png"
                alt="HADAB Motif"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
              />
              {language === 'ar' ? (
                <img
                  src="/arabic.png"
                  alt="هَدَب"
                  className="h-5 sm:h-6 w-auto object-contain"
                />
              ) : (
                <span className="font-display text-2xl tracking-tight text-cream-100 font-medium leading-none">
                  hadab
                </span>
              )}
            </div>

            <p className="text-cream-300/80 text-xs font-light leading-relaxed max-w-sm">
              {t.footerDesc}
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-brown-700/80 hover:border-blush-300 hover:text-blush-200 text-cream-200 flex items-center justify-center transition-all bg-brown-800/40 active:scale-95"
                aria-label="Instagram Hadab"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="mailto:Byhadab@gmail.com"
                className="w-9 h-9 rounded-full border border-brown-700/80 hover:border-blush-300 hover:text-blush-200 text-cream-200 flex items-center justify-center transition-all bg-brown-800/40 active:scale-95"
                aria-label="Email the Maker"
              >
                <Mail size={15} strokeWidth={1.75} />
              </a>
            </div>
          </div>

          {/* Nav & Care Columns: Balanced 2-column grid on mobile */}
          <div className="grid grid-cols-2 gap-6 pt-1 md:pt-0 md:contents">
            {/* Column 2: Navigation */}
            <div>
              <h4 className="font-serif text-cream-100 font-semibold tracking-[0.2em] uppercase text-[11px] pb-2.5 border-b border-brown-800/70 md:border-none">
                {t.navCollection}
              </h4>
              <ul className="mt-3 space-y-1.5 text-xs text-cream-300/80 font-light">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenCollection) {
                        onOpenCollection('all');
                      } else if (onGoHome) {
                        onGoHome();
                      }
                    }}
                    className="block py-1 hover:text-cream-100 transition-colors text-left"
                  >
                    {t.archiveBadge}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenCollection) {
                        onOpenCollection('bags');
                      } else if (onOpenCategories) {
                        onOpenCategories('bags');
                      }
                    }}
                    className="block py-1 hover:text-cream-100 transition-colors text-start"
                  >
                    {language === 'ar' ? 'الحقائب' : 'Bags & Totes'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenCollection) {
                        onOpenCollection('clothing');
                      } else if (onOpenCategories) {
                        onOpenCategories('clothing');
                      }
                    }}
                    className="block py-1 hover:text-cream-100 transition-colors text-start"
                  >
                    {language === 'ar' ? 'الملابس' : 'Wearables'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Customer Care */}
            <div>
              <h4 className="font-serif text-cream-100 font-semibold tracking-[0.2em] uppercase text-[11px] pb-2.5 border-b border-brown-800/70 md:border-none">
                {t.footerCareJournal}
              </h4>
              <ul className="mt-3 space-y-1.5 text-xs text-cream-300/80 font-light">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenStory) {
                        onOpenStory();
                      } else {
                        const el = document.getElementById('about');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="block py-1 hover:text-cream-100 transition-colors text-start text-xs text-cream-300/80 font-light cursor-pointer"
                  >
                    {t.navStory}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleTriggerLegal('shipping')}
                    className="block py-1 hover:text-cream-100 transition-colors text-start text-xs text-cream-300/80 font-light cursor-pointer"
                  >
                    {language === 'ar' ? 'الشحن والتوصيل' : 'Shipping & Delivery'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleTriggerLegal('returns')}
                    className="block py-1 hover:text-cream-100 transition-colors text-start text-xs text-cream-300/80 font-light cursor-pointer"
                  >
                    {language === 'ar' ? 'الاسترجاع والاستبدال' : 'Returns & Exchanges'}
                  </button>
                </li>
                <li>
                  <span className="block py-1 text-cream-400/60 text-[11px]">
                    {t.footerCareHandwash}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 4: Concierge & Contact Us */}
          <div className="pt-2 md:pt-0">
            <h4 className="font-serif text-cream-100 font-semibold tracking-[0.2em] uppercase text-[11px] pb-2.5 md:pb-0 border-b border-brown-800/70 md:border-none">
              {language === 'ar' ? 'تواصل معنا' : 'Stay in Touch'}
            </h4>
            <p className="mt-3 text-xs text-cream-300/80 font-light leading-relaxed mb-4">
              {language === 'ar'
                ? 'لديكِ استفسار أو ترغبين بطلب كروشيه مخصص؟ تواصلي معنا مباشرة وسيسعد فريقنا بمساعدتكِ.'
                : 'Have an inquiry or seeking custom crochet pieces? Connect with our artisan concierge directly.'}
            </p>

            <button
              type="button"
              onClick={onOpenContact}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#EDE4D8] hover:bg-[#F5EDE1] text-brown-900 text-xs font-medium transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <Mail size={13} className="text-burgundy-600" />
              <span>{language === 'ar' ? 'إرسال رسالة للمتجر' : 'Send Us a Message'}</span>
              {language === 'ar' ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
            </button>
          </div>
        </div>

        {/* Bottom Editorial Bar with Legal Links */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-cream-400/80 font-light gap-4 safe-bottom">
          <div className="flex flex-col xs:flex-row items-center gap-2 xs:gap-3 text-center sm:text-left">
            <span>© {new Date().getFullYear()} HADAB.</span>
            <span className="hidden xs:inline text-brown-600">•</span>
            <span>{t.footerRights}</span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap justify-center text-cream-300/70 text-[10.5px] xs:text-[11px]">
            <button
              type="button"
              onClick={() => handleTriggerLegal('privacy')}
              className="hover:text-cream-100 transition-colors cursor-pointer underline underline-offset-4 decoration-brown-700 hover:decoration-cream-300"
            >
              {language === 'ar' ? 'الخصوصية' : 'Privacy Policy'}
            </button>
            <span className="text-brown-700">•</span>
            <button
              type="button"
              onClick={() => handleTriggerLegal('terms')}
              className="hover:text-cream-100 transition-colors cursor-pointer underline underline-offset-4 decoration-brown-700 hover:decoration-cream-300"
            >
              {language === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}
            </button>
            <span className="text-brown-700">•</span>
            <button
              type="button"
              onClick={() => handleTriggerLegal('shipping')}
              className="hover:text-cream-100 transition-colors cursor-pointer underline underline-offset-4 decoration-brown-700 hover:decoration-cream-300"
            >
              {language === 'ar' ? 'الشحن' : 'Shipping'}
            </button>
            <span className="text-brown-700">•</span>
            <button
              type="button"
              onClick={() => handleTriggerLegal('returns')}
              className="hover:text-cream-100 transition-colors cursor-pointer underline underline-offset-4 decoration-brown-700 hover:decoration-cream-300"
            >
              {language === 'ar' ? 'الاسترجاع' : 'Returns'}
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Legal Modal */}
      {internalLegalDoc && (
        <LegalModal
          isOpen={Boolean(internalLegalDoc)}
          initialDoc={internalLegalDoc}
          onClose={() => setInternalLegalDoc(null)}
        />
      )}
    </footer>
  );
};
