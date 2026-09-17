import React, { useEffect, useRef, useState, useCallback } from 'react';

interface FrameCanvasProps {
  currentFrame: number; // continuous float 0.0 to 35.0
  onLoaded?: () => void;
}

const TOTAL_FRAMES = 19;

export const FrameCanvas: React.FC<FrameCanvasProps> = ({ currentFrame, onLoaded }) => {
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

    // Base uniform scale for Hero & 3D Bag (frames 0 - 20)
    const standardScale = Math.min(width / imgW, height / imgH) * 0.90;
    const baseW = Math.round(imgW * standardScale);
    const baseH = Math.round(imgH * standardScale);
    const baseX = Math.round((width - baseW) / 2);
    const baseY = Math.round(((height - navBarHeight) - baseH) / 2) - Math.round(navBarHeight * 0.35);

    if (frameFloat <= 20) {
      if (isMobile && frameFloat < 12) {
        // On mobile for Beat 0 (Hero): position logo UP in the upper section
        const mobileHeroScale = Math.min((width * 0.65) / imgW, (height * 0.30) / imgH);
        const heroW = Math.round(imgW * mobileHeroScale);
        const heroH = Math.round(imgH * mobileHeroScale);
        const heroX = Math.round((width - heroW) / 2);
        // Positioned in the upper region below the navbar
        const heroY = navBarHeight + Math.round(height * 0.025);

        if (frameFloat <= 10) {
          return { drawX: heroX, drawY: heroY, drawW: heroW, drawH: heroH };
        }
        // Smoothly lerp from upper position to centered position as it unfolds into Beat 1 bag
        const t = (frameFloat - 10) / 2;
        return {
          drawX: Math.round(heroX + (baseX - heroX) * t),
          drawY: Math.round(heroY + (baseY - heroY) * t),
          drawW: Math.round(heroW + (baseW - heroW) * t),
          drawH: Math.round(heroH + (baseH - heroH) * t),
        };
      }
      return { drawX: baseX, drawY: baseY, drawW: baseW, drawH: baseH };
    }

    // For Sections 3 & 4 (Frames 21 - 36):
    // Align the thread cord frame precisely with the navbar bounds:
    // In raw frames:
    // Left cord border: x = 126 (0.0984 * 1280)
    // Right cord border: x = 1159 (0.9055 * 1280)
    // Cord width = 1033 (0.8070 * 1280)
    // Top cord border: y = 130 (0.1016 * 1280)
    // Bottom cord border: y = 1146 (0.8953 * 1280)
    // Cord height = 1016 (0.7938 * 1280)

    const navMaxW = Math.min(width - 48, 1280);
    const navLeft = Math.round((width - navMaxW) / 2);
    const navRight = navLeft + navMaxW;

    // Target cord coordinates on screen to match navbar start and end
    const targetCordLeft = navLeft;
    const targetCordRight = navRight;
    const targetCordWidth = targetCordRight - targetCordLeft;

    // Vertically: cord fits comfortably between top sticky navbar (~85px) and bottom status bar (~height - 85px)
    const targetCordTop = Math.max(75, Math.min(95, height * 0.09));
    const targetCordBottom = height - Math.max(80, Math.min(105, height * 0.11));
    const targetCordHeight = targetCordBottom - targetCordTop;

    const targetScaleX = targetCordWidth / 1033;
    const targetScaleY = targetCordHeight / 1016;

    const targetW = Math.round(imgW * targetScaleX);
    const targetH = Math.round(imgH * targetScaleY);
    const targetX = Math.round(targetCordLeft - 126 * targetScaleX);
    const targetY = Math.round(targetCordTop - 130 * targetScaleY);

    // Smooth transition between frame 20 and 26
    const t = Math.min(1, Math.max(0, (frameFloat - 20) / 6));
    const smoothT = t * t * (3 - 2 * t);

    const drawW = Math.round(baseW + (targetW - baseW) * smoothT);
    const drawH = Math.round(baseH + (targetH - baseH) * smoothT);
    const drawX = Math.round(baseX + (targetX - baseX) * smoothT);
    const drawY = Math.round(baseY + (targetY - baseY) * smoothT);

    return { drawX, drawY, drawW, drawH };
  }, []);

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
