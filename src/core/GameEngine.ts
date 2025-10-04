import { GameLoop } from './GameLoop';
import { PhysicsEngine } from './PhysicsEngine';
import { InputManager, InputAction } from './InputManager';
import { CollisionDetector } from './CollisionDetector';
import { ShapeFactory } from '../game/factories/ShapeFactory';
import { useGameStore } from '../store/gameStore';
import { GameStatus } from '../types/game.types';
import { DoubleBuffer } from '../utils/canvasUtils';
import { drawShape } from '../utils/renderUtils';
import { Shape } from '../game/entities/Shape';
import { CANVAS_HEIGHT } from '../config/constants';

export class GameEngine {
  private gameLoop: GameLoop;
  private physicsEngine: PhysicsEngine;
  private inputManager: InputManager;
  private doubleBuffer: DoubleBuffer | null = null;
  private mainCanvas: HTMLCanvasElement | null = null;
  private mainCtx: CanvasRenderingContext2D | null = null;

  private lastShapeSpawn: number = 0;
  private shapeSpawnInterval: number = 2000; // 2 seconds

  constructor() {
    this.gameLoop = new GameLoop();
    this.physicsEngine = new PhysicsEngine();
    this.inputManager = InputManager.getInstance();

    this.setupInputHandlers();
    this.gameLoop.setUpdateCallback(this.update.bind(this));
    this.gameLoop.setRenderCallback(this.render.bind(this));
  }

  public initialize(canvas: HTMLCanvasElement): void {
    this.mainCanvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    this.mainCtx = ctx;
    this.doubleBuffer = new DoubleBuffer(ctx);
  }

  public start(): void {
    if (!this.mainCanvas || !this.mainCtx) {
      console.error('GameEngine not initialized with canvas');
      return;
    }

    this.gameLoop.start();
  }

  public stop(): void {
    this.gameLoop.stop();
  }

  public pause(): void {
    this.gameLoop.pause();
    useGameStore.getState().pauseGame();
  }

  public resume(): void {
    this.gameLoop.resume();
    useGameStore.getState().resumeGame();
  }

  private setupInputHandlers(): void {
    this.inputManager.on(InputAction.MOVE_LEFT, () => {
      useGameStore.getState().moveCatcherLeft();
    });

    this.inputManager.on(InputAction.MOVE_RIGHT, () => {
      useGameStore.getState().moveCatcherRight();
    });

    this.inputManager.on(InputAction.CHANGE_SHAPE, () => {
      useGameStore.getState().changeCatcherShape();
    });

    this.inputManager.on(InputAction.CHANGE_COLOR, () => {
      useGameStore.getState().changeCatcherColor();
    });

    this.inputManager.on(InputAction.PAUSE, () => {
      const { gameStatus } = useGameStore.getState();
      if (gameStatus === GameStatus.PLAYING) {
        this.pause();
      } else if (gameStatus === GameStatus.PAUSED) {
        this.resume();
      }
    });
  }

  private update = (deltaTime: number): void => {
    const gameState = useGameStore.getState();

    if (gameState.gameStatus !== GameStatus.PLAYING) {
      return;
    }

    // Update time
    gameState.updateGameTime(deltaTime);
    gameState.updateLevelTime(deltaTime);

    // Update combo timer
    gameState.updateComboTimer(deltaTime * 1000);

    // Update catcher
    gameState.catcher.update(deltaTime);

    // Spawn shapes
    this.updateShapeSpawning(deltaTime);

    // Update physics for all shapes
    this.physicsEngine.updateShapes(gameState.shapes, deltaTime);

    // Check collisions
    this.checkCollisions();

    // Remove off-screen shapes
    const remainingShapes = this.physicsEngine.removeOffscreenShapes(gameState.shapes);
    if (remainingShapes.length !== gameState.shapes.length) {
      gameState.updateShapes(remainingShapes);
    }
  };

  private render = (interpolation: number): void => {
    if (!this.doubleBuffer) return;

    const gameState = useGameStore.getState();
    const ctx = this.doubleBuffer.getOffscreenContext();

    // Clear canvas
    this.doubleBuffer.clear();

    // Draw background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (gameState.gameStatus === GameStatus.PLAYING) {
      // Draw all shapes
      gameState.shapes.forEach(shape => {
        if (shape.type in { square: 1, triangle: 1, circle: 1, star: 1 }) {
          drawShape(
            ctx,
            shape.type as any,
            shape.position.x,
            shape.position.y,
            shape.size,
            shape.color,
            shape.rotation
          );
        }
      });

      // Draw catcher
      drawShape(
        ctx,
        gameState.catcher.currentShape,
        gameState.catcher.position.x,
        gameState.catcher.position.y,
        gameState.catcher.size,
        gameState.catcher.currentColor
      );

      // Draw UI
      this.drawUI(ctx, gameState);
    } else {
      // Draw menu or game over screen
      this.drawMenuScreen(ctx, gameState);
    }

    // Present the frame
    this.doubleBuffer.present();
  };

  private updateShapeSpawning(deltaTime: number): void {
    const now = Date.now();
    if (now - this.lastShapeSpawn > this.shapeSpawnInterval) {
      const gameState = useGameStore.getState();
      const newShape = ShapeFactory.createRandomShape(
        gameState.availableShapes,
        gameState.availableColors
      );
      gameState.addShape(newShape);
      this.lastShapeSpawn = now;
    }
  }

  private checkCollisions(): void {
    const gameState = useGameStore.getState();
    const catcher = gameState.catcher;

    gameState.shapes.forEach(shape => {
      const collision = CollisionDetector.checkCollision(shape, catcher);

      if (collision.hasCollision) {
        if (collision.isMatch) {
          // Success
          const points = 10 * CollisionDetector.calculateScoreMultiplier(shape);
          gameState.addScore(points);
          gameState.incrementCatch();
          gameState.incrementCombo();
        } else {
          // Miss
          gameState.decrementLives();
          gameState.resetCombo();
        }

        // Remove the shape
        gameState.removeShape(shape.id);
      }
    });
  }

  private drawUI(ctx: CanvasRenderingContext2D, gameState: any): void {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';

    // Score
    ctx.fillText(`Score: ${gameState.score}`, 20, 30);

    // Level
    ctx.fillText(`Level: ${gameState.currentLevel}`, 20, 60);

    // Lives
    ctx.fillText(`Lives: ${gameState.lives}`, 20, 90);

    // Progress
    ctx.fillText(`Progress: ${gameState.catchCount}/${gameState.targetCatches}`, 20, 120);

    // Combo
    if (gameState.combo > 0) {
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`Combo: ${gameState.combo}x`, 20, 150);
    }

    // Current catcher info
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Shape: ${gameState.catcher.currentShape}`, ctx.canvas.width - 20, 30);
    ctx.fillText(`Color: ${gameState.catcher.currentColor}`, ctx.canvas.width - 20, 55);
  }

  private drawMenuScreen(ctx: CanvasRenderingContext2D, gameState: any): void {
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';

    if (gameState.gameStatus === GameStatus.MENU) {
      ctx.fillText('Shape Catcher Game', ctx.canvas.width / 2, ctx.canvas.height / 2 - 50);
      ctx.font = '18px Arial';
      ctx.fillText('Click Start to begin!', ctx.canvas.width / 2, ctx.canvas.height / 2 + 20);
    } else if (gameState.gameStatus === GameStatus.GAME_OVER) {
      ctx.fillText('Game Over!', ctx.canvas.width / 2, ctx.canvas.height / 2 - 50);
      ctx.font = '18px Arial';
      ctx.fillText(`Final Score: ${gameState.score}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 20);
    }
  }

  public cleanup(): void {
    this.gameLoop.stop();
    this.inputManager.cleanup();
  }
}