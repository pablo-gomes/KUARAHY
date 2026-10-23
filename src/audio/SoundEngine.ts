/**
 * KUARAHY — Retro 16-Bit Arcade Web Audio Synthesizer & Music Engine
 * Generates all SFX and Paraguayan Polca/Guarania chiptune arcade tracks procedurally.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private masterGainNode: GainNode | null = null;

  private isMuted: boolean = false;
  private musicVolume: number = 0.65;
  private sfxVolume: number = 0.85;

  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private bgmStep: number = 0;
  private bgmTempo: number = 138; // BPM for lively 6/8 Polca Paraguaia arcade beat
  private currentTrackType: 'menu' | 'fight' | 'victory' = 'menu';

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  public init() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.connect(this.ctx.destination);

      this.musicGainNode = this.ctx.createGain();
      this.musicGainNode.gain.value = this.musicVolume;
      this.musicGainNode.connect(this.masterGainNode);

      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.value = this.sfxVolume;
      this.sfxGainNode.connect(this.masterGainNode);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(music: number, sfx: number) {
    this.musicVolume = Math.max(0, Math.min(1, music));
    this.sfxVolume = Math.max(0, Math.min(1, sfx));

    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
    if (this.sfxGainNode && this.ctx) {
      this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  // --- SOUND EFFECTS ---

  public playPunch() {
    this.init();
    if (!this.ctx || !this.sfxGainNode) return;
    const t = this.ctx.currentTime;

    // Pitch sweep noise + triangle punch body
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.1);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(t);
    osc.stop(t + 0.1);

    // Crack noise
    this.playNoise(0.06, 0.4, 800);
  }

  public playKick() {
    this.init();
    if (!this.ctx || !this.sfxGainNode) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.16);

    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(t);
    osc.stop(t + 0.16);

    this.playNoise(0.08, 0.5, 600);
  }

  public playHeavy() {
    this.init();
    if (!this.ctx || !this.sfxGainNode) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.28);

    gain.gain.setValueAtTime(0.95, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(t);
    osc.stop(t + 0.28);

    this.playNoise(0.18, 0.8, 450);
  }

  public playBlock() {
    this.init();
    if (!this.ctx || !this.sfxGainNode) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.08);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  public playParry() {
    this.init();
    if (!this.ctx || !this.sfxGainNode) return;
    const t = this.ctx.currentTime;

    // High crystalline double bell chime
    [1046.5, 1567.98, 2093].forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.03);

      gain.gain.setValueAtTime(0.7, t + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.03 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(t + idx * 0.03);
      osc.stop(t + idx * 0.03 + 0.35);
    });
  }

  public playGrab() {
    this.init();
    if (!this.ctx || !this.sfxGainNode) return;
    const t = this.ctx.currentTime;

    // Whoosh up then slam down
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.linearRampToValueAtTime(380, t + 0.1);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.28);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.setValueAtTime(0.9, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(t);
    osc.stop(t + 0.28);

    this.playNoise(0.14, 0.6, 500);
  }

  public playSpecial(type: string = 'special') {
    this.init();
    if (!this.ctx || !this.sfxGainNode) return;
    const t = this.ctx.currentTime;

    if (type === 'water') {
      // Water rush swoosh
      this.playNoise(0.25, 0.6, 1200);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.22);
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(t);
      osc.stop(t + 0.22);
    } else if (type === 'laser' || type === 'electricity') {
      // Electric zap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.linearRampToValueAtTime(110, t + 0.25);
      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(t);
      osc.stop(t + 0.25);
    } else if (type === 'note') {
      // Harp chord glissando
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGainNode) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.04);
        gain.gain.setValueAtTime(0.5, t + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.25);
        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        osc.start(t + idx * 0.04);
        osc.stop(t + idx * 0.04 + 0.25);
      });
    } else {
      // General special power surge
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.linearRampToValueAtTime(660, t + 0.15);
      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(t);
      osc.stop(t + 0.25);
    }
  }

  public playSuper() {
    this.init();
    if (!this.ctx || !this.sfxGainNode) return;
    const t = this.ctx.currentTime;

    // Dramatic arcade super sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.25);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.6);

    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(t);
    osc.stop(t + 0.6);

    this.playNoise(0.4, 0.7, 400);
  }

  public playMenuBeep() {
    this.init();
    if (!this.ctx || !this.sfxGainNode) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.setValueAtTime(880, t + 0.04);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  public playSelectConfirm() {
    this.init();
    if (!this.ctx || !this.sfxGainNode) return;
    const t = this.ctx.currentTime;
    [587.33, 880, 1174.66].forEach((f, i) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, t + i * 0.05);
      gain.gain.setValueAtTime(0.4, t + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.05 + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(t + i * 0.05);
      osc.stop(t + i * 0.05 + 0.12);
    });
  }

  public playRoundCall(text: string) {
    this.init();
    if (!this.ctx || !this.sfxGainNode) return;
    const t = this.ctx.currentTime;

    // Synthesized digitized arcade announcer chords
    let freqs = [330, 440, 660];
    if (text.includes('FIGHT')) {
      freqs = [440, 554, 659, 880];
    } else if (text.includes('K.O') || text.includes('KNOCKOUT')) {
      freqs = [196, 246, 293, 392];
    } else if (text.includes('VICTORY') || text.includes('PERFECT')) {
      freqs = [523, 659, 783, 1046];
    }

    freqs.forEach((f, i) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t + i * 0.04);
      gain.gain.setValueAtTime(0.5, t + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.04 + 0.35);
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.35);
    });
  }

  private playNoise(duration: number, volume: number, filterFreq: number = 1000) {
    if (!this.ctx || !this.sfxGainNode) return;
    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGainNode);

    noise.start(t);
  }

  // --- PROCEDURAL 16-BIT CHIPTUNE BGM ---

  public startBgm(track: 'menu' | 'fight' | 'victory') {
    this.stopBgm();
    this.init();
    this.currentTrackType = track;
    this.isBgmPlaying = true;
    this.bgmStep = 0;

    const intervalMs = track === 'fight' ? 120 : track === 'victory' ? 140 : 160;
    this.bgmTimer = window.setInterval(() => {
      this.tickBgm();
    }, intervalMs);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  private tickBgm() {
    if (!this.ctx || !this.musicGainNode || !this.isBgmPlaying) return;
    const t = this.ctx.currentTime;
    const step = this.bgmStep % 32;

    if (this.currentTrackType === 'fight') {
      // 6/8 Paraguayan Polca Arcade rhythm: Fast triplets and driving bass
      // Bass line (D minor / G / A / D)
      const bassNotes = [
        146.83, 0, 146.83, 220.0, 146.83, 0,
        174.61, 0, 174.61, 261.63, 174.61, 0,
        196.0, 0, 196.0, 293.66, 196.0, 0,
        220.0, 0, 164.81, 220.0, 246.94, 220.0,
      ];
      const bassFreq = bassNotes[step % bassNotes.length];
      if (bassFreq > 0) {
        this.playChipNote(bassFreq, 0.12, 'triangle', 0.45);
      }

      // Snare / Hi-hat arcade beat
      if (step % 4 === 2) {
        this.playNoise(0.04, 0.18, 2500); // snare
      } else if (step % 2 === 0) {
        this.playNoise(0.02, 0.08, 5000); // hihat
      }

      // Lead Harpa/Synth arpeggio melody
      const leadArp = [
        293.66, 349.23, 440.0, 587.33, 523.25, 440.0, 349.23, 293.66,
        349.23, 440.0, 523.25, 698.46, 659.25, 523.25, 440.0, 349.23,
        392.0, 493.88, 587.33, 783.99, 698.46, 587.33, 493.88, 392.0,
        440.0, 554.37, 659.25, 880.0, 783.99, 659.25, 554.37, 440.0,
      ];
      const leadFreq = leadArp[step % leadArp.length];
      this.playChipNote(leadFreq, 0.1, 'square', 0.22);

    } else if (this.currentTrackType === 'menu') {
      // Atmospheric nostalgic arcade title theme
      const chords = [
        [220, 261.63, 329.63], // Am
        [174.61, 220, 261.63], // F
        [261.63, 329.63, 392], // C
        [196, 246.94, 293.66], // G
      ];
      const chordIdx = Math.floor(step / 8) % chords.length;
      if (step % 4 === 0) {
        chords[chordIdx].forEach((freq) => {
          this.playChipNote(freq, 0.35, 'triangle', 0.25);
        });
      }
      if (step % 2 === 0) {
        const harpMelody = [440, 523.25, 659.25, 523.25, 783.99, 659.25, 523.25, 440];
        this.playChipNote(harpMelody[(step / 2) % harpMelody.length], 0.18, 'sine', 0.3);
      }
    } else {
      // Victory Fanfare
      const fanfareNotes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
      const fNote = fanfareNotes[step % fanfareNotes.length];
      this.playChipNote(fNote, 0.18, 'square', 0.35);
    }

    this.bgmStep++;
  }

  private playChipNote(freq: number, duration: number, type: OscillatorType, vol: number) {
    if (!this.ctx || !this.musicGainNode) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.musicGainNode);

    osc.start(t);
    osc.stop(t + duration);
  }
}

export const soundEngine = new SoundEngine();
