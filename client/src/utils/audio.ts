// Minimalist luxury tactile audio feedback using Web Audio API
// Generates warm, subtle clicks resembling soft wooden crochet hook taps and thread tension.

class TactileAudio {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private lastSoundTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.init();
        if (this.ctx && this.ctx.state === 'running') {
          window.removeEventListener('pointerdown', unlockAudio);
          window.removeEventListener('keydown', unlockAudio);
          window.removeEventListener('scroll', unlockAudio);
        }
      };
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
      window.addEventListener('scroll', unlockAudio, { passive: true });
    }
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.init();
      this.playChime();
    }
    return this.enabled;
  }

  // Soft tactile tick when crossing frames/scroll beats
  public playScrubTick(pitch = 280) {
    if (!this.enabled) return;
    const now = performance.now();
    if (now - this.lastSoundTime < 60) return; // throttle ticks
    this.lastSoundTime = now;

    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Gentle organic tone when completing an action (e.g. adding to bag)
  public playChime() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.23);
    } catch {
      // Audio autoplay policy fallback
    }
  }
}

export const tactileAudio = new TactileAudio();
