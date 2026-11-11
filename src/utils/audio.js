// Web Audio API Synthesizer (Zero MP3 files needed)
export const AudioService = {
  ctx: null,
  enabled: true,
  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  playTone(freq, duration, type = 'sine', gainVal = 0.1) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  },
  playSuccess() {
    this.playTone(523.25, 0.12, 'triangle', 0.12);
    setTimeout(() => this.playTone(659.25, 0.12, 'triangle', 0.14), 100);
    setTimeout(() => this.playTone(783.99, 0.25, 'triangle', 0.15), 200);
  },
  playClick() {
    this.playTone(850, 0.04, 'sine', 0.05);
  },
  playOrder() {
    this.playTone(440, 0.1, 'sine', 0.1);
    setTimeout(() => this.playTone(880, 0.2, 'sine', 0.12), 90);
  },
  playCash() {
    this.playTone(650, 0.08, 'square', 0.08);
    setTimeout(() => this.playTone(950, 0.1, 'triangle', 0.12), 80);
    setTimeout(() => this.playTone(1300, 0.25, 'sine', 0.14), 160);
  }
};

export function formatUZS(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 UZS';
  return Number(amount).toLocaleString('uz-UZ').replace(/,/g, ' ') + ' UZS';
}

