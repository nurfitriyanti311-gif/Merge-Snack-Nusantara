// Berkas sintesis efek suara dan musik latar prosedural memakai Web Audio API tanpa file audio eksternal.

import { GAME_CONFIG } from '../config';

// Pola melodi pentatonis ceria bernuansa marimba/kolintang (32 langkah, null = jeda)
const MELODY_PATTERN: readonly (number | null)[] = [
  659.25, null, 783.99, 659.25, 880.0, null, 783.99, null,
  587.33, null, 659.25, 783.99, 659.25, null, 587.33, null,
  523.25, null, 659.25, 783.99, 880.0, null, 1046.5, null,
  880.0, 783.99, 659.25, null, 587.33, 659.25, 523.25, null,
];

// Pola bass lembut pengiring pada ketukan utama tiap birama
const BASS_PATTERN: readonly (number | null)[] = [
  130.81, null, null, null, 196.0, null, null, null,
  98.0, null, null, null, 146.83, null, null, null,
  110.0, null, null, null, 164.81, null, null, null,
  87.31, null, null, null, 98.0, null, null, null,
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicMasterGain: GainNode | null = null;
  private muted = false;
  private musicTimer: number | null = null;
  private musicStepIndex = 0;

  private ensureContext(): AudioContext | null {
    if (this.muted) {
      return null;
    }
    if (typeof window === 'undefined') {
      return null;
    }
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      return null;
    }
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (!this.musicMasterGain) {
      this.musicMasterGain = this.ctx.createGain();
      this.musicMasterGain.gain.setValueAtTime(1, this.ctx.currentTime);
      this.musicMasterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) {
      this.stopMusic();
      if (this.ctx && this.musicMasterGain) {
        this.musicMasterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    } else if (this.ctx && this.musicMasterGain) {
      this.musicMasterGain.gain.setValueAtTime(1, this.ctx.currentTime);
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public isMusicPlaying(): boolean {
    return this.musicTimer !== null;
  }

  public unlock(): void {
    this.ensureContext();
  }

  private playMusicNote(freq: number, isBass: boolean): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.musicMasterGain) {
      return;
    }
    if (typeof document !== 'undefined' && document.hidden) {
      return;
    }

    const now = ctx.currentTime + 0.015;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (isBass) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.055, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.45);
      osc.connect(gain);
      gain.connect(this.musicMasterGain);
      osc.start(now);
      osc.stop(now + 0.48);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.28);
      osc.connect(gain);
      gain.connect(this.musicMasterGain);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  private stepMusic = (): void => {
    if (this.muted) {
      this.stopMusic();
      return;
    }
    const idx = this.musicStepIndex % MELODY_PATTERN.length;
    const melodyFreq = MELODY_PATTERN[idx];
    const bassFreq = BASS_PATTERN[idx];

    if (melodyFreq !== null) {
      this.playMusicNote(melodyFreq, false);
    }
    if (bassFreq !== null) {
      this.playMusicNote(bassFreq, true);
    }
    this.musicStepIndex = (idx + 1) % MELODY_PATTERN.length;
  };

  public startMusic(): void {
    if (this.muted || this.musicTimer !== null || typeof window === 'undefined') {
      return;
    }
    const ctx = this.ensureContext();
    if (!ctx) {
      return;
    }
    if (this.musicMasterGain) {
      this.musicMasterGain.gain.setValueAtTime(1, ctx.currentTime);
    }
    this.stepMusic();
    this.musicTimer = window.setInterval(this.stepMusic, GAME_CONFIG.audio.musicStepMs);
  }

  public stopMusic(): void {
    if (this.musicTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    this.musicStepIndex = 0;
  }

  public playDrop(): void {
    const ctx = this.ensureContext();
    if (!ctx) {
      return;
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(125, now + 0.09);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  public playMerge(tier: number): void {
    const ctx = this.ensureContext();
    if (!ctx) {
      return;
    }

    const now = ctx.currentTime;
    const baseFreq = GAME_CONFIG.audio.mergeBaseHz + tier * GAME_CONFIG.audio.mergeStepHz;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, now + 0.11);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playTumpengBonus(): void {
    const ctx = this.ensureContext();
    if (!ctx) {
      return;
    }

    const notes = [523.25, 659.25, 783.99, 1046.5];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const start = now + idx * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.16, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.19);
    });
  }

  public playGameOver(): void {
    const ctx = this.ensureContext();
    if (!ctx) {
      return;
    }

    const notes = [392.0, 329.63, 261.63];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const start = now + idx * 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.24);
    });
  }
}

export const soundEngine = new SoundEngine();
