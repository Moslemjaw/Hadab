import React, { useState } from 'react';
import { BEATS } from '../../hooks/useScrollScrubber';
import { tactileAudio } from '../../utils/audio';
import { Volume2, VolumeX } from 'lucide-react';

interface ScrollScrubberNavProps {
  activeBeat: number;
  progress: number;
  onSelectBeat: (index: number) => void;
}

export const ScrollScrubberNav: React.FC<ScrollScrubberNavProps> = ({
  activeBeat,
  progress,
  onSelectBeat,
}) => {
  const [isAudioActive, setIsAudioActive] = useState(tactileAudio.enabled);

  const handleAudioToggle = () => {
    const newState = tactileAudio.toggle();
    setIsAudioActive(newState);
  };

  return (
    <>
      {/* Desktop Scrubber Nav */}
      <aside
        aria-label="Story chapter navigation"
        className={`fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-5 select-none transition-opacity duration-300 ${
          progress > 0.96 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Tactile Sound Toggle */}
        <button
          type="button"
          onClick={handleAudioToggle}
          className={`p-2.5 rounded-full backdrop-blur-md border shadow-warm transition-all duration-300 flex items-center justify-center min-w-[40px] min-h-[40px] ${
            isAudioActive
              ? 'bg-burgundy-500 text-cream-100 border-burgundy-600'
              : 'bg-cream-100/80 text-brown-600 border-brown-200 hover:bg-cream-100'
          }`}
          title={isAudioActive ? 'Mute tactile sound' : 'Enable tactile scrub sound'}
          aria-label={isAudioActive ? 'Mute tactile sound' : 'Enable tactile scrub sound'}
        >
          {isAudioActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        {/* Chapters Scrub Column */}
        <nav aria-label="Chapters" className="flex flex-col items-end gap-3 bg-cream-100/80 backdrop-blur-md p-3 rounded-2xl border border-brown-200/80 shadow-warm">
          {BEATS.map((beat) => {
            const isActive = activeBeat === beat.index;

            return (
              <button
                key={beat.index}
                type="button"
                onClick={() => onSelectBeat(beat.index)}
                className="group flex items-center gap-3 py-1.5 text-right focus:outline-none min-h-[32px]"
              >
                {/* Tooltip on hover */}
                <span
                  className={`text-[11px] font-medium tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'text-brown-800 opacity-100 translate-x-0'
                      : 'text-brown-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
                  }`}
                >
                  {beat.title}
                </span>

                {/* Indicator Pip */}
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-burgundy-500 scale-125 ring-4 ring-burgundy-500/20'
                      : 'bg-brown-300 group-hover:bg-brown-500'
                  }`}
                />
              </button>
            );
          })}

          {/* Vertical Progress Fill Bar */}
          <div className="w-1 h-20 bg-cream-300 rounded-full mt-2 overflow-hidden self-center">
            <div
              className="w-full bg-burgundy-500 transition-all duration-150 rounded-full"
              style={{ height: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </nav>
      </aside>

      {/* Mobile Floating Indicator: Audio toggle + Chapter dots */}
      <aside
        aria-label="Mobile story navigation"
        className={`fixed right-2.5 xs:right-3.5 top-20 z-40 md:hidden flex flex-col items-center gap-2 select-none transition-opacity duration-300 ${
          progress > 0.96 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <button
          type="button"
          onClick={handleAudioToggle}
          className={`w-8 h-8 rounded-full backdrop-blur-md border shadow-warm transition-all duration-300 flex items-center justify-center active:scale-95 ${
            isAudioActive
              ? 'bg-burgundy-500 text-cream-100 border-burgundy-600'
              : 'bg-cream-100/90 text-brown-600 border-brown-200 hover:bg-cream-100'
          }`}
          aria-label={isAudioActive ? 'Mute tactile sound' : 'Enable tactile scrub sound'}
        >
          {isAudioActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </button>

        <div className="flex flex-col items-center gap-1.5 py-2 px-1 rounded-full bg-cream-100/85 backdrop-blur-md border border-brown-200/80 shadow-warm">
          {BEATS.map((beat) => {
            const isActive = activeBeat === beat.index;
            return (
              <button
                key={beat.index}
                type="button"
                onClick={() => onSelectBeat(beat.index)}
                className="p-1.5 focus:outline-none min-w-[24px] min-h-[24px] flex items-center justify-center"
                aria-label={`Jump to ${beat.title}`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-burgundy-500 scale-125 ring-2 ring-burgundy-500/30'
                      : 'bg-brown-300 hover:bg-brown-500'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
