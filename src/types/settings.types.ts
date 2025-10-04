export interface GameSettings {
  // Audio
  musicVolume: number; // 0-1
  sfxVolume: number; // 0-1
  musicEnabled: boolean;
  sfxEnabled: boolean;

  // Graphics
  particlesEnabled: boolean;
  animationsEnabled: boolean;
  backgroundAnimationsEnabled: boolean;

  // Gameplay
  showNextShape: boolean;
  showTutorial: boolean;
  autoSave: boolean;

  // Accessibility
  colorBlindMode: boolean;
  reduceMotion: boolean;
  highContrast: boolean;

  // Controls
  touchControls: boolean;
  keyboardControls: boolean;

  // Other
  language: string;
}

export const DEFAULT_SETTINGS: GameSettings = {
  musicVolume: 0.7,
  sfxVolume: 0.8,
  musicEnabled: true,
  sfxEnabled: true,
  particlesEnabled: true,
  animationsEnabled: true,
  backgroundAnimationsEnabled: true,
  showNextShape: true,
  showTutorial: true,
  autoSave: true,
  colorBlindMode: false,
  reduceMotion: false,
  highContrast: false,
  touchControls: true,
  keyboardControls: true,
  language: 'en'
};
