export enum PowerUpType {
  SLOW_TIME = 'SLOW_TIME',
  AUTO_MATCH = 'AUTO_MATCH',
  DOUBLE_SCORE = 'DOUBLE_SCORE',
  SHIELD = 'SHIELD',
  STAR_SHOWER = 'STAR_SHOWER'
}

export interface PowerUp {
  id: string;
  type: PowerUpType;
  name: string;
  description: string;
  icon: string;
  duration: number; // milliseconds, 0 for instant/count-based
  count?: number; // for count-based powerups like AUTO_MATCH
}

export interface PowerUpInventoryItem {
  powerUp: PowerUp;
  quantity: number;
}
