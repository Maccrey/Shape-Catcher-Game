import { Theme, ThemeId, ThemeCategory, ThemeRenderContext } from '../types/theme.types';

// Ocean Theme - Levels 1-3
export const oceanTheme: Theme = {
  id: ThemeId.OCEAN,
  name: 'Ocean Depths',
  description: 'Deep blue waters with gentle waves',
  category: ThemeCategory.NATURE,
  colors: {
    primary: '#0066cc',
    secondary: '#0099ff',
    accent: '#00ccff',
    gradient: {
      start: '#001a33',
      middle: '#003d66',
      end: '#0066cc'
    }
  },
  animation: {
    type: 'waves',
    speed: 0.5,
    density: 3,
    color: 'rgba(0, 153, 255, 0.3)'
  },
  unlockCondition: {
    type: 'default',
    description: 'Available from start'
  },
  isUnlocked: true
};

// Sunset Theme - Levels 4-7
export const sunsetTheme: Theme = {
  id: ThemeId.SUNSET,
  name: 'Golden Sunset',
  description: 'Warm oranges and pinks of twilight',
  category: ThemeCategory.NATURE,
  colors: {
    primary: '#ff6b35',
    secondary: '#ff8c42',
    accent: '#ffa600',
    gradient: {
      start: '#2d1b2e',
      middle: '#8b3a62',
      end: '#ff6b35'
    }
  },
  animation: {
    type: 'particles',
    speed: 0.3,
    density: 20,
    color: 'rgba(255, 166, 0, 0.5)'
  },
  unlockCondition: {
    type: 'level',
    requirement: 4,
    description: 'Reach level 4'
  },
  isUnlocked: false
};

// Forest Theme - Levels 8-11
export const forestTheme: Theme = {
  id: ThemeId.FOREST,
  name: 'Enchanted Forest',
  description: 'Lush greens of a magical woodland',
  category: ThemeCategory.NATURE,
  colors: {
    primary: '#2d5016',
    secondary: '#4a7c2c',
    accent: '#7bc043',
    gradient: {
      start: '#1a2f0f',
      middle: '#2d5016',
      end: '#4a7c2c'
    }
  },
  animation: {
    type: 'particles',
    speed: 0.2,
    density: 15,
    color: 'rgba(123, 192, 67, 0.4)'
  },
  unlockCondition: {
    type: 'level',
    requirement: 8,
    description: 'Reach level 8'
  },
  isUnlocked: false
};

// Cosmic Theme - Levels 12-15
export const cosmicTheme: Theme = {
  id: ThemeId.COSMIC,
  name: 'Cosmic Space',
  description: 'Infinite starry cosmos',
  category: ThemeCategory.SPACE,
  colors: {
    primary: '#1a0033',
    secondary: '#4d0099',
    accent: '#9933ff',
    gradient: {
      start: '#000000',
      middle: '#1a0033',
      end: '#330066'
    }
  },
  animation: {
    type: 'stars',
    speed: 0.4,
    density: 100,
    color: 'rgba(255, 255, 255, 0.8)'
  },
  unlockCondition: {
    type: 'level',
    requirement: 12,
    description: 'Reach level 12'
  },
  isUnlocked: false
};

// Volcano Theme - Levels 16-18
export const volcanoTheme: Theme = {
  id: ThemeId.VOLCANO,
  name: 'Volcanic Fury',
  description: 'Molten lava and ash',
  category: ThemeCategory.ELEMENTAL,
  colors: {
    primary: '#cc0000',
    secondary: '#ff4400',
    accent: '#ff9900',
    gradient: {
      start: '#1a0000',
      middle: '#660000',
      end: '#cc0000'
    }
  },
  animation: {
    type: 'fire',
    speed: 0.8,
    density: 25,
    color: 'rgba(255, 68, 0, 0.6)'
  },
  unlockCondition: {
    type: 'level',
    requirement: 16,
    description: 'Reach level 16'
  },
  isUnlocked: false
};

// Aurora Theme - Levels 19-20
export const auroraTheme: Theme = {
  id: ThemeId.AURORA,
  name: 'Aurora Borealis',
  description: 'Dancing northern lights',
  category: ThemeCategory.SPACE,
  colors: {
    primary: '#00ff88',
    secondary: '#00ccff',
    accent: '#ff00ff',
    gradient: {
      start: '#001a1a',
      middle: '#003d4d',
      end: '#006666'
    }
  },
  animation: {
    type: 'aurora',
    speed: 0.6,
    density: 5,
    color: 'rgba(0, 255, 136, 0.5)'
  },
  unlockCondition: {
    type: 'level',
    requirement: 19,
    description: 'Reach level 19'
  },
  isUnlocked: false
};

// Export all themes
export const THEMES: Theme[] = [
  oceanTheme,
  sunsetTheme,
  forestTheme,
  cosmicTheme,
  volcanoTheme,
  auroraTheme
];

export const DEFAULT_THEME = ThemeId.OCEAN;

// Get theme by ID
export function getThemeById(id: ThemeId): Theme | undefined {
  return THEMES.find(theme => theme.id === id);
}

// Get theme by level
export function getThemeByLevel(level: number): Theme {
  if (level >= 19) return auroraTheme;
  if (level >= 16) return volcanoTheme;
  if (level >= 12) return cosmicTheme;
  if (level >= 8) return forestTheme;
  if (level >= 4) return sunsetTheme;
  return oceanTheme;
}

// Theme animation renderers
export const themeAnimations = {
  waves: (ctx: ThemeRenderContext) => {
    const { ctx: context, width, height, time } = ctx;

    for (let i = 0; i < 3; i++) {
      context.beginPath();
      context.strokeStyle = `rgba(0, 153, 255, ${0.2 - i * 0.05})`;
      context.lineWidth = 2;

      for (let x = 0; x < width; x += 5) {
        const y = height * 0.3 + Math.sin((x + time * 50 + i * 100) / 50) * 20;
        if (x === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.stroke();
    }
  },

  particles: (ctx: ThemeRenderContext) => {
    const { ctx: context, width, height, time } = ctx;
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const x = ((i * 123 + time * 20) % width);
      const y = ((i * 456 + time * 15) % height);
      const size = 2 + (i % 3);

      context.fillStyle = `rgba(255, 166, 0, ${0.3 + (Math.sin(time * 2 + i) * 0.2)})`;
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    }
  },

  stars: (ctx: ThemeRenderContext) => {
    const { ctx: context, width, height, time } = ctx;
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
      const x = (i * 739 % width);
      const y = (i * 523 % height);
      const twinkle = Math.sin(time * 3 + i) * 0.5 + 0.5;

      context.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
      context.fillRect(x, y, 2, 2);
    }
  },

  aurora: (ctx: ThemeRenderContext) => {
    const { ctx: context, width, height, time } = ctx;

    const gradient = context.createLinearGradient(
      width / 2 + Math.sin(time) * 200,
      0,
      width / 2 - Math.sin(time) * 200,
      height
    );

    const hue1 = (time * 20) % 360;
    const hue2 = (hue1 + 120) % 360;

    gradient.addColorStop(0, `hsla(${hue1}, 70%, 50%, 0.2)`);
    gradient.addColorStop(0.5, `hsla(${hue2}, 70%, 50%, 0.3)`);
    gradient.addColorStop(1, `hsla(${hue1}, 70%, 50%, 0.2)`);

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  },

  fire: (ctx: ThemeRenderContext) => {
    const { ctx: context, width, height, time } = ctx;
    const flameCount = 25;

    for (let i = 0; i < flameCount; i++) {
      const x = (i * width / flameCount) + Math.sin(time * 5 + i) * 10;
      const baseY = height * 0.8;
      const flameHeight = 50 + Math.sin(time * 10 + i * 0.5) * 30;

      const gradient = context.createLinearGradient(x, baseY, x, baseY - flameHeight);
      gradient.addColorStop(0, 'rgba(255, 68, 0, 0.6)');
      gradient.addColorStop(0.5, 'rgba(255, 153, 0, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 68, 0, 0)');

      context.fillStyle = gradient;
      context.fillRect(x - 5, baseY - flameHeight, 10, flameHeight);
    }
  },

  none: () => {
    // No animation
  }
};
