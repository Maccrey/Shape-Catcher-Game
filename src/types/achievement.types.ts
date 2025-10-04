export enum AchievementType {
  SCORE = 'SCORE',
  COMBO = 'COMBO',
  LEVEL = 'LEVEL',
  SPECIAL = 'SPECIAL',
  PERFECT = 'PERFECT',
  STREAK = 'STREAK'
}

export enum AchievementRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  rarity: AchievementRarity;
  icon: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: number;
  reward?: {
    type: 'score' | 'powerup' | 'title';
    value: number | string;
  };
}

export interface AchievementProgress {
  achievementId: string;
  current: number;
  target: number;
  percentage: number;
}
