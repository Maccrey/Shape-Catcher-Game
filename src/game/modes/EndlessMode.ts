export interface EndlessModeState {
  score: number;
  level: number;
  shapesSpawned: number;
  fallSpeedMultiplier: number;
  spawnIntervalMultiplier: number;
  specialShapeChance: number;
}

export class EndlessMode {
  private state: EndlessModeState;
  private baseFallSpeed: number = 1.5;
  private baseSpawnInterval: number = 2000;

  constructor() {
    this.state = {
      score: 0,
      level: 1,
      shapesSpawned: 0,
      fallSpeedMultiplier: 1.0,
      spawnIntervalMultiplier: 1.0,
      specialShapeChance: 0.1
    };
  }

  public update(score: number, shapesSpawned: number): void {
    this.state.score = score;
    this.state.shapesSpawned = shapesSpawned;

    // Calculate level based on shapes spawned
    const newLevel = Math.floor(shapesSpawned / 50) + 1;

    if (newLevel > this.state.level) {
      this.state.level = newLevel;
      this.onLevelUp();
    }
  }

  private onLevelUp(): void {
    // Increase difficulty
    this.state.fallSpeedMultiplier = 1.0 + (this.state.level - 1) * 0.05;
    this.state.spawnIntervalMultiplier = Math.max(0.5, 1.0 - (this.state.level - 1) * 0.03);
    this.state.specialShapeChance = Math.min(0.3, 0.1 + (this.state.level - 1) * 0.01);
  }

  public getFallSpeed(): number {
    return this.baseFallSpeed * this.state.fallSpeedMultiplier;
  }

  public getSpawnInterval(): number {
    return this.baseSpawnInterval * this.state.spawnIntervalMultiplier;
  }

  public getSpecialShapeChance(): number {
    return this.state.specialShapeChance;
  }

  public getLevel(): number {
    return this.state.level;
  }

  public getState(): EndlessModeState {
    return { ...this.state };
  }

  public reset(): void {
    this.state = {
      score: 0,
      level: 1,
      shapesSpawned: 0,
      fallSpeedMultiplier: 1.0,
      spawnIntervalMultiplier: 1.0,
      specialShapeChance: 0.1
    };
  }

  // Difficulty curve adjustments
  public getDifficultyLevel(): 'easy' | 'medium' | 'hard' | 'extreme' {
    if (this.state.level < 5) return 'easy';
    if (this.state.level < 10) return 'medium';
    if (this.state.level < 20) return 'hard';
    return 'extreme';
  }

  public shouldIncreaseColors(): boolean {
    // Add more colors every 5 levels
    return this.state.level % 5 === 0;
  }

  public shouldIncreaseShapes(): boolean {
    // Add more shapes every 7 levels
    return this.state.level % 7 === 0;
  }

  public getAvailableColorCount(): number {
    return Math.min(6, 2 + Math.floor(this.state.level / 5));
  }

  public getAvailableShapeCount(): number {
    return Math.min(4, 2 + Math.floor(this.state.level / 7));
  }
}
