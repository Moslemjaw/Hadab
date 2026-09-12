import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Heart, Compass, Feather, Check } from 'lucide-react';

interface StoryPageProps {
  onBackToHome: () => void;
  onExploreCollection: () => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({
  onBackToHome,
  onExploreCollection,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <article className="w-full bg-[#F2E8DD] text-[#4A382F] font-sans selection:bg-[#E7C9C8] selection:text-[#4A382F] min-h-screen">
      {/* Top Breadcrumb / Return Affordance */}
      <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 xs:px-6 sm:px-10 pt-8 sm:pt-12 pb-4">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#4A382F]/75 hover:text-[#610C25] font-semibold transition-colors group min-h-[40px]"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>Return to Atelier</span>
        </button>
      </nav>

      {/* Hero: The Etymology of هَدَب */}
      <header className="max-w-4xl mx-auto px-4 xs:px-6 sm:px-10 pt-4 pb-16 sm:pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-100/90 border border-[#4A382F]/15 text-[#610C25] text-[10.5px] uppercase font-bold tracking-[0.24em] mb-6 shadow-sm">
          <Sparkles size={13} className="text-[#610C25]" />
          <span>Our Story & Philosophy</span>
        </div>

        <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-[#4A382F] font-normal leading-[1.15] tracking-tight mb-6">
          A word inspired by the <span className="italic">little details</span>.
        </h1>

        {/* The Arabic Etymology Focus Card */}
        <div className="mt-8 sm:mt-12 p-6 sm:p-10 rounded-3xl bg-cream-100/80 border border-[#4A382F]/15 shadow-warm max-w-2xl mx-auto relative overflow-hidden text-center">
          {/* Subtle background calligraphy watermark */}
          <div className="absolute -bottom-6 -right-6 font-arabic text-8xl sm:text-9xl text-[#4A382F]/[0.04] select-none pointer-events-none">
            هَدَب
          </div>

          <div className="relative z-10">
            <span className="font-arabic text-5xl sm:text-6xl md:text-7xl text-[#4A382F] font-normal block mb-2">
              هَدَبٌ
            </span>
            <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.22em] text-[#4A382F]/70 font-semibold mb-4">
              <span>[ha·dab]</span>
              <span>•</span>
              <span>Arabic noun</span>
            </div>
            <p className="font-serif italic text-base sm:text-lg text-[#4A382F] leading-relaxed max-w-lg mx-auto">
              &ldquo;The delicate threads or fringes hanging from the edge of a woven piece.
              Small details that seem simple, but give something character and make it feel complete.&rdquo;
            </p>
          </div>
        </div>
      </header>

      {/* Chapter 1: The Core Thesis & Photography */}
      <section className="max-w-6xl mx-auto px-4 xs:px-6 sm:px-10 py-12 sm:py-20 border-t border-[#4A382F]/15">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center">
          {/* Image composition */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-warm-lg border border-[#4A382F]/15 bg-cream-200">
              <img
                src="/products/hadab-bag.jpg"
                alt="HADAB handmade crochet bag in natural unbleached cotton cord"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A382F]/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-cream-100">
                <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-cream-200/90 block mb-1">
                  ATELIER ARCHIVE • 2026
                </span>
                <p className="font-serif italic text-sm sm:text-base text-cream-100">
                  Every stitch is placed by hand, one loop at a time.
                </p>
              </div>
            </div>

            {/* Floating accent card */}
            <div className="hidden sm:flex absolute -bottom-6 -right-6 p-4 rounded-2xl bg-cream-100/95 backdrop-blur-md border border-[#4A382F]/15 shadow-warm items-center gap-3 max-w-xs">
              <div className="w-10 h-10 rounded-full bg-[#E7C9C8]/50 flex items-center justify-center text-[#610C25] shrink-0">
                <Heart size={18} />
              </div>
              <p className="text-xs text-[#4A382F] font-light leading-snug">
                Small imperfections are not flaws—they are proof of a human hand at work.
              </p>
            </div>
          </div>

          {/* Narrative copy */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#610C25] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#610C25]" />
              <span>The Beginning</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#4A382F] font-normal leading-tight">
              We started with a hook, a strand of cotton, and a quiet belief.
            </h2>

            <p className="text-[#4A382F]/90 text-sm sm:text-base leading-relaxed font-light">
              HADAB was born from an appreciation for unhurried craft. In a world full of
              automated speed and identical mass production, we chose the deliberate rhythm
              of single-hook crochet.
            </p>

            <p className="text-[#4A382F]/90 text-sm sm:text-base leading-relaxed font-light">
              Our core belief is simple: <strong className="font-medium text-[#4A382F]">details matter</strong>.
              The texture of thick unbleached cotton, the subtle tension between loops, the drape of
              a bag as it settles on your shoulder, and the quiet hours behind each piece—all add
              something singular that cannot be manufactured.
            </p>

            <p className="text-[#4A382F]/80 text-sm sm:text-base leading-relaxed font-light">
              While HADAB began with crochet, our vision extends beyond it. We design pieces that feel
              intimate, accompany your everyday rituals, and invite you to carry your own style with calm confidence.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#4A382F]/75">
              <span className="w-2 h-2 rounded-full bg-[#7A8060]" />
              <span>Based between Amman, Jordan & Kuwait City</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: Four Tenets of Craft */}
      <section className="bg-cream-100/60 py-16 sm:py-24 border-y border-[#4A382F]/15">
        <div className="max-w-6xl mx-auto px-4 xs:px-6 sm:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#4A382F]/60 font-bold block mb-2">
              Our Core Principles
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#4A382F] font-normal">
              How we create every piece
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tenet 1 */}
            <div className="p-6 rounded-2xl bg-cream-100 border border-[#4A382F]/10 shadow-warm flex flex-col justify-between">
              <div>
                <span className="font-serif text-2xl text-[#610C25] font-semibold block mb-3">01</span>
                <h3 className="font-serif text-lg text-[#4A382F] font-medium mb-2">
                  Unhurried Pace
                </h3>
                <p className="text-xs text-[#4A382F]/80 font-light leading-relaxed">
                  No assembly lines or factory quotas. Each bag requires 14 to 18 hours of continuous hand-stitching in small, thoughtful batches.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#4A382F]/10 text-[10px] uppercase tracking-[0.2em] text-[#610C25] font-bold">
                14–18 Hours / Piece
              </div>
            </div>

            {/* Tenet 2 */}
            <div className="p-6 rounded-2xl bg-cream-100 border border-[#4A382F]/10 shadow-warm flex flex-col justify-between">
              <div>
                <span className="font-serif text-2xl text-[#7A8060] font-semibold block mb-3">02</span>
                <h3 className="font-serif text-lg text-[#4A382F] font-medium mb-2">
                  Material Honesty
                </h3>
                <p className="text-xs text-[#4A382F]/80 font-light leading-relaxed">
                  We use thick 5mm unbleached natural cotton cord (trapillo). It provides substantial structure, tactile warmth, and wears gracefully over time.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#4A382F]/10 text-[10px] uppercase tracking-[0.2em] text-[#7A8060] font-bold">
                5mm Natural Cotton
              </div>
            </div>

            {/* Tenet 3 */}
            <div className="p-6 rounded-2xl bg-cream-100 border border-[#4A382F]/10 shadow-warm flex flex-col justify-between">
              <div>
                <span className="font-serif text-2xl text-[#610C25] font-semibold block mb-3">03</span>
                <h3 className="font-serif text-lg text-[#4A382F] font-medium mb-2">
                  Human Imperfection
                </h3>
                <p className="text-xs text-[#4A382F]/80 font-light leading-relaxed">
                  Every piece carries small variations in loop tension. These aren't defects—they are the authentic signature of human craftsmanship.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#4A382F]/10 text-[10px] uppercase tracking-[0.2em] text-[#610C25] font-bold">
                Individually Distinct
              </div>
            </div>

            {/* Tenet 4 */}
            <div className="p-6 rounded-2xl bg-cream-100 border border-[#4A382F]/10 shadow-warm flex flex-col justify-between">
              <div>
                <span className="font-serif text-2xl text-[#4A382F] font-semibold block mb-3">04</span>
                <h3 className="font-serif text-lg text-[#4A382F] font-medium mb-2">
                  Daily Companions
                </h3>
                <p className="text-xs text-[#4A382F]/80 font-light leading-relaxed">
                  Created not to sit on a shelf, but to accompany your mornings, hold your notebook, and integrate naturally into your everyday life.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#4A382F]/10 text-[10px] uppercase tracking-[0.2em] text-[#4A382F] font-bold">
                Made for Everyday
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: Dual Roots — Amman & Kuwait */}
      <section className="max-w-6xl mx-auto px-4 xs:px-6 sm:px-10 py-16 sm:py-24">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#4A382F] text-cream-100 relative overflow-hidden shadow-warm-lg">
          {/* Subtle graphic background watermark */}
          <div className="absolute inset-0 flex items-center justify-end pointer-events-none opacity-[0.04] px-6">
            <img src="/PNG-HADAB-CREAM.png" alt="" className="w-96 object-contain" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#E7C9C8] font-bold mb-4">
              <Compass size={14} />
              <span>Two Places • One Atelier</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-cream-100 font-normal leading-tight mb-6">
              Connected across the Levant and the Gulf.
            </h2>

            <p className="text-cream-200/90 text-sm sm:text-base font-light leading-relaxed mb-4">
              HADAB lives between the ancient, sun-warmed stone hills of <strong className="text-cream-100 font-medium">Amman, Jordan</strong> and
              the calm coastal horizons of <strong className="text-cream-100 font-medium">Kuwait City</strong>.
            </p>

            <p className="text-cream-200/80 text-xs sm:text-sm font-light leading-relaxed mb-8">
              This dual heritage shapes everything we do: the enduring strength of Middle Eastern textile traditions
              paired with modern, minimal silhouettes suited for living anywhere in the world.
            </p>

            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onExploreCollection}
                className="px-6 py-3 rounded-full bg-[#610C25] hover:bg-[#7a0f2f] text-cream-100 text-xs font-semibold tracking-wider uppercase transition-all shadow-warm-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Browse The Archive</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={onBackToHome}
                className="px-6 py-3 rounded-full border border-cream-200/40 hover:border-cream-100 text-cream-100 text-xs font-medium tracking-wider uppercase transition-colors flex items-center justify-center"
              >
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 4: Studio Mailings / Join the Story */}
      <section className="max-w-3xl mx-auto px-4 xs:px-6 sm:px-10 pb-20 sm:pb-28 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-cream-100/90 border border-[#4A382F]/15 shadow-warm">
          <Feather size={22} className="mx-auto text-[#610C25] mb-3" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#4A382F]/60 font-bold block mb-1">
            Studio Mailings
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#4A382F] font-normal mb-3">
            Follow the craft as it unfolds
          </h3>
          <p className="text-xs sm:text-sm text-[#4A382F]/75 font-light leading-relaxed max-w-md mx-auto mb-6">
            We share occasional notes on new stitch developments, quiet drops, and behind-the-scenes stories from the atelier. No noise, just craft.
          </p>

          {subscribed ? (
            <div className="p-3.5 rounded-full bg-sage-50 border border-sage-400 text-sage-800 text-xs font-semibold flex items-center justify-center gap-2 max-w-sm mx-auto">
              <Check size={16} className="text-sage-600" />
              <span>You're subscribed to studio notes. Thank you.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@atelier.com"
                required
                className="w-full px-5 py-3 rounded-full bg-cream-50 border border-[#4A382F]/20 text-xs text-[#4A382F] placeholder:text-[#4A382F]/40 focus:outline-none focus:border-[#610C25] transition-colors shadow-sm"
              />
              <button
                type="submit"
                className="px-7 py-3 rounded-full bg-[#4A382F] hover:bg-[#610C25] text-cream-100 text-xs font-semibold tracking-wider uppercase transition-all shadow-sm flex-shrink-0 active:scale-95"
              >
                Join Notes
              </button>
            </form>
          )}
        </div>
      </section>
    </article>
  );
};
