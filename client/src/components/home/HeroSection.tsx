import React, { useState, useEffect } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { Logo } from '../common/Logo';

export const HeroSection: React.FC = () => {
  const [stitchCount, setStitchCount] = useState(1);
  const [isPulling, setIsPulling] = useState(false);

  // Interactive stitch hook pull action
  const handleStitchPull = () => {
    setIsPulling(true);
    setTimeout(() => {
      setStitchCount((prev) => prev + 1);
      setIsPulling(false);
    }, 400);
  };

  useEffect(() => {
    // Gentle automatic initial loop growth
    const timer = setTimeout(() => {
      setStitchCount(3);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-between px-4 sm:px-6 lg:px-8 pt-8 pb-14 overflow-hidden">
      {/* Ambient background yarn fleck / woven texture */}
      <div className="absolute inset-0 texture-subtle pointer-events-none opacity-80" />

      {/* Decorative soft ambient glow blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blush-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-sage-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Top pill badge */}
      <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-100/90 border border-brown-200 shadow-warm-sm text-xs text-brown-700 tracking-wider font-medium uppercase mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <span className="w-2 h-2 rounded-full bg-burgundy-500 animate-pulse" />
        <span>New Autumn Batch • Now Available</span>
      </div>

      {/* Centerpiece: Interactive Thread & Crochet Visual */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center">
        {/* Animated Stitch Canvas / SVG Motif */}
        <div className="relative w-full max-w-md h-44 sm:h-52 flex items-center justify-center mb-6">
          <svg
            className="w-full h-full"
            viewBox="0 0 400 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background guide loop */}
            <path
              d="M30 90 Q 90 20, 160 90 T 290 90 T 370 90"
              stroke="#D5C7BD"
              strokeWidth="2.5"
              strokeDasharray="4 6"
              fill="none"
            />

            {/* Active animated yarn strand (Trapillo cotton texture look) */}
            <path
              d="M30 90 Q 90 20, 160 90 T 290 90 T 370 90"
              stroke="#4A382F"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
              className="animate-thread"
              style={{ strokeDashoffset: isPulling ? 20 : 0 }}
            />

            {/* Secondary inner thread twist (Marled yarn effect) */}
            <path
              d="M30 90 Q 90 20, 160 90 T 290 90 T 370 90"
              stroke="#F2E8DD"
              strokeWidth="1.5"
              strokeDasharray="8 12"
              strokeLinecap="round"
              fill="none"
            />

            {/* The Crochet Hook illustration */}
            <g
              transform={`translate(${190 + (stitchCount % 5) * 14}, ${65 + (isPulling ? 12 : 0)}) rotate(-25)`}
              className="transition-transform duration-300 cursor-pointer"
              onClick={handleStitchPull}
            >
              {/* Hook shaft (matte deep brown wood finish) */}
              <rect x="0" y="0" width="105" height="9" rx="4.5" fill="#4A382F" />
              {/* Hook throat & beak */}
              <path
                d="M-10 4.5 C-10 1, -2 0, 0 0 L0 9 C-3 9, -7 8, -8 6 Z"
                fill="#6C5446"
              />
              <path
                d="M-8 3 C-6 2, -2 3.5, 0 4.5"
                stroke="#FAF6F0"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Hook thumb rest groove */}
              <rect x="42" y="1" width="18" height="7" rx="3.5" fill="#3D2D25" />
            </g>

            {/* Formed crochet stitches loops */}
            <g transform="translate(135, 60)">
              {Array.from({ length: Math.min(stitchCount, 8) }).map((_, i) => (
                <circle
                  key={i}
                  cx={i * 18}
                  cy="30"
                  r="10"
                  stroke="#4A382F"
                  strokeWidth="3.5"
                  fill="#F7EFE6"
                  className="transition-all duration-300"
                />
              ))}
            </g>
          </svg>

          {/* Micro interaction badge */}
          <button
            onClick={handleStitchPull}
            type="button"
            className="absolute bottom-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-100 hover:bg-blush-100 text-brown-700 text-xs font-medium border border-brown-200 transition-colors shadow-warm-sm"
          >
            <Sparkles size={12} className="text-burgundy-500" />
            <span>Pull loop ({stitchCount} {stitchCount === 1 ? 'stitch' : 'stitches'})</span>
          </button>
        </div>

        {/* Brand Logo & Wordmark Reveal */}
        <div className="mb-4">
          <Logo size="hero" showArabic={true} />
        </div>

        {/* Tagline per Brand Skill & Experience Plan */}
        <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-brown-700 max-w-2xl font-normal leading-relaxed mb-4">
          &ldquo;a word inspired by the little details.&rdquo;
        </p>

        <p className="text-base sm:text-lg text-brown-500 max-w-xl mx-auto font-light leading-relaxed mb-8">
          Handmade crochet bags, wearables, and accessories. Rooted in the Arabic
          concept of <span className="font-arabic font-semibold text-brown-700">هَدَب</span> — the delicate fringe
          at the edge of a piece that gives it character.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center">
          <a
            href="#featured"
            className="w-full sm:w-auto px-8 py-3.5 bg-burgundy-500 hover:bg-burgundy-600 text-cream-100 text-sm font-medium tracking-wide rounded-full shadow-warm transition-all duration-200 transform hover:-translate-y-0.5 text-center"
          >
            Explore The Pieces
          </a>
          <a
            href="#craft"
            className="w-full sm:w-auto px-8 py-3.5 bg-cream-100 hover:bg-cream-50 text-brown-700 border border-brown-300 text-sm font-medium tracking-wide rounded-full transition-all duration-200 text-center"
          >
            Our Handcrafted Story
          </a>
        </div>

        {/* 3 Brand Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 mt-14 pt-8 border-t border-brown-200/80 w-full max-w-3xl text-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-brown-400 font-semibold mb-1">
              Material
            </div>
            <div className="text-sm font-medium text-brown-800">
              100% Cotton Cord & Natural Fibers
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-brown-400 font-semibold mb-1">
              Patience
            </div>
            <div className="text-sm font-medium text-brown-800">
              Up to 18 Hours of Work Per Piece
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-brown-400 font-semibold mb-1">
              Philosophy
            </div>
            <div className="text-sm font-medium text-brown-800">
              Every Stitch Has Its Own Voice
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator with Thread Tail */}
      <div className="relative z-10 flex flex-col items-center mt-10 text-brown-500">
        <span className="text-[11px] tracking-widest uppercase mb-2 font-medium">
          Follow the thread
        </span>
        <a
          href="#brand-line"
          className="p-2 rounded-full border border-brown-300/80 hover:border-brown-700 hover:text-brown-800 transition-colors animate-bounce"
          aria-label="Scroll to narrative"
        >
          <ArrowDown size={16} />
        </a>
      </div>
    </section>
  );
};
