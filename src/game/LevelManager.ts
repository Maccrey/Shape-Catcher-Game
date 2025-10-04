import { LevelConfig } from '../types/level.types';
import { getLevelConfig, getMaxLevel, isEndlessMode, generateEndlessLevelConfig } from '../config/levelConfig';
import { Grade } from '../types/game.types';

export class LevelManager {
  private currentLevel: number = 1;
  private currentConfig: LevelConfig;

  constructor(startLevel: number = 1) {
    this.currentLevel = startLevel;
    this.currentConfig = this.loadLevelConfig();
  }

  public getCurrentLevel(): number {
    return this.currentLevel;
  }

  public getCurrentLevelConfig(): LevelConfig {
    return { ...this.currentConfig };
  }

  public nextLevel(): boolean {
    this.currentLevel++;
    this.currentConfig = this.loadLevelConfig();
    return true;
  }

  public setLevel(level: number): void {
    this.currentLevel = Math.max(1, level);
    this.currentConfig = this.loadLevelConfig();
  }

  public isEndlessMode(): boolean {
    return isEndlessMode(this.currentLevel);
  }

  public getMaxClassicLevel(): number {
    return getMaxLevel();
  }

  private loadLevelConfig(): LevelConfig {
    if (this.isEndlessMode()) {
      return generateEndlessLevelConfig(this.currentLevel);
    }
    return getLevelConfig(this.currentLevel);
  }

  public checkLevelComplete(catchCount: number): boolean {
    return catchCount >= this.currentConfig.targetCatches;
  }

  public calculateGrade(
    score: number,
    catchCount: number,
    maxCombo: number,
    timeElapsed: number,
    livesRemaining: number
  ): Grade {
    const targetCatches = this.currentConfig.targetCatches;
    const perfectScore = targetCatches * 10; // Base score assumption

    // Scoring factors
    const scoreRatio = score / perfectScore;
    const comboBonus = maxCombo >= 10 ? 0.2 : maxCombo >= 5 ? 0.1 : 0;
    const speedBonus = timeElapsed < 60 ? 0.2 : timeElapsed < 90 ? 0.1 : 0;
    const livesBonus = livesRemaining * 0.1;
    const completionRatio = catchCount / targetCatches;

    const totalScore = (scoreRatio + comboBonus + speedBonus + livesBonus) * completionRatio;

    if (totalScore >= 1.8) return Grade.MASTER;
    if (totalScore >= 1.5) return Grade.DIAMOND;
    if (totalScore >= 1.2) return Grade.GOLD;
    if (totalScore >= 0.8) return Grade.SILVER;
    return Grade.BRONZE;
  }

  public getGradeRewards(grade: Grade): {
    bonusScore: number;
    powerUps: string[];
  } {
    const rewards = {
      [Grade.BRONZE]: { bonusScore: 50, powerUps: [] },
      [Grade.SILVER]: { bonusScore: 100, powerUps: ['slowtime'] },
      [Grade.GOLD]: { bonusScore: 200, powerUps: ['slowtime', 'doublescore'] },
      [Grade.DIAMOND]: { bonusScore: 500, powerUps: ['slowtime', 'doublescore', 'shield'] },
      [Grade.MASTER]: { bonusScore: 1000, powerUps: ['slowtime', 'doublescore', 'shield', 'starshower'] }
    };

    return rewards[grade];
  }

  public getThemeStyle(): string {
    return this.currentConfig.theme.background;
  }

  public getParticleColor(): string {
    return this.currentConfig.theme.particleColor;
  }

  public getBGMTrack(): string {
    return this.currentConfig.theme.music;
  }

  public getAnimationType(): string {
    return this.currentConfig.theme.bgAnimation;
  }

  public getSpawnInterval(): number {
    return this.currentConfig.spawnInterval;
  }

  public getFallSpeed(): number {
    return this.currentConfig.fallSpeed;
  }

  public getSpecialShapeChance(): number {
    return this.currentConfig.specialShapeChance;
  }

  public getBombChance(): number {
    return this.currentConfig.bombChance;
  }

  public getAvailableColorCount(): number {
    return this.currentConfig.colorCount;
  }

  public getAvailableShapeCount(): number {
    return this.currentConfig.shapeTypeCount;
  }

  public getTargetCatches(): number {
    return this.currentConfig.targetCatches;
  }

  public getLevelProgress(catchCount: number): number {
    return Math.min(1.0, catchCount / this.currentConfig.targetCatches);
  }

  public getRemainingCatches(catchCount: number): number {
    return Math.max(0, this.currentConfig.targetCatches - catchCount);
  }

  public getDifficultyDescription(): string {
    if (this.currentLevel <= 5) return 'Beginner';
    if (this.currentLevel <= 10) return 'Intermediate';
    if (this.currentLevel <= 15) return 'Advanced';
    if (this.currentLevel <= 20) return 'Expert';
    return 'Insane';
  }

  public reset(): void {
    this.currentLevel = 1;
    this.currentConfig = this.loadLevelConfig();
  }

  public serialize(): any {
    return {
      currentLevel: this.currentLevel,
      currentConfig: this.currentConfig
    };
  }

  public deserialize(data: any): void {
    this.currentLevel = data.currentLevel || 1;
    this.currentConfig = this.loadLevelConfig();
  }
}