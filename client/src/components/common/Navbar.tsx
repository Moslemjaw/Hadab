import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, Globe, User, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenCategories?: (catId?: string) => void;
  onOpenCollection?: (catId?: string) => void;
  onGoHome?: () => void;
  onOpenStory?: () => void;
  onOpenAuth?: (initialMode?: 'signin' | 'signup') => void;
  currentPage?: 'home' | 'story' | 'collection' | 'categories' | 'auth';
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount = 1,
  onOpenCart,
  onOpenCategories,
  onOpenCollection,
  onGoHome,
  onOpenStory,
  onOpenAuth,
  currentPage = 'home',
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { currency, setCurrency, supportedCurrencies } = useCurrency();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const currencyMenuRef = useRef<HTMLDivElement>(null);

  // Close currency dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-500 font-sans">
      {/* Top Luxury Ticker — Warm Cream */}
      <div className="bg-cream-200 text-brown-700 py-1.5 px-3 sm:px-6 text-center text-[9.5px] xs:text-[10px] sm:text-[10.5px] uppercase tracking-[0.22em] sm:tracking-[0.28em] font-medium border-b border-brown-200/60 flex items-center justify-center gap-3 sm:gap-6 overflow-hidden">
        <span className="hidden sm:inline text-brown-500 font-semibold shrink-0">{t.tickerLocation}</span>
        <span className="hidden sm:inline w-1 h-1 rounded-full bg-brown-400 shrink-0" />
        <span className="text-brown-600 truncate">{t.tickerCraft}</span>
        <span className="hidden md:inline w-1 h-1 rounded-full bg-brown-400 shrink-0" />
        <span className="hidden md:inline text-brown-500 shrink-0">{t.tickerArchive}</span>
      </div>

      {/* Main Luxury Nav — Rich Brown, Sleek & Compact */}
      <nav
        style={{
          backgroundColor: isScrolled ? 'rgba(46, 34, 27, 0.98)' : 'rgba(61, 45, 37, 0.97)',
        }}
        className={`w-full transition-all duration-500 backdrop-blur-xl ${
          isScrolled
            ? 'shadow-warm-lg border-b border-brown-900 py-2 sm:py-3'
            : 'shadow-warm border-b border-brown-700/60 py-2.5 sm:py-3.5'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-3 xs:px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between relative">
          {/* Left: Mobile Menu Trigger + Mobile Language Switcher (Mobile only) */}
          <div className="flex items-center gap-1.5 md:hidden z-20">
            <button
              type="button"
              className="p-1.5 text-cream-100 hover:text-blush-200 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center -ms-1 rounded-full hover:bg-white/5 active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={t.toggleMenuAria}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2.5 py-1 min-h-[32px] rounded-full border border-cream-200/35 hover:border-blush-300 text-cream-100 hover:text-blush-200 transition-all flex items-center gap-1.5 bg-cream-100/10 active:scale-95 shadow-sm"
              aria-label={t.toggleLangAria}
            >
              <Globe size={13} className="text-cream-100 shrink-0" />
              <span className={language === 'en' ? 'font-arabic text-[12px] font-semibold leading-none' : 'font-sans text-[10.5px] font-semibold tracking-wider leading-none'}>
                {language === 'en' ? 'عربي' : 'EN'}
              </span>
            </button>
          </div>

          {/* Left Navigation Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10 text-[11.5px] uppercase tracking-[0.24em] font-semibold text-cream-100">
            <button
              type="button"
              onClick={() => {
                if (onOpenCollection) {
                  onOpenCollection('all');
                } else if (onOpenCategories) {
                  onOpenCategories('all');
                }
              }}
              className={`hover:text-blush-200 transition-colors relative py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-blush-200 after:transition-all duration-300 uppercase tracking-[0.24em] font-semibold text-[11.5px] ${
                currentPage === 'collection'
                  ? 'text-blush-200 after:w-full font-bold'
                  : 'text-cream-100 after:w-0 hover:after:w-full'
              }`}
            >
              {t.navCollection}
            </button>
            <button
              type="button"
              onClick={() => onOpenCategories && onOpenCategories()}
              className={`hover:text-blush-200 transition-colors relative py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-blush-200 after:transition-all duration-300 uppercase tracking-[0.24em] font-semibold text-[11.5px] ${
                currentPage === 'categories'
                  ? 'text-blush-200 after:w-full font-bold'
                  : 'text-cream-100 after:w-0 hover:after:w-full'
              }`}
            >
              {t.navCategories}
            </button>
            <button
              type="button"
              onClick={() => {
                if (onOpenStory) {
                  onOpenStory();
                } else if (onGoHome) {
                  onGoHome();
                  setTimeout(() => {
                    const el = document.getElementById('about');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className={`hover:text-blush-200 transition-colors relative py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-blush-200 after:transition-all duration-300 uppercase tracking-[0.24em] font-semibold text-[11.5px] ${
                currentPage === 'story'
                  ? 'text-blush-200 after:w-full font-bold'
                  : 'text-cream-100 after:w-0 hover:after:w-full'
              }`}
            >
              {t.navStory}
            </button>
          </div>

          {/* Center Brand Identity: PNG-HADAB Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto z-10">
            <button
              type="button"
              onClick={() => onGoHome && onGoHome()}
              className="group flex items-center"
              aria-label={language === 'ar' ? 'الصفحة الرئيسية - هَدَب' : 'Home - HADAB'}
            >
              <img
                src={language === 'ar' ? '/arabic.png' : '/PNG-HADAB-CREAM.png'}
                alt={language === 'ar' ? 'هَدَب' : 'HADAB'}
                className={`w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
                  language === 'ar'
                    ? 'h-6 xs:h-7 sm:h-8 md:h-9 max-w-[105px] xs:max-w-[120px] sm:max-w-none'
                    : 'h-6 xs:h-7 sm:h-8 md:h-9 max-w-[105px] xs:max-w-[120px] sm:max-w-none'
                }`}
              />
            </button>
          </div>

          {/* Right Action Controls: Currency, Desktop Language Toggle, Search, Bag, Profile */}
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-4 text-cream-100 z-20">
            {/* Currency Selector (Desktop) */}
            <div className="relative hidden lg:block" ref={currencyMenuRef}>
              <button
                type="button"
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 min-h-[34px] rounded-full border border-cream-200/35 hover:border-blush-300 text-cream-100 hover:text-blush-200 text-[10.5px] uppercase tracking-[0.18em] font-semibold transition-all bg-cream-100/10 hover:bg-cream-100/15 active:scale-95"
                title={language === 'ar' ? 'تغيير العملة' : 'Change Currency'}
              >
                <span>{currency}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-cream-100/95 backdrop-blur-md rounded-2xl border border-brown-200/80 shadow-2xl text-brown-900 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-brown-200/40 text-[9px] uppercase tracking-wider text-brown-400 font-semibold">
                    {language === 'ar' ? 'اختر العملة' : 'Select Currency'}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-brown-100/40">
                    {supportedCurrencies.map((c) => {
                      const isSelected = c.code === currency;
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setCurrency(c.code);
                            setIsCurrencyDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                            isSelected
                              ? 'bg-blush-100/60 text-brown-900 font-bold'
                              : 'hover:bg-cream-200/60 text-brown-800'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base leading-none">{c.flag}</span>
                            <span className="font-mono text-[11px] uppercase tracking-wider">{c.code}</span>
                          </span>
                          <span className="text-[10px] text-brown-500 font-medium">
                            {language === 'ar' ? c.symbolAr : c.symbol}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Language Switcher (hidden on mobile, visible md+) */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="hidden md:flex px-3 py-1 min-h-[34px] rounded-full border border-cream-200/35 hover:border-blush-300 text-cream-100 hover:text-blush-200 text-[10.5px] uppercase tracking-[0.18em] font-semibold transition-all items-center gap-1.5 bg-cream-100/10 hover:bg-cream-100/15 active:scale-95"
              aria-label={t.toggleLangAria}
            >
              <Globe size={14} className="text-cream-100" />
              <span>{t.switchLanguageName}</span>
            </button>

            {/* Search Icon */}
            <button
              type="button"
              onClick={() => {
                if (onOpenCollection) {
                  onOpenCollection('all');
                } else if (onOpenCategories) {
                  onOpenCategories('all');
                }
              }}
              className="p-1.5 xs:p-2 text-cream-100 hover:text-blush-200 hover:bg-white/5 rounded-full transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center active:scale-95"
              aria-label={t.searchAria}
            >
              <Search size={17} strokeWidth={2} />
            </button>

            {/* Shopping Bag Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-1.5 xs:px-2.5 sm:px-3 xs:py-1.5 hover:bg-white/5 rounded-full transition-all flex items-center gap-1.5 sm:gap-2 group text-cream-100 min-w-[36px] sm:min-w-[38px] min-h-[36px] sm:min-h-[38px] justify-center active:scale-95"
              aria-label={t.bagAria}
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag size={18} strokeWidth={2} className="group-hover:text-blush-200 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-burgundy-500 text-cream-100 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm ring-1 ring-brown-900">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[11.5px] uppercase tracking-[0.2em] font-semibold hidden sm:inline text-cream-100 group-hover:text-blush-200 transition-colors">
                {language === 'ar' ? 'الحقيبة' : 'Bag'}
              </span>
            </button>

            {/* Profile / Account Icon */}
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth('signin')}
              className={`p-1.5 xs:p-2 hover:text-blush-200 hover:bg-white/5 rounded-full transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center active:scale-95 ${
                currentPage === 'auth' ? 'text-blush-200 bg-white/10' : 'text-cream-100'
              }`}
              aria-label={t.accountAria}
            >
              <User size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-Screen Mobile Menu Overlay — Outside nav for proper stacking */}
      <div
        className={`md:hidden fixed inset-0 z-[100] transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Dark overlay background */}
        <div
          className="absolute inset-0 bg-brown-900/[0.97] backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Close button — top right */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-5 right-5 p-2.5 text-cream-200 hover:text-cream-100 transition-colors z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close menu"
        >
          <X size={24} strokeWidth={1.5} />
        </button>

        {/* Centered Navigation Links */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center gap-8">
          {[
            {
              label: t.navCollection,
              action: () => {
                if (onOpenCollection) {
                  onOpenCollection('all');
                } else if (onOpenCategories) {
                  onOpenCategories('all');
                }
              },
            },
            {
              label: t.navCategories,
              action: () => {
                if (onOpenCategories) onOpenCategories();
              },
            },
            {
              label: t.navStory,
              action: () => {
                if (onOpenStory) {
                  onOpenStory();
                } else if (onGoHome) {
                  onGoHome();
                  setTimeout(() => {
                    const el = document.getElementById('about');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              },
            },
            {
              label: language === 'ar' ? 'حسابي' : 'My Account',
              action: () => {
                if (onOpenAuth) onOpenAuth('signin');
              },
            },
          ].map((item, i) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                item.action();
              }}
              className={`text-cream-100 text-[13px] uppercase tracking-[0.35em] font-medium hover:text-blush-200 transition-all duration-500 ${
                isMobileMenuOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isMobileMenuOpen ? `${150 + i * 80}ms` : '0ms' }}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Drawer Language & Currency Switcher */}
          <div
            className={`absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 px-6 transition-all duration-500 ${
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? '420ms' : '0ms' }}
          >
            {/* Currency horizontal pills */}
            <div className="w-full max-w-xs">
              <label className="block text-[9px] uppercase tracking-widest text-cream-300/70 text-center mb-1.5 font-medium">
                {language === 'ar' ? 'عملة العرض' : 'Display Currency'}
              </label>
              <div className="flex items-center justify-center gap-1 flex-wrap">
                {supportedCurrencies.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCurrency(c.code)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-all ${
                      c.code === currency
                        ? 'bg-cream-100 text-brown-900 font-bold shadow-sm'
                        : 'bg-cream-100/10 text-cream-200/80 hover:bg-cream-100/20'
                    }`}
                  >
                    {c.flag} {c.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Dual Language Segment Toggle */}
            <div className="inline-flex p-1 rounded-full bg-cream-100/10 border border-cream-200/20 backdrop-blur-md shadow-warm-sm">
              <button
                type="button"
                onClick={() => {
                  if (language !== 'en') toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-cream-100 text-brown-900 shadow-sm'
                    : 'text-cream-200/80 hover:text-cream-100'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => {
                  if (language !== 'ar') toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-1.5 rounded-full font-arabic text-xs font-semibold transition-all duration-200 ${
                  language === 'ar'
                    ? 'bg-cream-100 text-brown-900 shadow-sm'
                    : 'text-cream-200/80 hover:text-cream-100'
                }`}
              >
                العربية
              </button>
            </div>

            <span className="text-[10px] text-cream-300/60 font-light uppercase tracking-[0.2em]">
              {t.tickerLocation}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
