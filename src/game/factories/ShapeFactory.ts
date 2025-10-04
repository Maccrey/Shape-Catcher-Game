import { Shape } from '../entities/Shape';
import { ShapeType, ShapeColor, SpecialShapeType } from '../../types/shape.types';
import { CANVAS_WIDTH, SHAPE_SPAWN_MARGIN, SHAPE_SIZE } from '../../config/constants';

export class ShapeFactory {
  private static idCounter: number = 0;

  public static createRandomShape(
    availableShapes: ShapeType[] = Object.values(ShapeType),
    availableColors: ShapeColor[] = Object.values(ShapeColor)
  ): Shape {
    const type = this.getRandomElement(availableShapes);
    const color = this.getRandomElement(availableColors);
    const position = this.getRandomSpawnPosition();

    return new Shape(
      this.generateId(),
      type,
      color,
      position,
      SHAPE_SIZE
    );
  }

  public static createSpecificShape(
    type: ShapeType,
    color: ShapeColor,
    x?: number
  ): Shape {
    const position = {
      x: x ?? this.getRandomSpawnX(),
      y: -SHAPE_SIZE
    };

    return new Shape(
      this.generateId(),
      type,
      color,
      position,
      SHAPE_SIZE
    );
  }

  public static createSpecialShape(
    specialType: SpecialShapeType,
    color: ShapeColor = ShapeColor.YELLOW
  ): Shape {
    const position = this.getRandomSpawnPosition();

    return new Shape(
      this.generateId(),
      specialType,
      color,
      position,
      SHAPE_SIZE
    );
  }

  public static createDiamond(color: ShapeColor): Shape {
    return this.createSpecialShape(SpecialShapeType.DIAMOND, color);
  }

  public static createRainbow(type: ShapeType): Shape {
    return new Shape(
      this.generateId(),
      SpecialShapeType.RAINBOW,
      ShapeColor.RED, // Rainbow color will be handled in rendering
      this.getRandomSpawnPosition(),
      SHAPE_SIZE
    );
  }

  public static createGoldenStar(): Shape {
    return this.createSpecialShape(SpecialShapeType.GOLDEN_STAR, ShapeColor.YELLOW);
  }

  public static createBomb(): Shape {
    return this.createSpecialShape(SpecialShapeType.BOMB, ShapeColor.RED);
  }

  public static createTimeBonus(): Shape {
    return this.createSpecialShape(SpecialShapeType.TIME_BONUS, ShapeColor.BLUE);
  }

  public static createMultiplier(): Shape {
    return this.createSpecialShape(SpecialShapeType.MULTIPLIER, ShapeColor.PURPLE);
  }

  private static generateId(): string {
    return `shape_${++this.idCounter}_${Date.now()}`;
  }

  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static getRandomSpawnPosition(): { x: number; y: number } {
    return {
      x: this.getRandomSpawnX(),
      y: -SHAPE_SIZE
    };
  }

  private static getRandomSpawnX(): number {
    const minX = SHAPE_SPAWN_MARGIN + SHAPE_SIZE / 2;
    const maxX = CANVAS_WIDTH - SHAPE_SPAWN_MARGIN - SHAPE_SIZE / 2;
    return Math.random() * (maxX - minX) + minX;
  }

  public static createShapeSequence(
    shapes: { type: ShapeType; color: ShapeColor }[],
    interval: number = 1000
  ): Shape[] {
    return shapes.map((shapeConfig, index) => {
      const shape = this.createSpecificShape(shapeConfig.type, shapeConfig.color);
      // Offset spawn time for sequence
      shape.position.y = -SHAPE_SIZE - (index * interval / 16.67); // Assuming 60fps
      return shape;
    });
  }

  public static reset(): void {
    this.idCounter = 0;
  }
}