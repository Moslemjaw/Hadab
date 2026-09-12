import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Globe } from 'lucide-react';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenCategories?: (catId?: string) => void;
  onOpenCollection?: (catId?: string) => void;
  onGoHome?: () => void;
  onOpenStory?: () => void;
  currentPage?: 'home' | 'story' | 'collection' | 'categories';
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount = 1,
  onOpenCart,
  onOpenCategories,
  onOpenCollection,
  onGoHome,
  onOpenStory,
  currentPage = 'home',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en');

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
        <span className="hidden sm:inline text-brown-500 font-semibold shrink-0">JORDAN • KUWAIT</span>
        <span className="hidden sm:inline w-1 h-1 rounded-full bg-brown-400 shrink-0" />
        <span className="text-brown-600 truncate">SLOW CRAFT CROCHET ATELIER • EACH PIECE HOOKED BY HAND</span>
        <span className="hidden md:inline w-1 h-1 rounded-full bg-brown-400 shrink-0" />
        <span className="hidden md:inline text-brown-500 shrink-0">COMPLIMENTARY ARCHIVE WRAPPING</span>
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
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-cream-100 hover:text-blush-200 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center -ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

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
              {currentLang === 'en' ? 'Collection' : 'المجموعة'}
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
              {currentLang === 'en' ? 'Categories' : 'التصنيفات'}
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
              {currentLang === 'en' ? 'Our Story' : 'قصتنا'}
            </button>
          </div>

          {/* Center Brand Identity: PNG-HADAB Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
            <button
              type="button"
              onClick={() => onGoHome && onGoHome()}
              className="group flex items-center"
            >
              <img
                src="/PNG-HADAB-CREAM.png"
                alt="HADAB"
                className="h-6 xs:h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          </div>

          {/* Right Action Controls: Currency, Language Toggle, Search, Bag */}
          <div className="flex items-center gap-1.5 xs:gap-2.5 sm:gap-5 text-cream-100">
            {/* Currency Selector */}
            <div className="hidden lg:flex items-center text-[11.5px] uppercase tracking-[0.22em] font-semibold text-cream-100">
              <span className="cursor-default">USD ($)</span>
            </div>

            {/* Language Switcher (EN / العربية) */}
            <button
              type="button"
              onClick={() => setCurrentLang(currentLang === 'en' ? 'ar' : 'en')}
              className="p-1.5 sm:px-2.5 sm:py-1 min-h-[34px] sm:min-h-[36px] rounded-full border border-cream-200/40 hover:border-blush-300 text-cream-100 hover:text-blush-200 text-[10px] sm:text-[10.5px] uppercase tracking-[0.16em] sm:tracking-[0.18em] font-semibold transition-all flex items-center gap-1 bg-cream-100/10 hover:bg-cream-100/15"
              aria-label="Toggle Language"
            >
              <Globe size={14} className="text-cream-100" />
              <span className="hidden sm:inline">{currentLang === 'en' ? 'العربية' : 'EN'}</span>
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
              className="p-1.5 xs:p-2 text-cream-100 hover:text-blush-200 hover:bg-white/5 rounded-full transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Search Collection"
            >
              <Search size={17} strokeWidth={2} />
            </button>

            {/* Shopping Bag Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-1.5 xs:px-3 xs:py-1.5 hover:bg-white/5 rounded-full transition-all flex items-center gap-2 group text-cream-100 min-w-[40px] min-h-[40px] justify-center"
              aria-label="Open Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag size={18} strokeWidth={2} className="group-hover:text-blush-200 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-burgundy-500 text-cream-100 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm ring-1 ring-brown-900">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[11.5px] uppercase tracking-[0.2em] font-semibold hidden sm:inline text-cream-100 group-hover:text-blush-200 transition-colors">
                {currentLang === 'en' ? 'Bag' : 'الحقيبة'}
              </span>
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
              label: currentLang === 'en' ? 'Collection' : 'المجموعة',
              action: () => {
                if (onOpenCollection) {
                  onOpenCollection('all');
                } else if (onOpenCategories) {
                  onOpenCategories('all');
                }
              },
            },
            {
              label: currentLang === 'en' ? 'Categories' : 'التصنيفات',
              action: () => {
                if (onOpenCategories) onOpenCategories();
              },
            },
            {
              label: currentLang === 'en' ? 'Our Story' : 'قصتنا',
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

          {/* Bottom info: Location + Language */}
          <div
            className={`absolute bottom-10 left-0 right-0 flex items-center justify-between px-8 text-[10px] text-cream-300/60 font-light uppercase tracking-[0.2em] transition-all duration-500 ${
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? '450ms' : '0ms' }}
          >
            <span>Jordan • Kuwait</span>
            <button
              type="button"
              onClick={() => {
                setCurrentLang(currentLang === 'en' ? 'ar' : 'en');
                setIsMobileMenuOpen(false);
              }}
              className="text-cream-200/80 hover:text-cream-100 font-medium py-1 px-2 rounded-md transition-colors"
            >
              {currentLang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
