import React, { useState } from 'react';
import { ThreadKnot } from '../common/ThreadSpine';
import { Check } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream-100/70 border-t border-brown-200/60">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
        <ThreadKnot color="burgundy" label="STITCH VIII • STAY IN THE LOOP" className="mb-6" />

        <h2 className="font-serif text-3xl sm:text-4xl text-brown-800 font-normal">
          Stay in the loop
        </h2>

        <p className="mt-3 text-brown-500 max-w-md font-light text-base">
          Be the first to hear when new small batches are dyed, hooked, and
          ready for dispatch. No loud emails — just quiet studio updates.
        </p>

        {/* Input box with illustrative yarn loop border */}
        <div className="w-full max-w-md mt-8">
          {submitted ? (
            <div className="p-4 rounded-2xl bg-cream-50 border border-sage-500 text-sage-600 flex items-center justify-center gap-2 text-sm font-medium animate-in fade-in">
              <Check size={18} />
              <span>You are now part of our studio loop. Thank you!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full px-5 py-3.5 rounded-full bg-cream-50 border border-brown-300 text-brown-800 text-sm placeholder:text-brown-400 focus:outline-none focus:border-burgundy-500 transition-colors shadow-warm-sm"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-full bg-brown-700 hover:bg-burgundy-500 text-cream-100 text-xs uppercase tracking-wider font-semibold transition-all duration-200 shadow-warm-sm flex-shrink-0"
              >
                Join Loop
              </button>
            </form>
          )}

          <span className="block mt-3 text-[11px] text-brown-400 font-light">
            We honor your inbox. Unsubscribe with one click anytime.
          </span>
        </div>
      </div>
    </section>
  );
};
