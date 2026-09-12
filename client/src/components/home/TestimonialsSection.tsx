import React from 'react';
import { TESTIMONIALS } from '../../constants/mockData';
import { ThreadKnot } from '../common/ThreadSpine';
import { Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream-100/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-14">
          <ThreadKnot color="brown" label="STITCH VI • IN EVERYDAY LIFE" className="mb-6" />
          <h2 className="font-serif text-3xl sm:text-4xl text-brown-800 font-normal">
            Carried by friends of HADAB
          </h2>
          <p className="mt-2 text-brown-500 max-w-md font-light text-base">
            Notes from those who live with our bags, hats, and everyday pieces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-cream-200/60 rounded-2xl p-6 sm:p-7 border border-brown-200/80 flex flex-col justify-between hover:shadow-warm transition-all duration-300"
            >
              <div className="mb-6">
                <Quote size={24} className="text-blush-300 mb-3" />
                <p className="font-serif italic text-base sm:text-lg text-brown-700 leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-brown-200/60">
                <img
                  src={item.image}
                  alt={item.author}
                  className="w-10 h-10 rounded-full object-cover border border-brown-300"
                />
                <div>
                  <div className="text-xs font-semibold text-brown-800">
                    {item.author}
                  </div>
                  <div className="text-[11px] text-brown-400">
                    {item.location} • <span className="text-burgundy-500 font-medium">{item.pieceName}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
