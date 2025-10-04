// Simple AudioService without Howler.js for now
export class AudioService {
  private static instance: AudioService;
  private context: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private musicVolume: number = 0.7;
  private sfxVolume: number = 0.8;
  private currentBGM: OscillatorNode | null = null;
  private currentBGMGain: GainNode | null = null;
  private isBGMPlaying: boolean = false;

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

  public async playPowerUp(): Promise<void> {
    // Play power-up sound (ascending)
    const notes = [440, 554, 659, 880]; // A4, C#5, E5, A5
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playTone(notes[i], 0.1, 0.1);
      }, i * 40);
    }
  }

  public async playGoldenStar(): Promise<void> {
    // Play special golden star sound
    const notes = [659, 784, 1047, 1319]; // E5, G5, C6, E6
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playTone(notes[i], 0.15, 0.12);
      }, i * 60);
    }
  }

  public async playSpecialCatch(): Promise<void> {
    // Play special catch sound (diamond/rainbow)
    await this.playTone(1047, 0.2, 0.1); // C6
    setTimeout(() => {
      this.playTone(1319, 0.2, 0.1); // E6
    }, 80);
  }

  public async playLevelUp(): Promise<void> {
    // Play level up jingle
    const notes = [523, 659, 784, 1047, 1319]; // C5 to E6
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playTone(notes[i], 0.15, 0.12);
      }, i * 80);
    }
  }

  public async playMenuClick(): Promise<void> {
    await this.playTone(880, 0.05, 0.08);
  }

  public async playMenuHover(): Promise<void> {
    await this.playTone(660, 0.05, 0.06);
  }

  public async playGameStart(): Promise<void> {
    // Play game start fanfare
    const notes = [392, 523, 659, 784]; // G4, C5, E5, G5
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playTone(notes[i], 0.18, 0.1);
      }, i * 90);
    }
  }

  public async playGameOver(): Promise<void> {
    // Play descending game over sound
    const notes = [659, 523, 392, 294]; // E5, C5, G4, D4
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playTone(notes[i], 0.3, 0.1);
      }, i * 150);
    }
  }

  public async playTick(): Promise<void> {
    await this.playTone(1000, 0.05, 0.05);
  }

  public async playWarning(): Promise<void> {
    await this.playTone(300, 0.2, 0.1);
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

  // BGM System
  public async playBGM(level: number): Promise<void> {
    await this.stopBGM();
    await this.initializeContext();
    if (!this.context) return;

    try {
      // Create a simple melody based on level
      const baseFrequencies = [
        [262, 294, 330, 349], // Level 1-5: C, D, E, F
        [294, 330, 392, 440], // Level 6-10: D, E, G, A
        [330, 392, 440, 494], // Level 11-15: E, G, A, B
        [392, 440, 494, 523], // Level 16-20: G, A, B, C
      ];

      const melodyIndex = Math.min(Math.floor((level - 1) / 5), 3);
      const frequencies = baseFrequencies[melodyIndex];

      // Create oscillator for BGM
      const osc = this.context.createOscillator();
      const gainNode = this.context.createGain();

      osc.connect(gainNode);
      gainNode.connect(this.context.destination);

      // Set wave type based on level
      osc.type = level < 10 ? 'sine' : level < 15 ? 'triangle' : 'square';

      // Set volume
      gainNode.gain.setValueAtTime(this.musicVolume * 0.3, this.context.currentTime);

      // Play looping melody
      let noteIndex = 0;
      const changeNote = () => {
        if (this.isBGMPlaying && osc.frequency) {
          osc.frequency.setValueAtTime(
            frequencies[noteIndex % frequencies.length],
            this.context!.currentTime
          );
          noteIndex++;
          setTimeout(changeNote, 500); // Change note every 500ms
        }
      };

      osc.start();
      this.currentBGM = osc;
      this.currentBGMGain = gainNode;
      this.isBGMPlaying = true;
      changeNote();
    } catch (error) {
      console.warn('Failed to play BGM:', error);
    }
  }

  public async stopBGM(): Promise<void> {
    this.isBGMPlaying = false;
    if (this.currentBGM) {
      try {
        this.currentBGM.stop();
      } catch (e) {
        // Already stopped
      }
      this.currentBGM = null;
    }
    if (this.currentBGMGain) {
      this.currentBGMGain.disconnect();
      this.currentBGMGain = null;
    }
  }

  public async fadeBGM(targetVolume: number, duration: number = 1000): Promise<void> {
    if (!this.currentBGMGain || !this.context) return;

    const currentTime = this.context.currentTime;
    this.currentBGMGain.gain.linearRampToValueAtTime(
      targetVolume * this.musicVolume,
      currentTime + duration / 1000
    );
  }

  public isMusicPlaying(): boolean {
    return this.isBGMPlaying;
  }

  public async pauseBGM(): Promise<void> {
    if (this.context?.state === 'running') {
      await this.context.suspend();
    }
  }

  public async resumeBGM(): Promise<void> {
    if (this.context?.state === 'suspended') {
      await this.context.resume();
    }
  }
}