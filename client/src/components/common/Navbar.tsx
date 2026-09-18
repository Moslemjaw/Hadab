import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, Globe, User, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { tactileAudio } from '../../utils/audio';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenCategories?: (catId?: string) => void;
  onOpenCollection?: (catId?: string) => void;
  onGoHome?: () => void;
  onOpenStory?: () => void;
  onOpenAuth?: (initialMode?: 'signin' | 'signup') => void;
  onOpenAdmin?: () => void;
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
  onOpenAdmin,
  currentPage = 'home',
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { currency, setCurrency, supportedCurrencies } = useCurrency();
  const { isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isMobileCurrencyOpen, setIsMobileCurrencyOpen] = useState(false);
  const currencyMenuRef = useRef<HTMLDivElement>(null);

  const currentCurrencyObj = supportedCurrencies.find((c) => c.code === currency) || supportedCurrencies[0];

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsMobileCurrencyOpen(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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
    <header
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        backgroundColor: '#F2E8DD',
      }}
      className="sticky top-0 z-50 w-full transition-all duration-500 font-sans"
    >
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
                <div className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} top-full mt-2 w-52 py-2 bg-cream-100/98 backdrop-blur-md rounded-2xl border border-brown-200/80 shadow-2xl text-brown-900 z-50 animate-in fade-in zoom-in-95 duration-150`}>
                  <div className="px-3.5 py-1.5 border-b border-brown-200/40 text-[9px] uppercase tracking-wider text-brown-400 font-semibold">
                    {language === 'ar' ? 'اختر العملة' : 'Select Currency'}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-brown-100/40 custom-scrollbar">
                    {supportedCurrencies.map((c) => {
                      const isSelected = c.code === currency;
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            tactileAudio.playScrubTick(320);
                            setCurrency(c.code);
                            setIsCurrencyDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-brown-900 text-cream-100 font-bold'
                              : 'hover:bg-cream-200/70 text-brown-800'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="text-base leading-none shrink-0">{c.flag}</span>
                            <span className="font-mono text-[11px] uppercase tracking-wider shrink-0">{c.code}</span>
                            <span className={`text-[10px] truncate max-w-[70px] ${isSelected ? 'text-cream-200' : 'text-brown-500'}`}>
                              {language === 'ar' ? c.nameAr : c.name}
                            </span>
                          </span>
                          <span className="flex items-center gap-1.5 font-mono text-[11px] shrink-0">
                            <span>{language === 'ar' ? c.symbolAr : c.symbol}</span>
                            {isSelected && <Check size={13} className="text-blush-300" />}
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

        {/* Close button — top right, clearly above all content with safe-area spacing and ample touch area */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMobileMenuOpen(false);
          }}
          className="absolute z-50 p-2.5 text-cream-200 hover:text-white transition-all min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer rounded-full bg-white/10 hover:bg-white/20 active:scale-90 shadow-sm"
          style={{
            top: 'max(1.25rem, env(safe-area-inset-top, 1.25rem))',
            right: 'max(1.25rem, env(safe-area-inset-right, 1.25rem))',
          }}
          aria-label="Close menu"
        >
          <X size={26} strokeWidth={1.75} />
        </button>

        {/* Centered Navigation Links & Controls Container */}
        <div className="relative z-10 h-full flex flex-col justify-between items-center py-16 px-6 overflow-y-auto">
          {/* Top spacer */}
          <div className="h-4" />

          {/* Centered Links */}
          <div className="flex flex-col items-center gap-7 sm:gap-8 my-auto">
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
              ...(isAdmin || (typeof localStorage !== 'undefined' && localStorage.getItem('hadab_is_admin') === 'true')
                ? [
                    {
                      label: language === 'ar' ? '👑 لوحة الإدارة' : '👑 Admin Portal',
                      action: () => {
                        if (onOpenAdmin) onOpenAdmin();
                        else window.location.hash = 'admin';
                      },
                    },
                  ]
                : []),
            ].map((item, i) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  item.action();
                }}
                className={`text-cream-100 text-[13px] uppercase tracking-[0.35em] font-medium hover:text-blush-200 transition-all duration-500 cursor-pointer ${
                  isMobileMenuOpen
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${150 + i * 80}ms` : '0ms' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Drawer Language & Currency Switcher */}
          <div
            className={`w-full max-w-xs flex flex-col items-center gap-3.5 pt-6 transition-all duration-500 ${
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? '350ms' : '0ms' }}
          >
            {/* Redesigned Luxury Currency Selector */}
            <div className="w-full relative">
              <label className="block text-[10px] uppercase tracking-[0.24em] text-cream-300/80 text-center mb-1.5 font-semibold">
                {language === 'ar' ? 'عملة العرض' : 'Display Currency'}
              </label>

              <button
                type="button"
                onClick={() => {
                  tactileAudio.playScrubTick(300);
                  setIsMobileCurrencyOpen(!isMobileCurrencyOpen);
                }}
                className={`w-full py-3 px-4 rounded-2xl border transition-all duration-200 flex items-center justify-between text-cream-100 active:scale-[0.98] shadow-sm cursor-pointer ${
                  isMobileCurrencyOpen
                    ? 'bg-cream-100/15 border-blush-300 ring-2 ring-blush-300/30'
                    : 'bg-cream-100/10 hover:bg-cream-100/15 border-cream-200/25'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl leading-none shrink-0">{currentCurrencyObj.flag}</span>
                  <span className="font-mono text-xs font-bold tracking-wider text-cream-100 shrink-0">
                    {currentCurrencyObj.code}
                  </span>
                  <span className="text-cream-400 text-xs shrink-0">•</span>
                  <span className="text-xs text-cream-200 truncate font-normal">
                    {language === 'ar' ? currentCurrencyObj.nameAr : currentCurrencyObj.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs font-semibold text-blush-200">
                    {language === 'ar' ? currentCurrencyObj.symbolAr : currentCurrencyObj.symbol}
                  </span>
                  <ChevronDown
                    size={15}
                    className={`text-cream-200 transition-transform duration-300 ${
                      isMobileCurrencyOpen ? 'rotate-180 text-blush-200' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Mobile Currency Dropdown Tray (Expands downwards smoothly) */}
              {isMobileCurrencyOpen && (
                <div className="mt-2 w-full max-h-60 overflow-y-auto bg-[#231813]/98 backdrop-blur-2xl border border-cream-200/30 rounded-2xl p-1.5 shadow-2xl divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-200 custom-scrollbar">
                  {supportedCurrencies.map((c) => {
                    const isSelected = c.code === currency;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          tactileAudio.playScrubTick(320);
                          setCurrency(c.code);
                          setIsMobileCurrencyOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cream-100 text-brown-950 font-bold shadow-sm'
                            : 'text-cream-100 hover:bg-white/10 active:bg-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-lg leading-none shrink-0">{c.flag}</span>
                          <span className="font-mono text-xs font-bold tracking-wider shrink-0">{c.code}</span>
                          <span className={`text-[11.5px] truncate ${isSelected ? 'text-brown-800 font-medium' : 'text-cream-300/90'}`}>
                            {language === 'ar' ? c.nameAr : c.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`font-mono text-xs ${isSelected ? 'text-brown-950 font-bold' : 'text-cream-400 font-medium'}`}>
                            {language === 'ar' ? c.symbolAr : c.symbol}
                          </span>
                          {isSelected && <Check size={15} className="text-burgundy-700 stroke-[2.5]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dual Language Segment Toggle */}
            <div className="inline-flex p-1 rounded-full bg-cream-100/10 border border-cream-200/20 backdrop-blur-md shadow-warm-sm">
              <button
                type="button"
                onClick={() => {
                  if (language !== 'en') toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
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
                className={`px-4 py-1.5 rounded-full font-arabic text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  language === 'ar'
                    ? 'bg-cream-100 text-brown-900 shadow-sm'
                    : 'text-cream-200/80 hover:text-cream-100'
                }`}
              >
                العربية
              </button>
            </div>

            <span className="text-[10px] text-cream-300/60 font-light uppercase tracking-[0.2em] pb-2">
              {t.tickerLocation}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
