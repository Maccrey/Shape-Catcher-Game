import { ShapeType, ShapeColor, SpecialShapeType } from '../types/shape.types';

export const SHAPE_COLORS = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  orange: '#f97316'
};

export function drawSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: ShapeColor,
  rotation: number = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.fillStyle = SHAPE_COLORS[color];
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  const halfSize = size / 2;
  ctx.fillRect(-halfSize, -halfSize, size, size);
  ctx.strokeRect(-halfSize, -halfSize, size, size);

  ctx.restore();
}

export function drawTriangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: ShapeColor,
  rotation: number = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.fillStyle = SHAPE_COLORS[color];
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  const height = size * 0.866; // equilateral triangle height

  ctx.beginPath();
  ctx.moveTo(0, -height / 2);
  ctx.lineTo(-size / 2, height / 2);
  ctx.lineTo(size / 2, height / 2);
  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: ShapeColor,
  rotation: number = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  // Rotation doesn't affect circles visually, but kept for consistency

  ctx.fillStyle = SHAPE_COLORS[color];
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  const radius = size / 2;

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: ShapeColor,
  rotation: number = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.fillStyle = SHAPE_COLORS[color];
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  const spikes = 5;
  const outerRadius = size / 2;
  const innerRadius = outerRadius * 0.4;

  ctx.beginPath();

  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i / (spikes * 2)) * Math.PI * 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const pointX = Math.cos(angle - Math.PI / 2) * radius;
    const pointY = Math.sin(angle - Math.PI / 2) * radius;

    if (i === 0) {
      ctx.moveTo(pointX, pointY);
    } else {
      ctx.lineTo(pointX, pointY);
    }
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function drawDiamond(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: ShapeColor,
  rotation: number = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // Diamond gradient
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 2);
  gradient.addColorStop(0, SHAPE_COLORS[color]);
  gradient.addColorStop(0.7, SHAPE_COLORS[color]);
  gradient.addColorStop(1, '#ffffff');

  ctx.fillStyle = gradient;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;

  const halfSize = size / 2;

  // Diamond shape (rotated square)
  ctx.beginPath();
  ctx.moveTo(0, -halfSize);
  ctx.lineTo(halfSize, 0);
  ctx.lineTo(0, halfSize);
  ctx.lineTo(-halfSize, 0);
  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  // Add sparkle effect
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('💎', 0, 4);

  ctx.restore();
}

export function drawRainbow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  baseType: ShapeType,
  rotation: number = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // Create rainbow gradient
  const gradient = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2);
  gradient.addColorStop(0, '#ff0000');
  gradient.addColorStop(0.17, '#ff8c00');
  gradient.addColorStop(0.33, '#ffd700');
  gradient.addColorStop(0.5, '#00ff00');
  gradient.addColorStop(0.67, '#0080ff');
  gradient.addColorStop(0.83, '#8000ff');
  gradient.addColorStop(1, '#ff00ff');

  ctx.fillStyle = gradient;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  // Draw base shape with rainbow colors
  switch (baseType) {
    case ShapeType.SQUARE:
      const halfSize = size / 2;
      ctx.fillRect(-halfSize, -halfSize, size, size);
      ctx.strokeRect(-halfSize, -halfSize, size, size);
      break;
    case ShapeType.TRIANGLE:
      const height = size * 0.866;
      ctx.beginPath();
      ctx.moveTo(0, -height / 2);
      ctx.lineTo(-size / 2, height / 2);
      ctx.lineTo(size / 2, height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case ShapeType.CIRCLE:
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case ShapeType.STAR:
      drawStarPath(ctx, size / 2);
      ctx.fill();
      ctx.stroke();
      break;
  }

  ctx.restore();
}

export function drawGoldenStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // Golden gradient
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 2);
  gradient.addColorStop(0, '#fff700');
  gradient.addColorStop(0.5, '#ffd700');
  gradient.addColorStop(1, '#ffa500');

  ctx.fillStyle = gradient;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;

  drawStarPath(ctx, size / 2);
  ctx.fill();
  ctx.stroke();

  // Add glow effect
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#fff700';
  drawStarPath(ctx, size / 3);
  ctx.fill();

  ctx.restore();
}

export function drawBomb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // Bomb body (circle)
  ctx.fillStyle = '#2d3436';
  ctx.strokeStyle = '#636e72';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Fuse
  ctx.strokeStyle = '#e17055';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-size/4, -size/2);
  ctx.lineTo(-size/3, -size * 0.7);
  ctx.stroke();

  // Spark at fuse tip
  ctx.fillStyle = '#fd79a8';
  ctx.beginPath();
  ctx.arc(-size/3, -size * 0.7, 3, 0, Math.PI * 2);
  ctx.fill();

  // Danger symbol
  ctx.fillStyle = '#e17055';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('💥', 0, 4);

  ctx.restore();
}

export function drawTimeBonus(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // Clock face
  ctx.fillStyle = '#74b9ff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Clock hands
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  // Hour hand
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -size / 4);
  ctx.stroke();

  // Minute hand
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size / 4, 0);
  ctx.stroke();

  // Clock numbers
  ctx.fillStyle = '#ffffff';
  ctx.font = '8px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('12', 0, -size/3);
  ctx.fillText('3', size/3, 3);
  ctx.fillText('6', 0, size/3);
  ctx.fillText('9', -size/3, 3);

  ctx.restore();
}

export function drawMultiplier(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // Multiplier background
  ctx.fillStyle = '#a29bfe';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 2x text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('2×', 0, 4);

  ctx.restore();
}

function drawStarPath(ctx: CanvasRenderingContext2D, outerRadius: number): void {
  const spikes = 5;
  const innerRadius = outerRadius * 0.4;

  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i / (spikes * 2)) * Math.PI * 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const pointX = Math.cos(angle - Math.PI / 2) * radius;
    const pointY = Math.sin(angle - Math.PI / 2) * radius;

    if (i === 0) {
      ctx.moveTo(pointX, pointY);
    } else {
      ctx.lineTo(pointX, pointY);
    }
  }
  ctx.closePath();
}

export function drawShape(
  ctx: CanvasRenderingContext2D,
  type: ShapeType | SpecialShapeType,
  x: number,
  y: number,
  size: number,
  color: ShapeColor,
  rotation: number = 0
): void {
  // Handle special shapes
  switch (type) {
    case SpecialShapeType.DIAMOND:
      drawDiamond(ctx, x, y, size, color, rotation);
      return;
    case SpecialShapeType.RAINBOW:
      drawRainbow(ctx, x, y, size, ShapeType.STAR, rotation); // Default to star for rainbow
      return;
    case SpecialShapeType.GOLDEN_STAR:
      drawGoldenStar(ctx, x, y, size, rotation);
      return;
    case SpecialShapeType.BOMB:
      drawBomb(ctx, x, y, size, rotation);
      return;
    case SpecialShapeType.TIME_BONUS:
      drawTimeBonus(ctx, x, y, size, rotation);
      return;
    case SpecialShapeType.MULTIPLIER:
      drawMultiplier(ctx, x, y, size, rotation);
      return;
  }

  // Handle regular shapes
  switch (type) {
    case ShapeType.SQUARE:
      drawSquare(ctx, x, y, size, color, rotation);
      break;
    case ShapeType.TRIANGLE:
      drawTriangle(ctx, x, y, size, color, rotation);
      break;
    case ShapeType.CIRCLE:
      drawCircle(ctx, x, y, size, color, rotation);
      break;
    case ShapeType.STAR:
      drawStar(ctx, x, y, size, color, rotation);
      break;
  }
}