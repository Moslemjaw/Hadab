import React, { useEffect, useRef, useState, useCallback } from 'react';

interface FrameCanvasProps {
  currentFrame: number; // continuous float 0.0 to 18.0
  onLoaded?: () => void;
  isAr?: boolean;
}

const TOTAL_FRAMES = 19;

export const FrameCanvas: React.FC<FrameCanvasProps> = ({ currentFrame, onLoaded, isAr = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Cached viewport dimensions
  const dimsRef = useRef<{ width: number; height: number; dpr: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    dpr: 2,
  });

  // Preload and decode all 36 frames into GPU memory before playback
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${frameNum}.jpg`;

      let isHandled = false;
      const safeCallback = () => {
        if (isHandled) return;
        isHandled = true;
        loaded++;
        const pct = Math.round((loaded / TOTAL_FRAMES) * 100);
        setLoadProgress(pct);

        if (loaded === TOTAL_FRAMES) {
          setIsReady(true);
          if (onLoaded) onLoaded();
        }
      };

      img.onload = safeCallback;
      img.onerror = safeCallback;

      if (typeof img.decode === 'function') {
        img.decode().then(safeCallback).catch(() => {});
      }

      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      imagesRef.current = [];
    };
  }, [onLoaded]);

  // Update cached dimensions on resize and ensure High-DPI canvas buffer
  useEffect(() => {
    const updateDims = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      // Guarantee at least 2x DPR for ultra-crisp Retina rendering on all screens
      const dpr = Math.max(2, Math.min(window.devicePixelRatio || 1, 3));
      // Always use window dimensions — the canvas lives inside a sticky full-screen container
      const width = window.innerWidth;
      const height = window.innerHeight;

      dimsRef.current = { width, height, dpr };

      const targetBufferW = Math.round(width * dpr);
      const targetBufferH = Math.round(height * dpr);

      if (canvas.width !== targetBufferW || canvas.height !== targetBufferH) {
        canvas.width = targetBufferW;
        canvas.height = targetBufferH;
      }
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    updateDims();
    window.addEventListener('resize', updateDims, { passive: true });
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // Compute geometry so that frames 21+ align their thread border precisely with the navbar beginning and end
  const computeFrameGeometry = useCallback((frameFloat: number, imgW: number, imgH: number) => {
    const { width, height } = dimsRef.current;

    const isMobile = width < 768;
    const navBarHeight = 78;

    // Elegant luxury scale - comfortably sized so it never collides with side text
    const standardScale = Math.min(width / imgW, height / imgH) * (isMobile ? 0.75 : 0.66);
    const baseW = Math.round(imgW * standardScale);
    const baseH = Math.round(imgH * standardScale);
    const baseX = Math.round((width - baseW) / 2);
    const baseY = Math.round(((height - navBarHeight) - baseH) / 2) - Math.round(navBarHeight * 0.35);

    if (isMobile) {
      // On mobile for Beat 0 (Hero): position logo in the upper section
      const mobileHeroScale = Math.min((width * 0.58) / imgW, (height * 0.28) / imgH);
      const heroW = Math.round(imgW * mobileHeroScale);
      const heroH = Math.round(imgH * mobileHeroScale);
      const heroX = Math.round((width - heroW) / 2);
      const heroY = navBarHeight + Math.round(height * 0.03);

      if (frameFloat <= 7) {
        return { drawX: heroX, drawY: heroY, drawW: heroW, drawH: heroH };
      }
      // Smoothly lerp from upper position to centered position as it unfolds into Beat 1 bag
      const t = Math.min(1, Math.max(0, (frameFloat - 7) / 4));
      const smoothT = t * t * (3 - 2 * t);
      return {
        drawX: Math.round(heroX + (baseX - heroX) * smoothT),
        drawY: Math.round(heroY + (baseY - heroY) * smoothT),
        drawW: Math.round(heroW + (baseW - heroW) * smoothT),
        drawH: Math.round(heroH + (baseH - heroH) * smoothT),
      };
    }

    // On Desktop: In Beat 0 (frames 0 to 7), offset logo away from text column
    // English text is on the left -> logo is offset right (+13% screen width)
    // Arabic text is on the right -> logo is offset left (-13% screen width)
    const shiftDirection = isAr ? -1 : 1;
    const desktopHeroX = Math.round(baseX + width * 0.13 * shiftDirection);

    if (frameFloat <= 7) {
      return { drawX: desktopHeroX, drawY: baseY, drawW: baseW, drawH: baseH };
    }

    // Smoothly glide to center as it morphs into the bag (frames 7 to 12)
    const t = Math.min(1, Math.max(0, (frameFloat - 7) / 4.5));
    const smoothT = t * t * (3 - 2 * t);
    const drawX = Math.round(desktopHeroX + (baseX - desktopHeroX) * smoothT);

    return { drawX, drawY: baseY, drawW: baseW, drawH: baseH };
  }, [isAr]);



  // Draw frame with High-DPI clarity, zero ghosting, and high image smoothing
  const drawFrame = useCallback(
    (frameFloat: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height, dpr } = dimsRef.current;
      if (width === 0 || height === 0) return;

      const targetBufferW = Math.round(width * dpr);
      const targetBufferH = Math.round(height * dpr);

      if (canvas.width !== targetBufferW || canvas.height !== targetBufferH) {
        canvas.width = targetBufferW;
        canvas.height = targetBufferH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Set high quality bicubic interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Base background fill (HADAB Cream)
      ctx.fillStyle = '#E4DCCD';
      ctx.fillRect(0, 0, width, height);

      const clampedFloat = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameFloat));
      // Integer frame selection ensures crisp lines with zero double-exposure ghosting
      const frameIdx = Math.round(clampedFloat);


      const img = imagesRef.current[frameIdx];
      if (!img || !img.complete || img.naturalWidth === 0) {
        ctx.restore();
        return;
      }

      const { drawX, drawY, drawW, drawH } = computeFrameGeometry(
        clampedFloat,
        img.naturalWidth,
        img.naturalHeight
      );

      // Draw single crisp frame
      if (frameIdx <= 5) {
        ctx.globalCompositeOperation = 'multiply';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1.0;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';

      // Subtle edge feathering for seamless background integration without blurring threads
      if (frameIdx > 5) {
        const featherX = Math.min(24, drawW * 0.03);
        const featherY = Math.min(24, drawH * 0.03);

        // Left feather
        const gradL = ctx.createLinearGradient(drawX, 0, drawX + featherX, 0);
        gradL.addColorStop(0, '#E4DCCD');
        gradL.addColorStop(1, 'rgba(228, 220, 205, 0)');
        ctx.fillStyle = gradL;
        ctx.fillRect(drawX, drawY, featherX, drawH);

        // Right feather
        const gradR = ctx.createLinearGradient(drawX + drawW - featherX, 0, drawX + drawW, 0);
        gradR.addColorStop(0, 'rgba(228, 220, 205, 0)');
        gradR.addColorStop(1, '#E4DCCD');
        ctx.fillStyle = gradR;
        ctx.fillRect(drawX + drawW - featherX, drawY, featherX, drawH);

        // Top feather
        const gradT = ctx.createLinearGradient(0, drawY, 0, drawY + featherY);
        gradT.addColorStop(0, '#E4DCCD');
        gradT.addColorStop(1, 'rgba(228, 220, 205, 0)');
        ctx.fillStyle = gradT;
        ctx.fillRect(drawX, drawY, drawW, featherY);

        // Bottom feather
        const gradB = ctx.createLinearGradient(0, drawY + drawH - featherY, 0, drawY + drawH);
        gradB.addColorStop(0, 'rgba(228, 220, 205, 0)');
        gradB.addColorStop(1, '#E4DCCD');
        ctx.fillStyle = gradB;
        ctx.fillRect(drawX, drawY + drawH - featherY, drawW, featherY);
      }

      ctx.restore();
    },
    [computeFrameGeometry]
  );

  useEffect(() => {
    if (!isReady) return;
    drawFrame(currentFrame);
  }, [currentFrame, isReady, drawFrame]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#E4DCCD' }}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none transition-opacity duration-500"
        style={{ opacity: isReady ? 1 : 0 }}
      />

      {/* Luxury Loading Screen */}
      {!isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 space-y-4" style={{ backgroundColor: '#E4DCCD' }}>
          <div className="w-12 h-12 relative flex items-center justify-center">
            <svg
              className="animate-spin w-full h-full text-brown-700"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <div className="text-center space-y-1">
            <span className="font-serif italic text-lg text-brown-800 tracking-wide">
              Weaving Experience
            </span>
            <div className="text-xs uppercase tracking-[0.2em] text-brown-400 font-medium">
              Loading frames • {loadProgress}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
