import React from 'react';
import { ThreadKnot } from '../common/ThreadSpine';

export const CraftProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Fiber Selection',
      detail: 'Dense, marled recycled cotton cord and unbleached linen that hold shape without synthetic stiffeners.',
      tag: 'Raw Materials',
    },
    {
      num: '02',
      title: 'The Hand Rhythm',
      detail: 'No automated looms or fast factory lines. Every single loop is caught and pulled through by hand.',
      tag: 'Slow Craft',
    },
    {
      num: '03',
      title: 'Structural Integrity',
      detail: 'Reinforced base stitches and continuous cord handles that expand naturally with daily use.',
      tag: 'Everyday Wear',
    },
    {
      num: '04',
      title: 'The Edge (هَدَب)',
      detail: 'Tied off with our signature delicate fringe or loop tassel — the finishing detail that makes it whole.',
      tag: 'Character',
    },
  ];

  return (
    <section id="craft" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center mb-16">
        <ThreadKnot color="sage" label="STITCH V • OUR PROCESS" className="mb-6" />
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brown-800 font-normal">
          How every piece comes to life
        </h2>
        <p className="mt-3 text-brown-500 max-w-lg font-light text-base">
          In a world of mass production, we take pride in the quiet, meditative
          hours spent between the needle and the yarn.
        </p>
      </div>

      {/* Visual & Narrative Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left: Large editorial craft photo representation */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-warm-lg border border-brown-200">
            <img
              src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=80"
              alt="Hands crocheting cotton yarn"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brown-900/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-cream-100">
              <span className="text-[11px] uppercase tracking-widest bg-brown-800/80 px-3 py-1 rounded-full backdrop-blur-sm">
                Studio Journal
              </span>
              <p className="mt-2 font-serif italic text-lg sm:text-xl">
                &ldquo;There is an honesty in each stitch — you can feel the maker&rsquo;s presence in the piece.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Right: 4-step craft breakdown */}
        <div className="lg:col-span-6 space-y-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-6 rounded-2xl bg-cream-100/60 border border-brown-200/80 hover:border-sage-500 transition-all duration-300 hover:bg-cream-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-semibold text-lg text-sage-600">
                  {step.num}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-brown-400 font-medium">
                  {step.tag}
                </span>
              </div>
              <h3 className="font-serif text-xl text-brown-800 font-medium mb-1.5">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-brown-500 font-light leading-relaxed">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
