import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';

export const CraftJournal: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
  };

  return (
    <section id="story" className="py-24 px-4 sm:px-6 lg:px-8 bg-cream-100/70 border-t border-brown-200/60">
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Story of HADAB & Arabic Heritage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-burgundy-500 font-bold">
              <Sparkles size={12} />
              <span>Etymology & Craft</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brown-800 font-normal leading-tight">
              Small details that give a piece character
            </h2>

            <p className="text-brown-600 text-base leading-relaxed font-light">
              <strong className="font-arabic text-lg text-brown-800 font-semibold">هَدَب (HADAB)</strong> is the Arabic
              word for the small threads or fringes along the edge of a piece.
              They look simple, almost unimportant, but they are what make something feel
              unique and complete.
            </p>

            <p className="text-brown-500 text-sm leading-relaxed font-light">
              HADAB started with crochet but is meant to grow beyond it — creating pieces that
              feel personal, accompany you through daily routines, and let you express your
              style quietly and warmly.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-brown-700">
              <span className="w-1.5 h-1.5 rounded-full bg-burgundy-500" />
              <span>Jordan • Kuwait</span>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-warm-lg border border-brown-200 bg-cream-200 relative">
              <img
                src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=80"
                alt="Hands holding crochet hook and cotton cord"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-900/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-cream-100">
                <span className="font-arabic text-3xl sm:text-4xl font-normal block mb-1">
                  هَدَب
                </span>
                <p className="font-serif italic text-sm sm:text-base text-cream-200">
                  &ldquo;Details matter. Texture, shape, color, small imperfections, and the time behind every stitch.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter: Stay in the Loop */}
        <div className="bg-cream-200/90 rounded-3xl p-8 sm:p-14 border border-brown-200 text-center max-w-3xl mx-auto shadow-warm">
          <span className="text-[10px] uppercase tracking-[0.25em] text-brown-400 font-bold mb-2 block">
            Studio Mailings
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-brown-800 font-normal">
            Stay in the loop
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-brown-500 max-w-md mx-auto font-light leading-relaxed">
            Be the first to know when new products arrive and limited
            items are released. No spam — just real updates from us.
          </p>

          <div className="mt-8 max-w-md mx-auto">
            {isSubscribed ? (
              <div className="p-4 rounded-full bg-cream-100 border border-sage-500 text-sage-600 text-xs font-semibold flex items-center justify-center gap-2">
                <Check size={16} />
                <span>You're signed up. Thank you!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@studio.com"
                  required
                  className="w-full px-5 py-3 rounded-full bg-cream-100 border border-brown-300 text-brown-800 text-xs placeholder:text-brown-400 focus:outline-none focus:border-burgundy-500 transition-colors shadow-warm-sm"
                />
                <button
                  type="submit"
                  className="px-7 py-3 rounded-full bg-brown-700 hover:bg-burgundy-500 text-cream-100 text-xs font-semibold tracking-wider uppercase transition-all shadow-warm-sm flex-shrink-0"
                >
                  Join Loop
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
