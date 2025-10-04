import { Skin, SkinId, SkinRarity } from '../types/skin.types';
import { ShapeType } from '../types/shape.types';

// Classic Skin - Default skin with simple solid colors
const classicSkin: Skin = {
  id: SkinId.CLASSIC,
  name: 'Classic',
  description: 'The original catcher design',
  rarity: SkinRarity.COMMON,
  unlockCondition: {
    type: 'default',
    description: 'Available from start'
  },
  isUnlocked: true,
  renderFunction: (ctx, x, y, width, height, shapeType, color) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    // Draw platform
    ctx.fillRect(x, y + height - 10, width, 10);
    ctx.strokeRect(x, y + height - 10, width, 10);

    // Draw shape on platform
    const shapeSize = height - 15;
    const shapeX = x + width / 2;
    const shapeY = y + shapeSize / 2;

    ctx.save();
    ctx.translate(shapeX, shapeY);
    drawShape(ctx, shapeType, shapeSize, color);
    ctx.restore();
  }
};

// Neon Skin - Glowing neon effect
const neonSkin: Skin = {
  id: SkinId.NEON,
  name: 'Neon',
  description: 'Glowing neon lights',
  rarity: SkinRarity.RARE,
  unlockCondition: {
    type: 'score',
    requirement: 10000,
    description: 'Reach 10,000 score'
  },
  isUnlocked: false,
  renderFunction: (ctx, x, y, width, height, shapeType, color) => {
    // Neon glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;

    // Draw glowing platform
    ctx.beginPath();
    ctx.moveTo(x, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.stroke();

    // Draw glowing shape
    const shapeSize = height - 10;
    const shapeX = x + width / 2;
    const shapeY = y + shapeSize / 2;

    ctx.save();
    ctx.translate(shapeX, shapeY);
    ctx.fillStyle = 'transparent';
    drawShape(ctx, shapeType, shapeSize, color);
    ctx.restore();

    ctx.shadowBlur = 0;
  }
};

// Wooden Skin - Rustic wooden texture
const woodenSkin: Skin = {
  id: SkinId.WOODEN,
  name: 'Wooden',
  description: 'Handcrafted wooden catcher',
  rarity: SkinRarity.RARE,
  unlockCondition: {
    type: 'level',
    requirement: 10,
    description: 'Reach level 10'
  },
  isUnlocked: false,
  renderFunction: (ctx, x, y, width, height, shapeType, color) => {
    // Wooden texture pattern
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, '#8B4513');
    gradient.addColorStop(0.5, '#A0522D');
    gradient.addColorStop(1, '#8B4513');

    // Draw wooden platform
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y + height - 12, width, 12);

    // Draw wood grain lines
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y + height - 10 + i * 3);
      ctx.lineTo(x + width, y + height - 10 + i * 3);
      ctx.stroke();
    }

    // Draw shape with wooden style
    const shapeSize = height - 15;
    const shapeX = x + width / 2;
    const shapeY = y + shapeSize / 2;

    ctx.save();
    ctx.translate(shapeX, shapeY);
    ctx.fillStyle = color;
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 3;
    drawShape(ctx, shapeType, shapeSize, color);
    ctx.restore();
  }
};

// Metal Skin - Shiny metallic effect
const metalSkin: Skin = {
  id: SkinId.METAL,
  name: 'Metal',
  description: 'Polished metal finish',
  rarity: SkinRarity.EPIC,
  unlockCondition: {
    type: 'combo',
    requirement: 20,
    description: 'Achieve 20x combo'
  },
  isUnlocked: false,
  renderFunction: (ctx, x, y, width, height, shapeType, color) => {
    // Metallic gradient
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, '#C0C0C0');
    gradient.addColorStop(0.5, '#E8E8E8');
    gradient.addColorStop(1, '#A0A0A0');

    // Draw metal platform with shine
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y + height - 10, width, 10);

    // Add metallic shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(x + 5, y + height - 8, width - 10, 3);

    // Draw shape with metallic effect
    const shapeSize = height - 15;
    const shapeX = x + width / 2;
    const shapeY = y + shapeSize / 2;

    ctx.save();
    ctx.translate(shapeX, shapeY);

    const shapeGradient = ctx.createRadialGradient(0, -10, 0, 0, 0, shapeSize);
    shapeGradient.addColorStop(0, lightenColor(color, 40));
    shapeGradient.addColorStop(0.7, color);
    shapeGradient.addColorStop(1, darkenColor(color, 30));

    ctx.fillStyle = shapeGradient;
    drawShape(ctx, shapeType, shapeSize, shapeGradient);
    ctx.restore();
  }
};

// Rainbow Skin - Animated rainbow colors
const rainbowSkin: Skin = {
  id: SkinId.RAINBOW,
  name: 'Rainbow',
  description: 'Vibrant rainbow colors',
  rarity: SkinRarity.LEGENDARY,
  unlockCondition: {
    type: 'achievement',
    requirement: 'master_achiever',
    description: 'Unlock all achievements'
  },
  isUnlocked: false,
  renderFunction: (ctx, x, y, width, height, shapeType, color) => {
    const time = Date.now() / 1000;

    // Create rainbow gradient
    const gradient = ctx.createLinearGradient(x, y, x + width, y);
    const hue1 = (time * 50) % 360;
    const hue2 = (hue1 + 60) % 360;
    const hue3 = (hue1 + 120) % 360;

    gradient.addColorStop(0, `hsl(${hue1}, 100%, 50%)`);
    gradient.addColorStop(0.5, `hsl(${hue2}, 100%, 50%)`);
    gradient.addColorStop(1, `hsl(${hue3}, 100%, 50%)`);

    // Draw rainbow platform
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y + height - 10, width, 10);

    // Add sparkle effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = `hsl(${hue1}, 100%, 70%)`;

    // Draw shape with rainbow effect
    const shapeSize = height - 15;
    const shapeX = x + width / 2;
    const shapeY = y + shapeSize / 2;

    ctx.save();
    ctx.translate(shapeX, shapeY);
    ctx.fillStyle = gradient;
    drawShape(ctx, shapeType, shapeSize, gradient);
    ctx.restore();

    ctx.shadowBlur = 0;
  }
};

// Helper function to draw shapes
function drawShape(
  ctx: CanvasRenderingContext2D,
  shapeType: ShapeType,
  size: number,
  color: string | CanvasGradient
) {
  ctx.fillStyle = color;

  switch (shapeType) {
    case ShapeType.CIRCLE:
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
      if (ctx.strokeStyle) ctx.stroke();
      break;

    case ShapeType.SQUARE:
      ctx.fillRect(-size / 2, -size / 2, size, size);
      if (ctx.strokeStyle) ctx.strokeRect(-size / 2, -size / 2, size, size);
      break;

    case ShapeType.TRIANGLE:
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.lineTo(-size / 2, size / 2);
      ctx.closePath();
      ctx.fill();
      if (ctx.strokeStyle) ctx.stroke();
      break;

    case ShapeType.STAR:
      const spikes = 5;
      const outerRadius = size / 2;
      const innerRadius = size / 4;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(0, -outerRadius);

      for (let i = 0; i < spikes; i++) {
        let x = Math.cos(rot) * outerRadius;
        let y = Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }

      ctx.lineTo(0, -outerRadius);
      ctx.closePath();
      ctx.fill();
      if (ctx.strokeStyle) ctx.stroke();
      break;
  }
}

// Color utility functions
function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

function darkenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

// Export all skins
export const SKINS: Skin[] = [
  classicSkin,
  neonSkin,
  woodenSkin,
  metalSkin,
  rainbowSkin
];

export const DEFAULT_SKIN = SkinId.CLASSIC;

// Get skin by ID
export function getSkinById(id: SkinId): Skin | undefined {
  return SKINS.find(skin => skin.id === id);
}

// Get all unlocked skins
export function getUnlockedSkins(unlockedIds: SkinId[]): Skin[] {
  return SKINS.filter(skin => unlockedIds.includes(skin.id));
}
