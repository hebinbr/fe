// Web Audio ambient soundscape synthesizer and SpeechSynthesis controller

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private currentAmbientType: string | null = null;
  private ambientGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private isAmbientPlaying = false;
  private ambientVolume = 0.45;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setAmbientVolume(val: number) {
    this.ambientVolume = Math.max(0, Math.min(1, val));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.ambientVolume, this.ctx.currentTime, 0.08);
    }
  }

  public getAmbientVolume() {
    return this.ambientVolume;
  }

  public playChime() {
    try {
      const ctx = this.initContext();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 sacred harmonic
      const now = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 2.0);
      });
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  public stopAmbient() {
    if (!this.ctx) return;
    this.isAmbientPlaying = false;
    this.currentAmbientType = null;

    if (this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
    }

    setTimeout(() => {
      this.activeNodes.forEach(node => {
        if (typeof node === 'number') {
          window.clearInterval(node);
        } else if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          try {
            (node as AudioScheduledSourceNode).stop();
          } catch {
            // Already stopped
          }
        }
      });
      this.activeNodes = [];
    }, 250);
  }

  public playAmbient(type: 'pad' | 'rain' | 'stream' | 'harp' | 'wind') {
    const ctx = this.initContext();
    this.stopAmbient();

    this.currentAmbientType = type;
    this.isAmbientPlaying = true;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(this.ambientVolume, ctx.currentTime + 1.5);
    masterGain.connect(ctx.destination);
    this.ambientGain = masterGain;

    if (type === 'pad') {
      this.startWorshipPad(ctx, masterGain);
    } else if (type === 'rain') {
      this.startRain(ctx, masterGain);
    } else if (type === 'stream') {
      this.startStream(ctx, masterGain);
    } else if (type === 'harp') {
      this.startCelestialHarp(ctx, masterGain);
    } else if (type === 'wind') {
      this.startPeacefulWind(ctx, masterGain);
    }
  }

  private startWorshipPad(ctx: AudioContext, destination: GainNode) {
    // D Maj9 chord: D3, A3, C#4, F#4, E4
    const freqs = [146.83, 220.0, 277.18, 369.99, 329.63];
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, ctx.currentTime);
    filter.Q.setValueAtTime(2, ctx.currentTime);
    filter.connect(destination);

    // Filter LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
    lfoGain.gain.setValueAtTime(280, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.activeNodes.push(lfo);

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() * 0.6 - 0.3), ctx.currentTime);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);

      // Tremolo subtle
      const tremolo = ctx.createOscillator();
      const tremGain = ctx.createGain();
      tremolo.frequency.setValueAtTime(0.2 + idx * 0.05, ctx.currentTime);
      tremGain.gain.setValueAtTime(0.02, ctx.currentTime);
      tremolo.connect(tremGain);
      tremGain.connect(gain.gain);
      tremolo.start();

      osc.connect(gain);
      gain.connect(filter);
      osc.start();

      this.activeNodes.push(osc, tremolo);
    });
  }

  private startRain(ctx: AudioContext, destination: GainNode) {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(destination);
    whiteNoise.start();
    this.activeNodes.push(whiteNoise);

    // Occasional gentle drops
    const dropInterval = window.setInterval(() => {
      if (!this.isAmbientPlaying) return;
      const dropOsc = ctx.createOscillator();
      const dropGain = ctx.createGain();
      const dropFreq = 1600 + Math.random() * 1200;
      dropOsc.frequency.setValueAtTime(dropFreq, ctx.currentTime);
      dropOsc.frequency.exponentialRampToValueAtTime(dropFreq * 0.7, ctx.currentTime + 0.08);

      dropGain.gain.setValueAtTime(0.04, ctx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      dropOsc.connect(dropGain);
      dropGain.connect(destination);
      dropOsc.start();
      dropOsc.stop(ctx.currentTime + 0.09);
    }, 380);

    this.activeNodes.push(dropInterval);
  }

  private startStream(ctx: AudioContext, destination: GainNode) {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(600, ctx.currentTime);
    bandpass.Q.setValueAtTime(3, ctx.currentTime);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.4, ctx.currentTime);
    lfoGain.gain.setValueAtTime(250, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);
    lfo.start();

    noise.connect(bandpass);
    bandpass.connect(destination);
    noise.start();

    this.activeNodes.push(noise, lfo);
  }

  private startCelestialHarp(ctx: AudioContext, destination: GainNode) {
    const scale = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5]; // C major pentatonic
    let noteIndex = 0;

    const interval = window.setInterval(() => {
      if (!this.isAmbientPlaying) return;
      const note = scale[Math.floor(Math.random() * scale.length)];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

      osc.connect(gain);
      gain.connect(destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.9);

      noteIndex++;
      if (noteIndex % 3 === 0) {
        // Sub chord
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(130.81, ctx.currentTime);
        subGain.gain.setValueAtTime(0.06, ctx.currentTime);
        subGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);
        subOsc.connect(subGain);
        subGain.connect(destination);
        subOsc.start();
        subOsc.stop(ctx.currentTime + 3.6);
      }
    }, 1400);

    this.activeNodes.push(interval);
  }

  private startPeacefulWind(ctx: AudioContext, destination: GainNode) {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, ctx.currentTime);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
    lfoGain.gain.setValueAtTime(160, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    noise.connect(filter);
    filter.connect(destination);
    noise.start();

    this.activeNodes.push(noise, lfo);
  }

  public getIsPlaying() {
    return this.isAmbientPlaying;
  }

  public getCurrentType() {
    return this.currentAmbientType;
  }
}

export const soundSynthesizer = new AudioSynthesizer();

// Speech Synthesis Controller
export interface TTSState {
  isSpeaking: boolean;
  isPaused: boolean;
  currentText: string;
  paragraphIndex: number;
  rate: number;
}

class DevotionalTTS {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private paragraphs: string[] = [];
  private currentParagraphIdx = 0;
  private rate = 1.0;
  private isSpeaking = false;
  private isPaused = false;
  private listeners: ((state: TTSState) => void)[] = [];
  private currentTitle = '';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(cb: (state: TTSState) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    const state: TTSState = {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
      currentText: this.currentTitle,
      paragraphIndex: this.currentParagraphIdx,
      rate: this.rate
    };
    this.listeners.forEach(cb => cb(state));
  }

  public setRate(newRate: number) {
    this.rate = newRate;
    if (this.isSpeaking && !this.isPaused) {
      // Re-trigger current paragraph with new speed
      const currentIdx = this.currentParagraphIdx;
      this.speakParagraph(currentIdx);
    } else {
      this.notify();
    }
  }

  public speak(title: string, textOrParagraphs: string | string[]) {
    if (!this.synth) return;
    this.stop();

    this.currentTitle = title;
    if (Array.isArray(textOrParagraphs)) {
      this.paragraphs = textOrParagraphs.filter(p => p && p.trim().length > 0);
    } else {
      this.paragraphs = textOrParagraphs.split('\n\n').filter(p => p && p.trim().length > 0);
    }

    if (this.paragraphs.length === 0) return;

    this.currentParagraphIdx = 0;
    this.isSpeaking = true;
    this.isPaused = false;
    this.speakParagraph(0);
  }

  private speakParagraph(idx: number) {
    if (!this.synth) return;
    this.synth.cancel();

    if (idx >= this.paragraphs.length) {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentParagraphIdx = 0;
      this.notify();
      return;
    }

    this.currentParagraphIdx = idx;
    const text = this.paragraphs[idx];
    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    utterance.lang = 'pt-BR';
    utterance.rate = this.rate;

    // Try finding natural Portuguese voice
    const voices = this.synth.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR')) ||
                    voices.find(v => v.lang.includes('pt'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onend = () => {
      if (this.isSpeaking && !this.isPaused) {
        this.speakParagraph(idx + 1);
      }
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.notify();
    };

    this.synth.speak(utterance);
    this.notify();
  }

  public pause() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.isSpeaking && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notify();
    }
  }

  public togglePlayPause() {
    if (!this.isSpeaking) return;
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentParagraphIdx = 0;
    this.notify();
  }

  public getState(): TTSState {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
      currentText: this.currentTitle,
      paragraphIndex: this.currentParagraphIdx,
      rate: this.rate
    };
  }
}

export const devotionalTTS = new DevotionalTTS();
