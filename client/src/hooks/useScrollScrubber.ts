import { useState, useEffect, useRef } from 'react';
import { tactileAudio } from '../utils/audio';

export interface ScrollScrubberState {
  progress: number;       // 0 to 1
  frameIndex: number;     // 0 to 35 (integer)
  floatFrame: number;     // continuous float 0.0 to 35.0
  activeBeat: number;     // 0 to 3
  scrollToBeat: (beatIndex: number) => void;
}

const TOTAL_FRAMES = 36;

export const BEATS = [
  { index: 0, title: '01 Overture', subtitle: 'The craft begins', range: [0, 11], frameTarget: 0 },
  { index: 1, title: '02 The Form', subtitle: 'Handmade, one stitch at a time', range: [12, 20], frameTarget: 17 },
  { index: 2, title: '03 Collection', subtitle: 'Curated for daily carry', range: [21, 29], frameTarget: 27 },
  { index: 3, title: '04 Categories', subtitle: 'Bags, Wearables & Details', range: [30, 35], frameTarget: 34 },
];

export function useScrollScrubber(containerRef: React.RefObject<HTMLDivElement | null>): ScrollScrubberState {
  const [progress, setProgress] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [floatFrame, setFloatFrame] = useState(0);
  const [activeBeat, setActiveBeat] = useState(0);

  const targetProgressRef = useRef(0);
  const currentLerpRef = useRef(0);
  const lastIntFrameRef = useRef(0);
  const lastActiveBeatRef = useRef(0);
  const lastTickTimeRef = useRef(0);
  const lastProgressStateRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const top = -rect.top;
      const clamped = Math.max(0, Math.min(1, top / scrollableHeight));
      targetProgressRef.current = clamped;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    // High-performance RAF loop: decoupled from scroll events for silky 60fps/120fps glide
    const animate = () => {
      if (!isMounted) return;

      // Luxury exponential smoothing: 0.12 damping factor produces buttery momentum
      const diff = targetProgressRef.current - currentLerpRef.current;
      currentLerpRef.current += diff * 0.12;

      const currentFloat = currentLerpRef.current * (TOTAL_FRAMES - 1);
      const clampedFloat = Math.max(0, Math.min(TOTAL_FRAMES - 1, currentFloat));
      const roundedInt = Math.round(clampedFloat);

      setFloatFrame(clampedFloat);

      // Only update integer frame state when it crosses an integer boundary
      if (roundedInt !== lastIntFrameRef.current) {
        lastIntFrameRef.current = roundedInt;
        setFrameIndex(roundedInt);

        // Sound trigger with 45ms cooldown to avoid audio engine stutter
        const now = performance.now();
        if (now - lastTickTimeRef.current > 45) {
          lastTickTimeRef.current = now;
          tactileAudio.playScrubTick(260 + roundedInt * 8);
        }
      }

      // Determine active beat
      const beat = BEATS.find(
        (b) => roundedInt >= b.range[0] && roundedInt <= b.range[1]
      );
      if (beat && beat.index !== lastActiveBeatRef.current) {
        lastActiveBeatRef.current = beat.index;
        setActiveBeat(beat.index);
      }

      // Update progress state with small threshold to avoid pointless re-renders
      if (Math.abs(currentLerpRef.current - lastProgressStateRef.current) > 0.003) {
        lastProgressStateRef.current = currentLerpRef.current;
        setProgress(currentLerpRef.current);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      isMounted = false;
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef]);

  const scrollToBeat = (beatIndex: number) => {
    if (!containerRef.current) return;
    const targetBeat = BEATS[beatIndex];
    if (!targetBeat) return;

    const targetProgress = targetBeat.frameTarget / (TOTAL_FRAMES - 1);
    const rect = containerRef.current.getBoundingClientRect();
    const scrollableHeight = rect.height - window.innerHeight;
    const currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const targetScrollY = currentY + rect.top + targetProgress * scrollableHeight;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  return {
    progress,
    frameIndex,
    floatFrame,
    activeBeat,
    scrollToBeat,
  };
}
