import { GameMode, DifficultyLevel } from '../../types/game.types';

export interface GameModeConfig {
  mode: GameMode;
  name: string;
  description: string;
  icon: string;
  rules: {
    hasTimeLimit: boolean;
    timeLimit?: number; // milliseconds
    hasLivesLimit: boolean;
    lives?: number;
    hasLevelProgression: boolean;
    maxLevel?: number;
    scoreMultiplier: number;
  };
}

export const GAME_MODE_CONFIGS: Record<GameMode, GameModeConfig> = {
  [GameMode.CLASSIC]: {
    mode: GameMode.CLASSIC,
    name: 'Classic',
    description: '20 levels of increasing difficulty',
    icon: '🎮',
    rules: {
      hasTimeLimit: false,
      hasLivesLimit: true,
      lives: 3,
      hasLevelProgression: true,
      maxLevel: 20,
      scoreMultiplier: 1.0
    }
  },
  [GameMode.TIME_ATTACK]: {
    mode: GameMode.TIME_ATTACK,
    name: 'Time Attack',
    description: 'Score as much as possible in 3 minutes',
    icon: '⏱️',
    rules: {
      hasTimeLimit: true,
      timeLimit: 180000, // 3 minutes
      hasLivesLimit: false,
      hasLevelProgression: false,
      scoreMultiplier: 1.5
    }
  },
  [GameMode.ENDLESS]: {
    mode: GameMode.ENDLESS,
    name: 'Endless',
    description: 'Survive as long as you can',
    icon: '♾️',
    rules: {
      hasTimeLimit: false,
      hasLivesLimit: true,
      lives: 3,
      hasLevelProgression: false,
      scoreMultiplier: 1.2
    }
  },
  [GameMode.DAILY_CHALLENGE]: {
    mode: GameMode.DAILY_CHALLENGE,
    name: 'Daily Challenge',
    description: 'Complete today\'s unique challenge',
    icon: '📅',
    rules: {
      hasTimeLimit: true,
      timeLimit: 120000, // 2 minutes
      hasLivesLimit: true,
      lives: 5,
      hasLevelProgression: false,
      scoreMultiplier: 2.0
    }
  }
};

export class GameModeManager {
  private currentMode: GameMode = GameMode.CLASSIC;
  private difficulty: DifficultyLevel = DifficultyLevel.NORMAL;

  public setMode(mode: GameMode): void {
    this.currentMode = mode;
  }

  public setDifficulty(difficulty: DifficultyLevel): void {
    this.difficulty = difficulty;
  }

  public getMode(): GameMode {
    return this.currentMode;
  }

  public getDifficulty(): DifficultyLevel {
    return this.difficulty;
  }

  public getModeConfig(): GameModeConfig {
    return GAME_MODE_CONFIGS[this.currentMode];
  }

  public getScoreMultiplier(): number {
    const modeMultiplier = this.getModeConfig().rules.scoreMultiplier;
    const difficultyMultiplier = this.getDifficultyMultiplier();
    return modeMultiplier * difficultyMultiplier;
  }

  private getDifficultyMultiplier(): number {
    switch (this.difficulty) {
      case DifficultyLevel.EASY:
        return 0.8;
      case DifficultyLevel.NORMAL:
        return 1.0;
      case DifficultyLevel.HARD:
        return 1.3;
      default:
        return 1.0;
    }
  }

  public getFallSpeedMultiplier(): number {
    switch (this.difficulty) {
      case DifficultyLevel.EASY:
        return 0.7;
      case DifficultyLevel.NORMAL:
        return 1.0;
      case DifficultyLevel.HARD:
        return 1.4;
      default:
        return 1.0;
    }
  }

  public getSpawnIntervalMultiplier(): number {
    switch (this.difficulty) {
      case DifficultyLevel.EASY:
        return 1.3; // Slower spawning
      case DifficultyLevel.NORMAL:
        return 1.0;
      case DifficultyLevel.HARD:
        return 0.7; // Faster spawning
      default:
        return 1.0;
    }
  }

  public isTimeLimitActive(): boolean {
    return this.getModeConfig().rules.hasTimeLimit;
  }

  public getTimeLimit(): number | undefined {
    return this.getModeConfig().rules.timeLimit;
  }

  public getRemainingTime(elapsedTime: number): number {
    const timeLimit = this.getTimeLimit();
    if (!timeLimit) return 0;
    return Math.max(0, timeLimit - elapsedTime);
  }

  public isGameOver(lives: number, elapsedTime: number): boolean {
    const config = this.getModeConfig();

    // Check lives
    if (config.rules.hasLivesLimit && lives <= 0) {
      return true;
    }

    // Check time limit
    if (config.rules.hasTimeLimit && this.getRemainingTime(elapsedTime) <= 0) {
      return true;
    }

    return false;
  }
}
