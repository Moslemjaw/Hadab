import React from 'react';
import { ThreadKnot } from '../common/ThreadSpine';

export const BrandLineInSection: React.FC = () => {
  return (
    <section id="brand-line" className="py-20 px-4 sm:px-6 lg:px-8 bg-cream-100/60 relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Thread connector knot */}
        <ThreadKnot color="brown" label="STITCH I" className="mb-8" />

        {/* 3 Sequential Narrative Phrases */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-block">
            <span className="text-xs uppercase tracking-[0.25em] text-brown-400 font-semibold">
              The Philosophy
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brown-800 font-normal leading-tight">
            Handmade. <br className="hidden sm:inline" />
            <span className="italic text-burgundy-500 font-normal">
              One stitch at a time.
            </span>{' '}
            <br className="hidden sm:inline" />
            For your everyday.
          </h2>

          <div className="pt-4 max-w-xl mx-auto">
            <p className="text-brown-500 text-base sm:text-lg leading-relaxed font-light">
              We believe details are not just finishing touches — they are the
              heart of the piece. Texture, shape, color, small imperfections,
              and the time spent on each loop give every piece its character.
            </p>
          </div>
        </div>

        {/* Tactile swatch strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs text-brown-600 font-medium">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream-200/80 border border-brown-200">
            <span className="w-3 h-3 rounded-full bg-[#F2E8DD] border border-brown-300" />
            <span>Cream Canvas</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream-200/80 border border-brown-200">
            <span className="w-3 h-3 rounded-full bg-[#4A382F]" />
            <span>Deep Brown</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream-200/80 border border-brown-200">
            <span className="w-3 h-3 rounded-full bg-[#E7C9C8]" />
            <span>Blush Accent</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream-200/80 border border-brown-200">
            <span className="w-3 h-3 rounded-full bg-[#7A8060]" />
            <span>Sage Earth</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream-200/80 border border-brown-200">
            <span className="w-3 h-3 rounded-full bg-[#610C25]" />
            <span>Burgundy Knot</span>
          </div>
        </div>
      </div>
    </section>
  );
};
