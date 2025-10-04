import { Catcher } from './entities/Catcher';
import { InputManager } from '../core/InputManager';
import { ShapeType, ShapeColor } from '../types/shape.types';

export class CatcherController {
  private catcher: Catcher;
  private inputManager: InputManager;
  private availableShapes: ShapeType[];
  private availableColors: ShapeColor[];

  constructor(catcher: Catcher, inputManager: InputManager) {
    this.catcher = catcher;
    this.inputManager = inputManager;
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
    // Handle movement
    if (this.inputManager.isKeyDown('ArrowLeft') || this.inputManager.isKeyDown('a')) {
      this.catcher.moveLeft();
    }
    if (this.inputManager.isKeyDown('ArrowRight') || this.inputManager.isKeyDown('d')) {
      this.catcher.moveRight();
    }

    // Handle shape change (Up arrow or W)
    if (this.inputManager.isKeyPressed('ArrowUp') || this.inputManager.isKeyPressed('w')) {
      this.catcher.changeShape();
    }

    // Handle color change (Down arrow or S)
    if (this.inputManager.isKeyPressed('ArrowDown') || this.inputManager.isKeyPressed('s')) {
      this.catcher.changeColor();
    }

    // Handle touch/swipe input
    const swipe = this.inputManager.getLastSwipe();
    if (swipe) {
      switch (swipe) {
        case 'left':
          this.catcher.moveLeft();
          break;
        case 'right':
          this.catcher.moveRight();
          break;
        case 'up':
          this.catcher.changeShape();
          break;
        case 'down':
          this.catcher.changeColor();
          break;
      }
      this.inputManager.clearSwipe();
    }
  }

  public setAvailableShapes(shapes: ShapeType[]): void {
    this.availableShapes = shapes;
    this.catcher.setAvailableShapes(shapes);
  }

  public setAvailableColors(colors: ShapeColor[]): void {
    this.availableColors = colors;
    this.catcher.setAvailableColors(colors);
  }

  public getCatcher(): Catcher {
    return this.catcher;
  }

  public reset(): void {
    // Catcher will be reset separately by the game engine
  }

  public autoMatch(targetShape: ShapeType, targetColor: ShapeColor): void {
    this.catcher.setShape(targetShape);
    this.catcher.setColor(targetColor);
  }
}
