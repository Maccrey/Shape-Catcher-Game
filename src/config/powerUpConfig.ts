import { PowerUp, PowerUpType } from '../types/powerup.types';

export const POWERUP_CONFIGS: Record<PowerUpType, PowerUp> = {
  [PowerUpType.SLOW_TIME]: {
    id: 'slow_time',
    type: PowerUpType.SLOW_TIME,
    name: 'Slow Time',
    description: 'Reduces falling speed by 50% for 5 seconds',
    icon: '🐌',
    duration: 5000
  },
  [PowerUpType.AUTO_MATCH]: {
    id: 'auto_match',
    type: PowerUpType.AUTO_MATCH,
    name: 'Auto Match',
    description: 'Automatically matches next 3 shapes',
    icon: '🎯',
    duration: 0,
    count: 3
  },
  [PowerUpType.DOUBLE_SCORE]: {
    id: 'double_score',
    type: PowerUpType.DOUBLE_SCORE,
    name: 'Double Score',
    description: 'All points are doubled for 10 seconds',
    icon: '💰',
    duration: 10000
  },
  [PowerUpType.SHIELD]: {
    id: 'shield',
    type: PowerUpType.SHIELD,
    name: 'Shield',
    description: 'Protects from one mistake or bomb',
    icon: '🛡️',
    duration: 0,
    count: 1
  },
  [PowerUpType.STAR_SHOWER]: {
    id: 'star_shower',
    type: PowerUpType.STAR_SHOWER,
    name: 'Star Shower',
    description: 'All shapes become diamonds for 5 seconds',
    icon: '⭐',
    duration: 5000
  }
};

export function getPowerUpConfig(type: PowerUpType): PowerUp {
  return POWERUP_CONFIGS[type];
}

export function getAllPowerUpConfigs(): PowerUp[] {
  return Object.values(POWERUP_CONFIGS);
}
