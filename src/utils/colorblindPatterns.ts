import { ShapeColor } from '../types/shape.types';

/**
 * Patterns for colorblind mode
 * Each color has a unique pattern to help distinguish shapes
 */

export enum PatternType {
  SOLID = 'solid',
  STRIPES = 'stripes',
  DOTS = 'dots',
  GRID = 'grid',
  DIAGONAL = 'diagonal',
  CHECKERBOARD = 'checkerboard'
}

export interface ColorPattern {
  type: PatternType;
  color: ShapeColor;
  description: string;
}

export const COLOR_PATTERNS: Record<ShapeColor, ColorPattern> = {
  [ShapeColor.RED]: {
    type: PatternType.STRIPES,
    color: ShapeColor.RED,
    description: 'Horizontal stripes'
  },
  [ShapeColor.BLUE]: {
    type: PatternType.DOTS,
    color: ShapeColor.BLUE,
    description: 'Dotted pattern'
  },
  [ShapeColor.GREEN]: {
    type: PatternType.DIAGONAL,
    color: ShapeColor.GREEN,
    description: 'Diagonal lines'
  },
  [ShapeColor.YELLOW]: {
    type: PatternType.GRID,
    color: ShapeColor.YELLOW,
    description: 'Grid pattern'
  },
  [ShapeColor.PURPLE]: {
    type: PatternType.CHECKERBOARD,
    color: ShapeColor.PURPLE,
    description: 'Checkerboard'
  },
  [ShapeColor.ORANGE]: {
    type: PatternType.SOLID,
    color: ShapeColor.ORANGE,
    description: 'Solid with border'
  }
};

/**
 * Draw pattern on canvas for colorblind mode
 */
export class ColorblindPatternRenderer {
  /**
   * Apply pattern to a canvas context
   */
  public static drawPattern(
    ctx: CanvasRenderingContext2D,
    color: ShapeColor,
    baseColor: string,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    const pattern = COLOR_PATTERNS[color];

    // Draw base color first
    ctx.fillStyle = baseColor;
    ctx.fillRect(x, y, width, height);

    // Apply pattern overlay
    ctx.save();
    ctx.translate(x, y);

    switch (pattern.type) {
      case PatternType.STRIPES:
        this.drawStripes(ctx, width, height, baseColor);
        break;

      case PatternType.DOTS:
        this.drawDots(ctx, width, height, baseColor);
        break;

      case PatternType.DIAGONAL:
        this.drawDiagonal(ctx, width, height, baseColor);
        break;

      case PatternType.GRID:
        this.drawGrid(ctx, width, height, baseColor);
        break;

      case PatternType.CHECKERBOARD:
        this.drawCheckerboard(ctx, width, height, baseColor);
        break;

      case PatternType.SOLID:
        this.drawSolidWithBorder(ctx, width, height, baseColor);
        break;
    }

    ctx.restore();
  }

  /**
   * Horizontal stripes pattern
   */
  private static drawStripes(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    baseColor: string
  ): void {
    const stripeHeight = Math.max(3, Math.floor(height / 6));
    const darkerColor = this.darkenColor(baseColor, 30);

    ctx.fillStyle = darkerColor;
    for (let y = 0; y < height; y += stripeHeight * 2) {
      ctx.fillRect(0, y, width, stripeHeight);
    }
  }

  /**
   * Dotted pattern
   */
  private static drawDots(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    baseColor: string
  ): void {
    const dotRadius = Math.max(2, Math.floor(Math.min(width, height) / 12));
    const spacing = dotRadius * 3;
    const darkerColor = this.darkenColor(baseColor, 30);

    ctx.fillStyle = darkerColor;
    for (let y = dotRadius; y < height; y += spacing) {
      for (let x = dotRadius; x < width; x += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /**
   * Diagonal lines pattern
   */
  private static drawDiagonal(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    baseColor: string
  ): void {
    const spacing = Math.max(6, Math.floor(Math.min(width, height) / 8));
    const darkerColor = this.darkenColor(baseColor, 30);

    ctx.strokeStyle = darkerColor;
    ctx.lineWidth = 2;

    // Draw diagonal lines from top-left to bottom-right
    for (let offset = -height; offset < width + height; offset += spacing) {
      ctx.beginPath();
      ctx.moveTo(offset, 0);
      ctx.lineTo(offset + height, height);
      ctx.stroke();
    }
  }

  /**
   * Grid pattern
   */
  private static drawGrid(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    baseColor: string
  ): void {
    const gridSize = Math.max(5, Math.floor(Math.min(width, height) / 6));
    const darkerColor = this.darkenColor(baseColor, 30);

    ctx.strokeStyle = darkerColor;
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  /**
   * Checkerboard pattern
   */
  private static drawCheckerboard(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    baseColor: string
  ): void {
    const squareSize = Math.max(4, Math.floor(Math.min(width, height) / 8));
    const darkerColor = this.darkenColor(baseColor, 30);

    ctx.fillStyle = darkerColor;

    for (let y = 0; y < height; y += squareSize) {
      for (let x = 0; x < width; x += squareSize) {
        const row = Math.floor(y / squareSize);
        const col = Math.floor(x / squareSize);

        if ((row + col) % 2 === 0) {
          ctx.fillRect(x, y, squareSize, squareSize);
        }
      }
    }
  }

  /**
   * Solid with thick border
   */
  private static drawSolidWithBorder(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    baseColor: string
  ): void {
    const borderWidth = Math.max(3, Math.floor(Math.min(width, height) / 15));
    const darkerColor = this.darkenColor(baseColor, 40);

    ctx.strokeStyle = darkerColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
  }

  /**
   * Utility: Darken a color
   */
  private static darkenColor(color: string, percent: number): string {
    // Handle hex colors
    if (color.startsWith('#')) {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.max(0, (num >> 16) - amt);
      const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
      const B = Math.max(0, (num & 0x0000ff) - amt);
      return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    }

    // Handle rgb/rgba colors
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      const amt = Math.round(2.55 * percent);
      const R = Math.max(0, parseInt(rgbMatch[1]) - amt);
      const G = Math.max(0, parseInt(rgbMatch[2]) - amt);
      const B = Math.max(0, parseInt(rgbMatch[3]) - amt);
      return `rgb(${R}, ${G}, ${B})`;
    }

    return color;
  }

  /**
   * Get pattern description for accessibility
   */
  public static getPatternDescription(color: ShapeColor): string {
    return COLOR_PATTERNS[color].description;
  }

  /**
   * Draw pattern legend for UI
   */
  public static drawPatternLegend(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ): void {
    const colors = Object.values(ShapeColor);
    const itemHeight = size + 20;

    colors.forEach((color, index) => {
      const itemY = y + index * itemHeight;
      const pattern = COLOR_PATTERNS[color];

      // Draw pattern sample
      const baseColor = this.getBaseColor(color);
      this.drawPattern(ctx, color, baseColor, x, itemY, size, size);

      // Draw description
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText(`${color}: ${pattern.description}`, x + size + 10, itemY + size / 2);
    });
  }

  /**
   * Get base color for a shape color
   */
  private static getBaseColor(color: ShapeColor): string {
    const colorMap: Record<ShapeColor, string> = {
      [ShapeColor.RED]: '#ef4444',
      [ShapeColor.BLUE]: '#3b82f6',
      [ShapeColor.GREEN]: '#22c55e',
      [ShapeColor.YELLOW]: '#eab308',
      [ShapeColor.PURPLE]: '#a855f7',
      [ShapeColor.ORANGE]: '#f97316'
    };
    return colorMap[color];
  }
}
