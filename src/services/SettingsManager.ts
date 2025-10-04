import { GameSettings, DEFAULT_SETTINGS } from '../types/settings.types';

export class SettingsManager {
  private static instance: SettingsManager;
  private settings: GameSettings;
  private listeners: Map<keyof GameSettings, Set<(value: any) => void>> = new Map();

  private constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.loadSettings();
  }

  public static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  public getSettings(): GameSettings {
    return { ...this.settings };
  }

  public getSetting<K extends keyof GameSettings>(key: K): GameSettings[K] {
    return this.settings[key];
  }

  public setSetting<K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ): void {
    this.settings[key] = value;
    this.notifyListeners(key, value);
    this.saveSettings();
  }

  public updateSettings(updates: Partial<GameSettings>): void {
    Object.entries(updates).forEach(([key, value]) => {
      this.setSetting(key as keyof GameSettings, value);
    });
  }

  public resetSettings(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
    // Notify all listeners
    Object.keys(this.settings).forEach(key => {
      this.notifyListeners(
        key as keyof GameSettings,
        this.settings[key as keyof GameSettings]
      );
    });
  }

  // Event listeners
  public subscribe<K extends keyof GameSettings>(
    key: K,
    callback: (value: GameSettings[K]) => void
  ): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  private notifyListeners<K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ): void {
    this.listeners.get(key)?.forEach(callback => callback(value));
  }

  // Persistence
  private saveSettings(): void {
    try {
      localStorage.setItem('game_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }

  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('game_settings');
      if (saved) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }
  }

  // Convenience methods
  public toggleMusic(): void {
    this.setSetting('musicEnabled', !this.settings.musicEnabled);
  }

  public toggleSFX(): void {
    this.setSetting('sfxEnabled', !this.settings.sfxEnabled);
  }

  public setMusicVolume(volume: number): void {
    this.setSetting('musicVolume', Math.max(0, Math.min(1, volume)));
  }

  public setSFXVolume(volume: number): void {
    this.setSetting('sfxVolume', Math.max(0, Math.min(1, volume)));
  }
}
