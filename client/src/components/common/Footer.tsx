import React, { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onOpenCategories?: (catId?: string) => void;
  onOpenCollection?: (catId?: string) => void;
  onOpenStory?: () => void;
  onGoHome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCategories,
  onOpenCollection,
  onOpenStory,
  onGoHome,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-brown-900 text-cream-200 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 px-4 xs:px-6 sm:px-12 border-t border-brown-950 overflow-hidden select-none font-sans">
      {/* Atmospheric Watermark - refined opacity so text is completely legible on mobile */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.018] sm:opacity-[0.04] select-none overflow-hidden px-6">
        <img
          src="/PNG-HADAB-CREAM.png"
          alt=""
          className="w-[82vw] max-w-5xl object-contain"
        />
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Main Content Layout */}
        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-10 sm:pb-12 border-b border-brown-800/60">
          {/* Column 1: Atelier Identity */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <img
                src="/motif-cream.png"
                alt="HADAB Motif"
                className="w-7 h-7 object-contain"
              />
              <span className="font-display text-2xl tracking-tight text-cream-100 font-medium lowercase leading-none">
                hadab
              </span>
              <span className="font-arabic text-xl text-cream-200/90 font-normal leading-none">
                هَدَب
              </span>
            </div>

            <p className="text-cream-300/80 text-xs font-light leading-relaxed max-w-sm">
              Slow-craft crochet atelier based between Jordan & Kuwait. Hand-hooked from unbleached cotton cord.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-brown-700/80 hover:border-blush-300 hover:text-blush-200 text-cream-200 flex items-center justify-center transition-all bg-brown-800/40 active:scale-95"
                aria-label="Instagram Atelier"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="mailto:atelier@hadab.craft"
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
                Collection
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
                    Permanent Archive
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
                    className="block py-1 hover:text-cream-100 transition-colors text-left"
                  >
                    Bags & Totes
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
                    className="block py-1 hover:text-cream-100 transition-colors text-left"
                  >
                    Wearables & Accessories
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Atelier Care */}
            <div>
              <h4 className="font-serif text-cream-100 font-semibold tracking-[0.2em] uppercase text-[11px] pb-2.5 border-b border-brown-800/70 md:border-none">
                Craft & Care
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
                    className="block py-1 hover:text-cream-100 transition-colors text-left text-xs text-cream-300/80 font-light"
                  >
                    The Story of هَدَب
                  </button>
                </li>
                <li>
                  <a href="#craft" className="block py-1 hover:text-cream-100 transition-colors">
                    Recycled Cotton Cord
                  </a>
                </li>
                <li>
                  <a href="#craft" className="block py-1 hover:text-cream-100 transition-colors">
                    Care & Shaping Guide
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="pt-2 md:pt-0">
            <h4 className="font-serif text-cream-100 font-semibold tracking-[0.2em] uppercase text-[11px] pb-2.5 md:pb-0 border-b border-brown-800/70 md:border-none">
              Studio Dispatches
            </h4>
            <p className="mt-3 text-xs text-cream-300/80 font-light leading-relaxed mb-3">
              Invitations to small-batch drops & atelier archives.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-sage-300 py-2.5 px-3.5 rounded-xl bg-sage-950/40 border border-sage-800/60">
                <Check size={14} />
                <span>Subscribed to atelier dispatches.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="relative max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full h-11 bg-brown-800/70 border border-brown-700/80 rounded-xl px-3.5 text-xs text-cream-100 placeholder:text-brown-400 focus:outline-none focus:border-blush-300/70 focus:ring-1 focus:ring-blush-300/40 transition-all pr-12"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-brown-700 hover:bg-burgundy-600 text-cream-100 transition-colors flex items-center justify-center active:scale-95 shadow-sm"
                    aria-label="Subscribe"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Editorial Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-cream-400/80 font-light gap-4 safe-bottom">
          <div className="flex flex-col xs:flex-row items-center gap-2 xs:gap-3 text-center sm:text-left">
            <span>© {new Date().getFullYear()} HADAB ATELIER.</span>
            <span className="hidden xs:inline text-brown-600">•</span>
            <span className="font-arabic text-xs text-cream-300/90 font-normal">صنع باليد، غرزة تلو الأخرى</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center text-cream-400/70">
            <span className="text-center text-[10.5px] xs:text-[11px]">Jordan • Kuwait</span>
            <span className="text-brown-700">•</span>
            <a href="#" className="hover:text-cream-200 transition-colors py-1">
              Privacy
            </a>
            <span className="text-brown-700">•</span>
            <a href="#" className="hover:text-cream-200 transition-colors py-1">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
