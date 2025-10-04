import { ShapeType, ShapeColor } from '../types/shape.types';

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

export function drawShape(
  ctx: CanvasRenderingContext2D,
  type: ShapeType,
  x: number,
  y: number,
  size: number,
  color: ShapeColor,
  rotation: number = 0
): void {
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