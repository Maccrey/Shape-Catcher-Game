import { Shape } from './entities/Shape';
import { SpecialShapeType } from '../types/shape.types';

export interface ScoreResult {
  baseScore: number;
  multiplier: number;
  totalScore: number;
  reason: string;
}

export class ScoreCalculator {
  private baseScore: number = 10;
  private levelMultiplier: number = 1.0;
  private comboMultiplier: number = 1.0;
  private powerUpMultiplier: number = 1.0;

  constructor(baseScore: number = 10) {
    this.baseScore = baseScore;
  }

  public calculateScore(
    shape: Shape,
    level: number,
    combo: number = 0,
    isPerfectMatch: boolean = true
  ): ScoreResult {
    let baseScore = this.baseScore;
    let multiplier = 1.0;
    let reason = 'Normal catch';

    // Apply level multiplier (increases with level)
    this.levelMultiplier = 1 + (level - 1) * 0.1;
    multiplier *= this.levelMultiplier;

    // Apply combo multiplier
    if (combo > 0) {
      this.comboMultiplier = 1 + combo * 0.1;
      multiplier *= this.comboMultiplier;
      reason = `${combo} Combo!`;
    }

    // Check for special shapes
    if (shape.isSpecialShape()) {
      const specialType = shape.getSpecialType();

      switch (specialType) {
        case SpecialShapeType.DIAMOND:
          multiplier *= 2.0;
          reason = 'Diamond catch! 2x';
          break;

        case SpecialShapeType.RAINBOW:
          multiplier *= 1.5;
          reason = 'Rainbow catch! 1.5x';
          break;

        case SpecialShapeType.GOLDEN_STAR:
          multiplier *= 3.0;
          reason = 'Golden Star! 3x';
          break;

        case SpecialShapeType.TIME_BONUS:
          baseScore = 5;
          reason = 'Time Bonus!';
          break;

        case SpecialShapeType.MULTIPLIER:
          baseScore = 5;
          reason = 'Multiplier Bonus!';
          break;

        case SpecialShapeType.BOMB:
          // Bombs should not give positive score
          baseScore = 0;
          multiplier = 0;
          reason = 'Bomb penalty!';
          break;
      }
    }

    // Apply power-up multiplier (if active)
    multiplier *= this.powerUpMultiplier;

    // Perfect match bonus
    if (isPerfectMatch && !shape.isSpecialShape()) {
      multiplier *= 1.2;
    }

    const totalScore = Math.floor(baseScore * multiplier);

    return {
      baseScore,
      multiplier,
      totalScore,
      reason
    };
  }

  public setPowerUpMultiplier(multiplier: number): void {
    this.powerUpMultiplier = multiplier;
  }

  public resetPowerUpMultiplier(): void {
    this.powerUpMultiplier = 1.0;
  }

  public getComboBonus(combo: number): number {
    if (combo >= 20) return 200;
    if (combo >= 15) return 150;
    if (combo >= 10) return 100;
    if (combo >= 5) return 50;
    if (combo >= 3) return 20;
    return 0;
  }

  public calculateLevelClearBonus(
    level: number,
    timeTaken: number,
    perfectCatches: number,
    totalCatches: number
  ): number {
    let bonus = 0;

    // Base level clear bonus
    bonus += level * 50;

    // Time bonus (faster is better)
    const expectedTime = 120; // 2 minutes expected per level
    if (timeTaken < expectedTime) {
      const timeBonus = Math.floor((expectedTime - timeTaken) * 2);
      bonus += timeBonus;
    }

    // Perfect accuracy bonus
    const accuracy = perfectCatches / totalCatches;
    if (accuracy === 1.0) {
      bonus += 500; // Perfect level
    } else if (accuracy >= 0.9) {
      bonus += 200;
    } else if (accuracy >= 0.75) {
      bonus += 100;
    }

    return bonus;
  }

  public calculateMissedShapePenalty(shape: Shape): number {
    // Different penalty based on shape type
    if (shape.isSpecialShape()) {
      const specialType = shape.getSpecialType();
      switch (specialType) {
        case SpecialShapeType.GOLDEN_STAR:
          return -30;
        case SpecialShapeType.DIAMOND:
          return -20;
        case SpecialShapeType.RAINBOW:
          return -15;
        default:
          return -5;
      }
    }

    return -5; // Regular shape penalty
  }

  public reset(): void {
    this.levelMultiplier = 1.0;
    this.comboMultiplier = 1.0;
    this.powerUpMultiplier = 1.0;
  }
}
