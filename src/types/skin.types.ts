import { ShapeType } from './shape.types';

export enum SkinId {
  CLASSIC = 'classic',
  NEON = 'neon',
  WOODEN = 'wooden',
  METAL = 'metal',
  RAINBOW = 'rainbow'
}

export enum SkinRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export interface Skin {
  id: SkinId;
  name: string;
  description: string;
  rarity: SkinRarity;
  unlockCondition: UnlockCondition;
  isUnlocked: boolean;
  renderFunction: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    shapeType: ShapeType,
    color: string
  ) => void;
}

export interface UnlockCondition {
  type: 'default' | 'score' | 'level' | 'combo' | 'achievement';
  requirement?: number | string;
  description: string;
}

export interface SkinState {
  currentSkin: SkinId;
  unlockedSkins: SkinId[];
}
