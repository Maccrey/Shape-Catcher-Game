import { Shape } from './entities/Shape';
import { ShapeFactory } from './factories/ShapeFactory';
import { ShapeType, ShapeColor, SpecialShapeType } from '../types/shape.types';
import { LevelConfig } from '../types/level.types';

export class ShapeManager {
  private currentShape: Shape | null = null;
  private nextShape: Shape | null = null;
  private timeSinceLastSpawn: number = 0;
  private levelConfig: LevelConfig;
  private availableShapes: ShapeType[] = [];
  private availableColors: ShapeColor[] = [];

  constructor(levelConfig: LevelConfig) {
    this.levelConfig = levelConfig;
    this.updateAvailableOptions();
    this.generateNextShape();
  }

  public update(deltaTime: number): void {
    // Update current shape if exists
    if (this.currentShape) {
      this.currentShape.update(deltaTime);
    }

    // Update spawn timer
    this.timeSinceLastSpawn += deltaTime * 1000; // Convert to milliseconds

    // Check if we need to spawn a new shape
    if (!this.currentShape && this.timeSinceLastSpawn >= this.levelConfig.spawnInterval) {
      this.spawnShape();
      this.timeSinceLastSpawn = 0;
    }
  }

  public getCurrentShape(): Shape | null {
    return this.currentShape;
  }

  public getNextShape(): Shape | null {
    return this.nextShape;
  }

  public removeCurrentShape(): void {
    this.currentShape = null;
    this.generateNextShape();
  }

  public spawnShape(): void {
    // Move next shape to current
    this.currentShape = this.nextShape;

    // Generate new next shape
    this.generateNextShape();

    // Apply fall speed from level config
    if (this.currentShape) {
      this.currentShape.setFallSpeed(this.levelConfig.fallSpeed);
    }
  }

  public updateLevelConfig(levelConfig: LevelConfig): void {
    this.levelConfig = levelConfig;
    this.updateAvailableOptions();
  }

  public reset(): void {
    this.currentShape = null;
    this.nextShape = null;
    this.timeSinceLastSpawn = 0;
    this.generateNextShape();
  }

  public hasCurrentShape(): boolean {
    return this.currentShape !== null;
  }

  private generateNextShape(): void {
    // Determine if this should be a special shape
    const specialRoll = Math.random();

    if (specialRoll < this.levelConfig.bombChance) {
      // Generate bomb
      this.nextShape = ShapeFactory.createBomb();
    } else if (specialRoll < this.levelConfig.bombChance + this.levelConfig.specialShapeChance) {
      // Generate special shape (diamond, rainbow, or golden star)
      this.nextShape = this.generateSpecialShape();
    } else {
      // Generate normal shape
      this.nextShape = ShapeFactory.createRandomShape(
        this.availableShapes,
        this.availableColors
      );
    }
  }

  private generateSpecialShape(): Shape {
    const specialTypes = [
      SpecialShapeType.DIAMOND,
      SpecialShapeType.RAINBOW,
      SpecialShapeType.GOLDEN_STAR
    ];

    const randomType = specialTypes[Math.floor(Math.random() * specialTypes.length)];

    switch (randomType) {
      case SpecialShapeType.DIAMOND:
        const randomColor = this.availableColors[Math.floor(Math.random() * this.availableColors.length)];
        return ShapeFactory.createDiamond(randomColor);

      case SpecialShapeType.RAINBOW:
        const randomShapeType = this.availableShapes[Math.floor(Math.random() * this.availableShapes.length)];
        return ShapeFactory.createRainbow(randomShapeType);

      case SpecialShapeType.GOLDEN_STAR:
      default:
        return ShapeFactory.createGoldenStar();
    }
  }

  private updateAvailableOptions(): void {
    // Update available shapes based on level config
    const allShapes = Object.values(ShapeType);
    this.availableShapes = allShapes.slice(0, this.levelConfig.shapeTypeCount);

    // Update available colors based on level config
    const allColors = Object.values(ShapeColor);
    this.availableColors = allColors.slice(0, this.levelConfig.colorCount);
  }

  public forceSpawn(): void {
    this.timeSinceLastSpawn = this.levelConfig.spawnInterval;
  }

  public isReadyToSpawn(): boolean {
    return !this.currentShape && this.timeSinceLastSpawn >= this.levelConfig.spawnInterval;
  }
}
