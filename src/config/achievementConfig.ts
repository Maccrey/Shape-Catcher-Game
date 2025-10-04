import { Achievement, AchievementType, AchievementRarity } from '../types/achievement.types';

export const ACHIEVEMENTS: Achievement[] = [
  // Score Achievements
  {
    id: 'score_1000',
    name: 'Getting Started',
    description: 'Reach 1,000 points',
    type: AchievementType.SCORE,
    rarity: AchievementRarity.COMMON,
    icon: '🎯',
    requirement: 1000,
    progress: 0,
    unlocked: false,
    reward: { type: 'score', value: 100 }
  },
  {
    id: 'score_5000',
    name: 'Point Master',
    description: 'Reach 5,000 points',
    type: AchievementType.SCORE,
    rarity: AchievementRarity.RARE,
    icon: '💎',
    requirement: 5000,
    progress: 0,
    unlocked: false,
    reward: { type: 'score', value: 500 }
  },
  {
    id: 'score_10000',
    name: 'High Scorer',
    description: 'Reach 10,000 points',
    type: AchievementType.SCORE,
    rarity: AchievementRarity.EPIC,
    icon: '👑',
    requirement: 10000,
    progress: 0,
    unlocked: false,
    reward: { type: 'score', value: 1000 }
  },

  // Combo Achievements
  {
    id: 'combo_5',
    name: 'Combo Starter',
    description: 'Achieve a 5x combo',
    type: AchievementType.COMBO,
    rarity: AchievementRarity.COMMON,
    icon: '🔥',
    requirement: 5,
    progress: 0,
    unlocked: false
  },
  {
    id: 'combo_10',
    name: 'Combo Expert',
    description: 'Achieve a 10x combo',
    type: AchievementType.COMBO,
    rarity: AchievementRarity.RARE,
    icon: '⚡',
    requirement: 10,
    progress: 0,
    unlocked: false
  },
  {
    id: 'combo_20',
    name: 'Combo Master',
    description: 'Achieve a 20x combo',
    type: AchievementType.COMBO,
    rarity: AchievementRarity.EPIC,
    icon: '💫',
    requirement: 20,
    progress: 0,
    unlocked: false
  },
  {
    id: 'combo_30',
    name: 'Unstoppable',
    description: 'Achieve a 30x combo',
    type: AchievementType.COMBO,
    rarity: AchievementRarity.LEGENDARY,
    icon: '🌟',
    requirement: 30,
    progress: 0,
    unlocked: false,
    reward: { type: 'title', value: 'The Unstoppable' }
  },

  // Level Achievements
  {
    id: 'level_5',
    name: 'Explorer',
    description: 'Complete level 5',
    type: AchievementType.LEVEL,
    rarity: AchievementRarity.COMMON,
    icon: '🗺️',
    requirement: 5,
    progress: 0,
    unlocked: false
  },
  {
    id: 'level_10',
    name: 'Adventurer',
    description: 'Complete level 10',
    type: AchievementType.LEVEL,
    rarity: AchievementRarity.RARE,
    icon: '⛰️',
    requirement: 10,
    progress: 0,
    unlocked: false
  },
  {
    id: 'level_20',
    name: 'Champion',
    description: 'Complete all 20 levels',
    type: AchievementType.LEVEL,
    rarity: AchievementRarity.LEGENDARY,
    icon: '🏆',
    requirement: 20,
    progress: 0,
    unlocked: false,
    reward: { type: 'title', value: 'Champion' }
  },

  // Special Achievements
  {
    id: 'golden_star_10',
    name: 'Star Collector',
    description: 'Catch 10 golden stars',
    type: AchievementType.SPECIAL,
    rarity: AchievementRarity.RARE,
    icon: '⭐',
    requirement: 10,
    progress: 0,
    unlocked: false
  },
  {
    id: 'diamond_20',
    name: 'Diamond Hunter',
    description: 'Catch 20 diamonds',
    type: AchievementType.SPECIAL,
    rarity: AchievementRarity.RARE,
    icon: '💎',
    requirement: 20,
    progress: 0,
    unlocked: false
  },
  {
    id: 'no_bomb',
    name: 'Bomb Dodger',
    description: 'Complete a level without hitting any bombs',
    type: AchievementType.SPECIAL,
    rarity: AchievementRarity.EPIC,
    icon: '🛡️',
    requirement: 1,
    progress: 0,
    unlocked: false
  },

  // Perfect Achievements
  {
    id: 'perfect_level',
    name: 'Perfectionist',
    description: 'Complete a level with 100% accuracy',
    type: AchievementType.PERFECT,
    rarity: AchievementRarity.EPIC,
    icon: '✨',
    requirement: 1,
    progress: 0,
    unlocked: false
  },
  {
    id: 'perfect_3_levels',
    name: 'Flawless',
    description: 'Complete 3 levels with 100% accuracy',
    type: AchievementType.PERFECT,
    rarity: AchievementRarity.LEGENDARY,
    icon: '🌟',
    requirement: 3,
    progress: 0,
    unlocked: false,
    reward: { type: 'title', value: 'The Flawless' }
  },

  // Streak Achievements
  {
    id: 'streak_50',
    name: 'On Fire',
    description: 'Catch 50 shapes in a row',
    type: AchievementType.STREAK,
    rarity: AchievementRarity.RARE,
    icon: '🔥',
    requirement: 50,
    progress: 0,
    unlocked: false
  },
  {
    id: 'streak_100',
    name: 'Legendary Streak',
    description: 'Catch 100 shapes in a row',
    type: AchievementType.STREAK,
    rarity: AchievementRarity.LEGENDARY,
    icon: '🏅',
    requirement: 100,
    progress: 0,
    unlocked: false,
    reward: { type: 'powerup', value: 'shield' }
  }
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

export function getAchievementsByType(type: AchievementType): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.type === type);
}

export function getAchievementsByRarity(rarity: AchievementRarity): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.rarity === rarity);
}
