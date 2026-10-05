// Web Audio API Procedural Synthesizer for Authentic Underground Beats & Ambience
// Zero external mp3 dependencies, works completely offline, 100% reliable!

export interface AmbientBeat {
  id: string;
  name: string;
  subgenre: string;
  bpm: number;
  description: string;
}

export const AMBIENT_BEATS: AmbientBeat[] = [
  {
    id: 'subterranean-plugg',
    name: 'Subterranean Plugg',
    subgenre: 'Plugg / Ambient',
    bpm: 130,
    description: 'Ethereal Rhodes maj7 chord inversions, subtle 808 glide, and crisp rimshot bounce.',
  },
  {
    id: 'nightmare-rage-808',
    name: 'Opium Night Drive',
    subgenre: 'Rage / Synth-Punk',
    bpm: 154,
    description: 'Aggressive distorted saw synth arpeggio, overdriven 808 kick, and rapid-fire hi-hats.',
  },
  {
    id: 'abstract-drumless-soul',
    name: 'Dusty Crate Soul Loop',
    subgenre: 'Drumless Abstract',
    bpm: 74,
    description: 'Warm vinyl crackle, nostalgic Rhodes electric piano progressions, tape flutter, no drums.',
  },
  {
    id: 'motor-city-bounce',
    name: 'Detroit 313 Piano Stomp',
    subgenre: 'Michigan Off-Beat',
    bpm: 102,
    description: 'Dark minor-scale piano keys, four-on-the-floor techno punch, and snappy syncopation.',
  },
  {
    id: 'bedroom-3am-cloud',
    name: 'Memphis Tape Ghost',
    subgenre: 'Cloud Rap / Lo-Fi',
    bpm: 120,
    description: 'Deep sub drone, drenched ambient reverb pad, and 90s cassette hiss.',
  },
];

class UndergroundAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackId: string | null = null;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private step: number = 0;
  private onStateChange: ((isPlaying: boolean, trackId: string | null) => void) | null = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.4;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public subscribe(cb: (isPlaying: boolean, trackId: string | null) => void) {
    this.onStateChange = cb;
  }

  public getAnalyserData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(16);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public play(trackId: string) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.isPlaying && this.currentTrackId === trackId) {
      this.stop();
      return;
    }

    this.stop();
    this.isPlaying = true;
    this.currentTrackId = trackId;
    this.step = 0;

    const track = AMBIENT_BEATS.find((t) => t.id === trackId) || AMBIENT_BEATS[0];
    const intervalMs = (60 / track.bpm / 4) * 1000; // 16th notes

    this.timerId = window.setInterval(() => {
      this.tick(track.id);
      this.step = (this.step + 1) % 16;
    }, intervalMs);

    if (this.onStateChange) this.onStateChange(true, this.currentTrackId);
  }

  public stop() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isPlaying = false;
    this.currentTrackId = null;
    if (this.onStateChange) this.onStateChange(false, null);
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentTrackId: this.currentTrackId,
    };
  }

  private tick(trackId: string) {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    switch (trackId) {
      case 'subterranean-plugg':
        this.tickPlugg(t, this.step);
        break;
      case 'nightmare-rage-808':
        this.tickRage(t, this.step);
        break;
      case 'abstract-drumless-soul':
        this.tickSoul(t, this.step);
        break;
      case 'motor-city-bounce':
        this.tickDetroit(t, this.step);
        break;
      case 'bedroom-3am-cloud':
      default:
        this.tickCloud(t, this.step);
        break;
    }
  }

  // --- Track 1: Plugg (Ethereal Rhodes + Soft 808 Glide + Crisp Rimshot) ---
  private tickPlugg(t: number, step: number) {
    if (!this.ctx || !this.masterGain) return;

    // Rhodes Chord trigger on step 0 and step 8
    if (step === 0 || step === 8) {
      const chords = step === 0 ? [349.23, 440, 523.25, 659.25] : [329.63, 392, 493.88, 587.33]; // Fmaj7 -> Em7
      chords.forEach((freq) => {
        this.playRhodesNote(freq, t, 1.4);
      });
    }

    // 808 Kick Glide
    if (step === 0 || step === 6 || step === 10) {
      this.play808(step === 6 ? 48.99 : 43.65, t, 0.45); // G1 -> F1
    }

    // Rimshot on step 4 and 12
    if (step === 4 || step === 12) {
      this.playRimshot(t);
    }

    // Subtle hi-hat
    if (step % 2 === 0) {
      this.playHiHat(t, 0.05, 8000);
    }
  }

  // --- Track 2: Rage (Distorted saw arpeggio + Overclocked 808 + Rapid hats) ---
  private tickRage(t: number, step: number) {
    if (!this.ctx || !this.masterGain) return;

    // Saw Lead Synth Arp
    const arpNotes = [220, 261.63, 329.63, 440, 220, 329.63, 261.63, 392];
    const freq = arpNotes[step % arpNotes.length];
    this.playRageSaw(freq, t, 0.12);

    // Punchy 808
    if (step === 0 || step === 3 || step === 8 || step === 11 || step === 14) {
      this.play808Distorted(45, t, 0.35);
    }

    // Fast hats
    this.playHiHat(t, step % 4 === 2 ? 0.09 : 0.04, 10000);

    // Snare on step 4 and 12
    if (step === 4 || step === 12) {
      this.playSnare(t);
    }
  }

  // --- Track 3: Drumless Soul (Warm electric piano chords, tape flutter) ---
  private tickSoul(t: number, step: number) {
    if (!this.ctx || !this.masterGain) return;

    if (step === 0) {
      // Jazz minor 9 chord
      [174.61, 261.63, 329.63, 392, 493.88].forEach((freq) => {
        this.playRhodesNote(freq, t, 2.2, 0.08);
      });
    } else if (step === 8) {
      // Dominant 7 alt chord
      [164.81, 246.94, 311.13, 392, 440].forEach((freq) => {
        this.playRhodesNote(freq, t, 2.0, 0.07);
      });
    }

    // Vinyl crackle puff
    if (step % 4 === 0) {
      this.playVinylHiss(t);
    }
  }

  // --- Track 4: Detroit Bounce (Stomp piano + Four-on-floor kick + syncopation) ---
  private tickDetroit(t: number, step: number) {
    if (!this.ctx || !this.masterGain) return;

    // Piano stabs
    if (step === 0 || step === 3 || step === 6 || step === 8 || step === 11 || step === 14) {
      [220, 261.63, 329.63].forEach((f) => this.playPianoStab(f, t));
    }

    // Techno/Detroit style punch kick on every 4th step (four-on-the-floor)
    if (step % 4 === 0) {
      this.playPunchKick(t);
    }

    // Snappy Clap on 4 and 12
    if (step === 4 || step === 12) {
      this.playClap(t);
    }

    // Shaker / Hi-hat
    this.playHiHat(t, 0.04, 7000);
  }

  // --- Track 5: Cloud Rap (Memphis drone + washed ambient reverb pad) ---
  private tickCloud(t: number, step: number) {
    if (!this.ctx || !this.masterGain) return;

    if (step === 0) {
      this.playCloudPad(220, t, 3.0);
      this.playCloudPad(329.63, t, 3.0);
    } else if (step === 8) {
      this.playCloudPad(196, t, 3.0);
      this.playCloudPad(293.66, t, 3.0);
    }

    // Deep sub bass on 0 and 10
    if (step === 0 || step === 10) {
      this.play808(38, t, 0.8);
    }

    if (step % 2 === 0) {
      this.playHiHat(t, 0.03, 5000);
    }
  }

  // --- Sound Generators ---

  private playRhodesNote(freq: number, t: number, duration: number, vol = 0.1) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    // Warm Rhodes bell harmonic
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, t);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc2.start(t);
    osc.stop(t + duration);
    osc2.stop(t + duration);
  }

  private play808(startFreq: number, t: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq * 1.5, t);
    osc.frequency.exponentialRampToValueAtTime(startFreq, t + 0.08);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  private play808Distorted(startFreq: number, t: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const shaper = this.ctx.createWaveShaper();

    // Wave distortion curve
    const n = 256;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; ++i) {
      const x = (i * 2) / n - 1;
      curve[i] = ((3 + 20) * x * 20 * (Math.PI / 180)) / (Math.PI + 20 * Math.abs(x));
    }
    shaper.curve = curve;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(startFreq * 2, t);
    osc.frequency.exponentialRampToValueAtTime(startFreq, t + 0.05);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(shaper);
    shaper.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  private playRageSaw(freq: number, t: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, t);
    filter.Q.value = 4;

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  private playCloudPad(freq: number, t: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  private playPianoStab(freq: number, t: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  private playPunchKick(t: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.08);

    gain.gain.setValueAtTime(0.32, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  private playRimshot(t: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.04);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  private playClap(t: number) {
    if (!this.ctx || !this.masterGain) return;
    // White noise burst
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.16, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(t);
  }

  private playSnare(t: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
  }

  private playHiHat(t: number, vol: number, freqCut: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.03;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(freqCut, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
  }

  private playVinylHiss(t: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.015;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3000, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
  }
}

export const audioSynthEngine = new UndergroundAudioEngine();
