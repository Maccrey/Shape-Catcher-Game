// Simple AudioService without Howler.js for now
export class AudioService {
  private static instance: AudioService;
  private context: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private musicVolume: number = 0.7;
  private sfxVolume: number = 0.8;

  private constructor() {
    // Initialize AudioContext lazily
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  private async initializeContext(): Promise<void> {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  public async playTone(frequency: number, duration: number, volume: number = 0.1): Promise<void> {
    try {
      await this.initializeContext();
      if (!this.context) return;

      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.context.destination);

      oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, this.context.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * this.sfxVolume, this.context.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);

      oscillator.start(this.context.currentTime);
      oscillator.stop(this.context.currentTime + duration);
    } catch (error) {
      console.warn('Failed to play tone:', error);
    }
  }

  // Sound effect methods using simple tones
  public async playSuccess(): Promise<void> {
    await this.playTone(880, 0.15, 0.1); // A5 note
  }

  public async playMiss(): Promise<void> {
    await this.playTone(220, 0.3, 0.15); // A3 note
  }

  public async playCombo(tier: number): Promise<void> {
    const frequencies = [523, 659, 784, 880, 1047, 1319]; // C5 to E6
    const frequency = frequencies[Math.min(tier, frequencies.length - 1)];
    await this.playTone(frequency, 0.2, 0.12);
  }

  public async playExplosion(): Promise<void> {
    // Create noise for explosion effect
    try {
      await this.initializeContext();
      if (!this.context) return;

      const bufferSize = this.context.sampleRate * 0.3; // 0.3 seconds
      const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
      const output = buffer.getChannelData(0);

      // Generate noise
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const source = this.context.createBufferSource();
      const gainNode = this.context.createGain();

      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.context.destination);

      gainNode.gain.setValueAtTime(0.1 * this.sfxVolume, this.context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.3);

      source.start();
    } catch (error) {
      console.warn('Failed to play explosion:', error);
    }
  }

  public async playShapeChange(): Promise<void> {
    await this.playTone(440, 0.1, 0.08); // A4 note
  }

  public async playSpecialShape(): Promise<void> {
    // Play ascending arpeggio for special shapes
    const notes = [523, 659, 784]; // C5, E5, G5
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playTone(notes[i], 0.15, 0.1);
      }, i * 50);
    }
  }

  public async playLevelComplete(): Promise<void> {
    // Play victory fanfare
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playTone(notes[i], 0.2, 0.12);
      }, i * 100);
    }
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  public setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public getSFXVolume(): number {
    return this.sfxVolume;
  }
}