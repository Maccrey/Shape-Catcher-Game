export interface LevelTheme {
  background: string;
  bgAnimation: string;
  music: string;
  particleColor: string;
}

export interface LevelConfig {
  level: number;
  fallSpeed: number;
  spawnInterval: number;
  colorCount: number;
  shapeTypeCount: number;
  specialShapeChance: number;
  bombChance: number;
  targetCatches: number;
  theme: LevelTheme;
}

export interface LevelProgress {
  currentLevel: number;
  catchCount: number;
  score: number;
  grade: string;
  timeElapsed: number;
}