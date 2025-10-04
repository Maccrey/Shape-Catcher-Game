import { Shape as IShape, ShapeType, ShapeColor, SpecialShapeType, Position, Velocity } from '../../types/shape.types';
import { CANVAS_HEIGHT, SHAPE_FALL_SPEED_BASE, ROTATION_SPEED } from '../../config/constants';

export class Shape implements IShape {
  public id: string;
  public type: ShapeType | SpecialShapeType;
  public color: ShapeColor;
  public position: Position;
  public velocity: Velocity;
  public size: number;
  public rotation: number;

  constructor(
    id: string,
    type: ShapeType | SpecialShapeType,
    color: ShapeColor,
    position: Position,
    size: number = 40
  ) {
    this.id = id;
    this.type = type;
    this.color = color;
    this.position = { ...position };
    this.velocity = { x: 0, y: SHAPE_FALL_SPEED_BASE };
    this.size = size;
    this.rotation = 0;
  }

  public update(deltaTime: number): void {
    // Update position based on velocity
    this.position.x += this.velocity.x * deltaTime * 60; // 60 for frame-rate independence
    this.position.y += this.velocity.y * deltaTime * 60;

    // Update rotation for visual effect
    this.rotation += ROTATION_SPEED * deltaTime;
    if (this.rotation > Math.PI * 2) {
      this.rotation -= Math.PI * 2;
    }
  }

  public isOffScreen(): boolean {
    return this.position.y > CANVAS_HEIGHT + this.size;
  }

  public setFallSpeed(speed: number): void {
    this.velocity.y = speed;
  }

  public getBounds(): {
    left: number;
    right: number;
    top: number;
    bottom: number;
  } {
    const halfSize = this.size / 2;
    return {
      left: this.position.x - halfSize,
      right: this.position.x + halfSize,
      top: this.position.y - halfSize,
      bottom: this.position.y + halfSize
    };
  }

  public isSpecialShape(): boolean {
    return Object.values(SpecialShapeType).includes(this.type as SpecialShapeType);
  }

  public getSpecialType(): SpecialShapeType | null {
    return this.isSpecialShape() ? this.type as SpecialShapeType : null;
  }

  public clone(): Shape {
    const clone = new Shape(
      this.id + '_clone',
      this.type,
      this.color,
      { ...this.position },
      this.size
    );
    clone.velocity = { ...this.velocity };
    clone.rotation = this.rotation;
    return clone;
  }
}