// Procedural Web Audio API Sound Engine
// 100% self-contained: No external audio assets to fail or buffer

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  public init() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return;
    this.ctx = new AudioCtxClass();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!this.ctx && !muted) {
      this.init();
    }

    if (this.ctx && this.ctx.state === 'suspended' && !muted) {
      this.ctx.resume();
    }

    if (!muted) {
      this.startAmbient();
      this.playChirp(600, 900, 0.08, 'sine');
    } else {
      this.stopAmbient();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  private startAmbient() {
    if (!this.ctx || this.isMuted || this.ambientGain) return;

    try {
      const now = this.ctx.currentTime;

      // Sub-bass drone 1 (55Hz - A1)
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sawtooth';
      this.ambientOsc1.frequency.setValueAtTime(55, now);

      // Sub-bass drone 2 slightly detuned (55.4Hz) for gentle cosmic beating
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(55.4, now);

      // Low-pass filter to make it a deep, velvety cosmic rumble
      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(140, now);
      this.ambientFilter.Q.setValueAtTime(2.5, now);

      // LFO for slow breathing atmospheric filter sweep
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.12, now); // sweeps every ~8 seconds
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(40, now);
      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.ambientFilter.frequency);

      // Master ambient gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.08, now + 3);

      this.ambientOsc1.connect(this.ambientFilter);
      this.ambientOsc2.connect(this.ambientFilter);
      this.ambientFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start(now);
      this.ambientOsc2.start(now);
      this.lfo.start(now);
    } catch {
      // Audio autoplay policy handled gracefully
    }
  }

  private stopAmbient() {
    if (!this.ctx || !this.ambientGain) return;
    try {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
      setTimeout(() => {
        try {
          this.ambientOsc1?.stop();
          this.ambientOsc2?.stop();
          this.lfo?.stop();
          this.ambientOsc1?.disconnect();
          this.ambientOsc2?.disconnect();
          this.lfo?.disconnect();
          this.lfoGain?.disconnect();
          this.ambientFilter?.disconnect();
          this.ambientGain?.disconnect();
        } catch {
          // cleanup safe
        }
        this.ambientOsc1 = null;
        this.ambientOsc2 = null;
        this.ambientFilter = null;
        this.ambientGain = null;
        this.lfo = null;
        this.lfoGain = null;
      }, 550);
    } catch {
      // safe
    }
  }

  // Futuristic UI button hover blip
  public playHover() {
    if (this.isMuted) return;
    this.playTone(1200, 0.03, 'sine', 0.02);
  }

  // Futuristic UI click beep
  public playClick() {
    if (this.isMuted) return;
    this.playChirp(800, 1600, 0.06, 'sine', 0.05);
  }

  // Target Lock harmonic sequence
  public playTargetLock() {
    if (this.isMuted) return;
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [
      { freq: 880, delay: 0 },
      { freq: 1174.66, delay: 0.06 },
      { freq: 1760, delay: 0.12 },
    ].forEach(({ freq, delay }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      gain.gain.setValueAtTime(0.04, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.16);
    });
  }

  // Warp hyperdrive jump sound
  public playWarp() {
    if (this.isMuted) return;
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      filter.type = 'lowpass';

      // Pitch swoops from 100Hz up to 900Hz then falls
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.6);
      osc.frequency.exponentialRampToValueAtTime(220, now + 1.4);

      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(4000, now + 0.6);
      filter.frequency.exponentialRampToValueAtTime(400, now + 1.4);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.55);
    } catch {
      // safe
    }
  }

  // Transmission confirmed chime
  public playTransmissionSuccess() {
    if (this.isMuted) return;
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.06, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.36);
    });
  }

  public playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.04) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // safe
    }
  }

  public playChirp(fromFreq: number, toFreq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.04) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(fromFreq, now);
      osc.frequency.exponentialRampToValueAtTime(toFreq, now + duration);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // safe
    }
  }
}

export const sounds = new SoundEngine();
