import { ShapeType, ShapeColor, Position } from '../../types/shape.types';
import { CANVAS_WIDTH, CATCHER_HEIGHT, CATCHER_WIDTH, CATCHER_SPEED } from '../../config/constants';

export enum CatcherState {
  NORMAL = 'normal',
  STUNNED = 'stunned',
  INVULNERABLE = 'invulnerable'
}

export class Catcher {
  public position: Position;
  public currentShape: ShapeType;
  public currentColor: ShapeColor;
  public state: CatcherState;
  public size: number;
  public stunTime: number;

  private availableShapes: ShapeType[];
  private availableColors: ShapeColor[];

  constructor() {
    this.position = {
      x: CANVAS_WIDTH / 2,
      y: 550
    };

    this.currentShape = ShapeType.SQUARE;
    this.currentColor = ShapeColor.RED;
    this.state = CatcherState.NORMAL;
    this.size = CATCHER_WIDTH;
    this.stunTime = 0;

    this.availableShapes = [
      ShapeType.SQUARE,
      ShapeType.TRIANGLE,
      ShapeType.CIRCLE,
      ShapeType.STAR
    ];

    this.availableColors = [
      ShapeColor.RED,
      ShapeColor.BLUE,
      ShapeColor.GREEN,
      ShapeColor.YELLOW,
      ShapeColor.PURPLE,
      ShapeColor.ORANGE
    ];
  }

  public update(deltaTime: number): void {
    // Update stun state
    if (this.state === CatcherState.STUNNED) {
      this.stunTime -= deltaTime;
      if (this.stunTime <= 0) {
        this.state = CatcherState.NORMAL;
        this.stunTime = 0;
      }
    }
  }

  public moveLeft(): void {
    if (this.state === CatcherState.STUNNED) return;

    this.position.x = Math.max(
      this.size / 2,
      this.position.x - CATCHER_SPEED
    );
  }

  public moveRight(): void {
    if (this.state === CatcherState.STUNNED) return;

    this.position.x = Math.min(
      CANVAS_WIDTH - this.size / 2,
      this.position.x + CATCHER_SPEED
    );
  }

  public changeShape(): void {
    if (this.state === CatcherState.STUNNED) return;

    const currentIndex = this.availableShapes.indexOf(this.currentShape);
    const nextIndex = (currentIndex + 1) % this.availableShapes.length;
    this.currentShape = this.availableShapes[nextIndex];
  }

  public changeColor(): void {
    if (this.state === CatcherState.STUNNED) return;

    const currentIndex = this.availableColors.indexOf(this.currentColor);
    const nextIndex = (currentIndex + 1) % this.availableColors.length;
    this.currentColor = this.availableColors[nextIndex];
  }

  public setShape(shape: ShapeType): void {
    if (this.availableShapes.includes(shape)) {
      this.currentShape = shape;
    }
  }

  public setColor(color: ShapeColor): void {
    if (this.availableColors.includes(color)) {
      this.currentColor = color;
    }
  }

  public stun(duration: number): void {
    this.state = CatcherState.STUNNED;
    this.stunTime = duration;
  }

  public makeInvulnerable(duration: number): void {
    this.state = CatcherState.INVULNERABLE;
    this.stunTime = duration;
  }

  public getBounds(): {
    left: number;
    right: number;
    top: number;
    bottom: number;
  } {
    const halfWidth = this.size / 2;
    const halfHeight = CATCHER_HEIGHT / 2;

    return {
      left: this.position.x - halfWidth,
      right: this.position.x + halfWidth,
      top: this.position.y - halfHeight,
      bottom: this.position.y + halfHeight
    };
  }

  public setAvailableShapes(shapes: ShapeType[]): void {
    this.availableShapes = [...shapes];
    // Reset to first available shape if current shape is no longer available
    if (!this.availableShapes.includes(this.currentShape) && shapes.length > 0) {
      this.currentShape = shapes[0];
    }
  }

  public setAvailableColors(colors: ShapeColor[]): void {
    this.availableColors = [...colors];
    // Reset to first available color if current color is no longer available
    if (!this.availableColors.includes(this.currentColor) && colors.length > 0) {
      this.currentColor = colors[0];
    }
  }

  public isStunned(): boolean {
    return this.state === CatcherState.STUNNED;
  }

  public isInvulnerable(): boolean {
    return this.state === CatcherState.INVULNERABLE;
  }
}