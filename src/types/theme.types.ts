export enum ThemeId {
  OCEAN = 'ocean',
  SUNSET = 'sunset',
  FOREST = 'forest',
  COSMIC = 'cosmic',
  VOLCANO = 'volcano',
  AURORA = 'aurora'
}

export enum ThemeCategory {
  NATURE = 'nature',
  SPACE = 'space',
  ELEMENTAL = 'elemental'
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  gradient: {
    start: string;
    middle?: string;
    end: string;
  };
}

export interface ThemeAnimation {
  type: 'particles' | 'waves' | 'stars' | 'aurora' | 'fire' | 'none';
  speed: number;
  density: number;
  color: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  category: ThemeCategory;
  colors: ThemeColors;
  animation: ThemeAnimation;
  unlockCondition: {
    type: 'default' | 'level';
    requirement?: number;
    description: string;
  };
  isUnlocked: boolean;
}

export interface ThemeState {
  currentTheme: ThemeId;
  unlockedThemes: ThemeId[];
}

export interface ThemeRenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
  deltaTime: number;
}
