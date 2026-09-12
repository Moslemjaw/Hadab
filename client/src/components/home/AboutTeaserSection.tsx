import React from 'react';
import { ThreadKnot } from '../common/ThreadSpine';
import { ArrowRight } from 'lucide-react';

export const AboutTeaserSection: React.FC = () => {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="relative rounded-3xl bg-cream-100 border border-brown-200 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-warm">
        {/* Decorative background Arabic calligraphy watermarked */}
        <div className="absolute -bottom-10 -right-10 font-arabic text-9xl text-brown-200/20 select-none pointer-events-none">
          هَدَب
        </div>

        <div className="relative z-10 max-w-2xl">
          <ThreadKnot color="brown" label="STITCH VII • THE NAME" className="!items-start mb-6" />

          <h2 className="font-serif text-3xl sm:text-4xl text-brown-800 font-normal leading-tight mb-6">
            The small details that make each piece special.
          </h2>

          <p className="text-brown-600 text-base sm:text-lg leading-relaxed font-light mb-4">
            In Arabic, <strong className="font-arabic font-semibold text-brown-800">هَدَب (HADAB)</strong> means
            the small threads or fringes along the edge of a piece of fabric.
            They are easy to miss, but they are what make
            something feel complete and well-made.
          </p>

          <p className="text-brown-500 text-sm sm:text-base leading-relaxed font-light mb-8">
            Every stitch we put into a bag, hat, or cardigan follows this idea:
            that beauty is in the small things — quiet textures, balanced colors,
            and pieces that become part of your daily life.
          </p>

          <a
            href="#story"
            className="inline-flex items-center gap-2 text-sm font-semibold text-burgundy-500 hover:text-burgundy-600 group transition-colors"
          >
            <span>Read our complete studio story</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};
