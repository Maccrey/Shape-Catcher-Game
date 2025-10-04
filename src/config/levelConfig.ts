import { LevelConfig } from '../types/level.types';

export const LEVEL_CONFIGS: LevelConfig[] = [
  // Levels 1-5: Tutorial/Easy
  {
    level: 1,
    fallSpeed: 1.5,
    spawnInterval: 2500,
    colorCount: 2, // Red, Blue
    shapeTypeCount: 2, // Square, Circle
    specialShapeChance: 0.0,
    bombChance: 0.0,
    targetCatches: 15,
    theme: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgAnimation: 'none',
      music: 'peaceful',
      particleColor: '#667eea'
    }
  },
  {
    level: 2,
    fallSpeed: 1.8,
    spawnInterval: 2200,
    colorCount: 3, // Red, Blue, Green
    shapeTypeCount: 3, // Square, Circle, Triangle
    specialShapeChance: 0.0,
    bombChance: 0.0,
    targetCatches: 18,
    theme: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgAnimation: 'pulse',
      music: 'gentle',
      particleColor: '#f093fb'
    }
  },
  {
    level: 3,
    fallSpeed: 2.0,
    spawnInterval: 2000,
    colorCount: 3,
    shapeTypeCount: 4, // All basic shapes
    specialShapeChance: 0.05, // 5% diamond chance
    bombChance: 0.0,
    targetCatches: 20,
    theme: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgAnimation: 'waves',
      music: 'upbeat',
      particleColor: '#4facfe'
    }
  },
  {
    level: 4,
    fallSpeed: 2.2,
    spawnInterval: 1800,
    colorCount: 4, // Add Yellow
    shapeTypeCount: 4,
    specialShapeChance: 0.08,
    bombChance: 0.02, // 2% bomb chance
    targetCatches: 22,
    theme: {
      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      bgAnimation: 'float',
      music: 'energetic',
      particleColor: '#43e97b'
    }
  },
  {
    level: 5,
    fallSpeed: 2.5,
    spawnInterval: 1600,
    colorCount: 4,
    shapeTypeCount: 4,
    specialShapeChance: 0.10,
    bombChance: 0.03,
    targetCatches: 25,
    theme: {
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      bgAnimation: 'sparkle',
      music: 'cheerful',
      particleColor: '#fa709a'
    }
  },

  // Levels 6-10: Intermediate
  {
    level: 6,
    fallSpeed: 2.8,
    spawnInterval: 1500,
    colorCount: 5, // Add Purple
    shapeTypeCount: 4,
    specialShapeChance: 0.12,
    bombChance: 0.04,
    targetCatches: 25,
    theme: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgAnimation: 'meteor',
      music: 'intense',
      particleColor: '#667eea'
    }
  },
  {
    level: 7,
    fallSpeed: 3.0,
    spawnInterval: 1400,
    colorCount: 5,
    shapeTypeCount: 4,
    specialShapeChance: 0.15,
    bombChance: 0.05,
    targetCatches: 28,
    theme: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgAnimation: 'storm',
      music: 'dramatic',
      particleColor: '#f093fb'
    }
  },
  {
    level: 8,
    fallSpeed: 3.2,
    spawnInterval: 1300,
    colorCount: 6, // Add Orange - All colors
    shapeTypeCount: 4,
    specialShapeChance: 0.18,
    bombChance: 0.06,
    targetCatches: 30,
    theme: {
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      bgAnimation: 'aurora',
      music: 'epic',
      particleColor: '#ff9a9e'
    }
  },
  {
    level: 9,
    fallSpeed: 3.5,
    spawnInterval: 1200,
    colorCount: 6,
    shapeTypeCount: 4,
    specialShapeChance: 0.20,
    bombChance: 0.07,
    targetCatches: 32,
    theme: {
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      bgAnimation: 'lightning',
      music: 'tension',
      particleColor: '#a8edea'
    }
  },
  {
    level: 10,
    fallSpeed: 3.8,
    spawnInterval: 1100,
    colorCount: 6,
    shapeTypeCount: 4,
    specialShapeChance: 0.22,
    bombChance: 0.08,
    targetCatches: 35,
    theme: {
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      bgAnimation: 'volcano',
      music: 'boss',
      particleColor: '#ffecd2'
    }
  },

  // Levels 11-15: Advanced
  {
    level: 11,
    fallSpeed: 4.0,
    spawnInterval: 1000,
    colorCount: 6,
    shapeTypeCount: 4,
    specialShapeChance: 0.25,
    bombChance: 0.10,
    targetCatches: 35,
    theme: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgAnimation: 'chaos',
      music: 'frantic',
      particleColor: '#667eea'
    }
  },
  {
    level: 12,
    fallSpeed: 4.2,
    spawnInterval: 950,
    colorCount: 6,
    shapeTypeCount: 4,
    specialShapeChance: 0.28,
    bombChance: 0.11,
    targetCatches: 38,
    theme: {
      background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      bgAnimation: 'tornado',
      music: 'extreme',
      particleColor: '#74b9ff'
    }
  },
  {
    level: 13,
    fallSpeed: 4.5,
    spawnInterval: 900,
    colorCount: 6,
    shapeTypeCount: 4,
    specialShapeChance: 0.30,
    bombChance: 0.12,
    targetCatches: 40,
    theme: {
      background: 'linear-gradient(135deg, #e17055 0%, #fdcb6e 100%)',
      bgAnimation: 'inferno',
      music: 'hellish',
      particleColor: '#e17055'
    }
  },
  {
    level: 14,
    fallSpeed: 4.8,
    spawnInterval: 850,
    colorCount: 6,
    shapeTypeCount: 4,
    specialShapeChance: 0.32,
    bombChance: 0.13,
    targetCatches: 42,
    theme: {
      background: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
      bgAnimation: 'vortex',
      music: 'nightmare',
      particleColor: '#a29bfe'
    }
  },
  {
    level: 15,
    fallSpeed: 5.0,
    spawnInterval: 800,
    colorCount: 6,
    shapeTypeCount: 4,
    specialShapeChance: 0.35,
    bombChance: 0.15,
    targetCatches: 45,
    theme: {
      background: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
      bgAnimation: 'apocalypse',
      music: 'final_boss',
      particleColor: '#fd79a8'
    }
  },

  // Levels 16-20: Expert/Insane
  {
    level: 16,
    fallSpeed: 5.2,
    spawnInterval: 750,
    colorCount: 6,
    shapeTypeCount: 4,
    specialShapeChance: 0.38,
    bombChance: 0.16,
    targetCatches: 45,
    theme: {
      background: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
      bgAnimation: 'shadow_realm',
      music: 'dark_souls',
      particleColor: '#636e72'
    }
  },
  {
    level: 17,
    fallSpeed: 5.5,
    spawnInterval: 700,
    colorCount: 6,
    shapeTypeCount: 4,
    specialShapeChance: 0.40,
    bombChance: 0.18,
    targetCatches: 48,
    theme: {
      background: 'linear-gradient(135deg, #2d3436 0%, #000000 100%)',
      bgAnimation: 'void',
      music: 'cosmic_horror',
      particleColor: '#2d3436'
    }
  },
  {
    level: 18,
    fallSpeed: 5.8,
    spawnInterval: 650,
    colorCount: 6,
    shapeTypeCount: 4,
    specialShapeChance: 0.42,
    bombChance: 0.20,
    targetCatches: 50,
    theme: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      bgAnimation: 'hell_fire',
      music: 'demon_lord',
      particleColor: '#ff6b6b'
    }
  },
  {
    level: 19,
    fallSpeed: 6.0,
    spawnInterval: 600,
    colorCount: 6,
    shapeTypeCount: 4,
    specialShapeChance: 0.45,
    bombChance: 0.22,
    targetCatches: 52,
    theme: {
      background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
      bgAnimation: 'golden_chaos',
      music: 'god_mode',
      particleColor: '#ffeaa7'
    }
  },
  {
    level: 20,
    fallSpeed: 6.5,
    spawnInterval: 550,
    colorCount: 6,
    shapeTypeCount: 4,
    specialShapeChance: 0.50, // 50% special shapes!
    bombChance: 0.25, // 25% bombs!
    targetCatches: 55,
    theme: {
      background: 'linear-gradient(135deg, #00cec9 0%, #55a3ff 100%)',
      bgAnimation: 'rainbow_explosion',
      music: 'transcendence',
      particleColor: '#00cec9'
    }
  }
];

export function getLevelConfig(level: number): LevelConfig {
  // Clamp level to available configs
  const clampedLevel = Math.max(1, Math.min(level, LEVEL_CONFIGS.length));
  return LEVEL_CONFIGS[clampedLevel - 1];
}

export function getMaxLevel(): number {
  return LEVEL_CONFIGS.length;
}

export function isEndlessMode(level: number): boolean {
  return level > LEVEL_CONFIGS.length;
}

// For endless mode - generates config dynamically
export function generateEndlessLevelConfig(level: number): LevelConfig {
  const baseLevel = LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1];
  const extraLevels = level - LEVEL_CONFIGS.length;

  return {
    ...baseLevel,
    level,
    fallSpeed: Math.min(baseLevel.fallSpeed + (extraLevels * 0.3), 10.0), // Max 10.0 speed
    spawnInterval: Math.max(baseLevel.spawnInterval - (extraLevels * 20), 300), // Min 300ms
    specialShapeChance: Math.min(baseLevel.specialShapeChance + (extraLevels * 0.02), 0.8), // Max 80%
    bombChance: Math.min(baseLevel.bombChance + (extraLevels * 0.01), 0.4), // Max 40%
    targetCatches: baseLevel.targetCatches + Math.floor(extraLevels * 2),
    theme: {
      ...baseLevel.theme,
      background: `linear-gradient(135deg, hsl(${(level * 137.508) % 360}, 70%, 60%) 0%, hsl(${((level + 180) * 137.508) % 360}, 70%, 40%) 100%)`,
      particleColor: `hsl(${(level * 137.508) % 360}, 70%, 60%)`
    }
  };
}