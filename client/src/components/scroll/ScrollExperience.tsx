import React, { useRef } from 'react';
import { useScrollScrubber } from '../../hooks/useScrollScrubber';
import { FrameCanvas } from './FrameCanvas';
import { ScrollNarrativeOverlay } from './ScrollNarrativeOverlay';
import type { Product } from '../../types';

interface ScrollExperienceProps {
  onAddToBag: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onExploreCatalog: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const ScrollExperience: React.FC<ScrollExperienceProps> = ({
  onAddToBag,
  onSelectProduct,
  onExploreCatalog,
  onSelectCategory,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { frameIndex, floatFrame, activeBeat } = useScrollScrubber(containerRef);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[140vh] sm:min-h-[150vh]"
      style={{ backgroundColor: '#E4DCCD' }}
    >
      {/* Sticky Cinematic Viewport */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex items-center justify-center">
        {/* The 19-Frame Canvas: optical 60fps/120fps subframe cross-fading to the bag frame */}
        <FrameCanvas currentFrame={floatFrame} />

        {/* Narrative & Micro-Interaction Overlay: continuous liquid interpolation */}
        <ScrollNarrativeOverlay
          currentFrame={frameIndex}
          floatFrame={floatFrame}
          activeBeat={activeBeat}
          onAddToBag={onAddToBag}
          onSelectProduct={onSelectProduct}
          onExploreCatalog={onExploreCatalog}
          onSelectCategory={onSelectCategory}
        />
      </div>
    </section>
  );
};
