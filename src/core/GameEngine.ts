import { GameLoop } from './GameLoop';
import { PhysicsEngine } from './PhysicsEngine';
import { InputManager, InputAction } from './InputManager';
import { CollisionDetector } from './CollisionDetector';
import { ParticleSystem } from './ParticleSystem';
import { ShapeFactory } from '../game/factories/ShapeFactory';
import { AudioService } from '../services/AudioService';
import { useGameStore } from '../store/gameStore';
import { GameStatus } from '../types/game.types';
import { DoubleBuffer } from '../utils/canvasUtils';
import { drawShape } from '../utils/renderUtils';

/**
 * GameEngine - Core orchestrator for the Shape Catcher game
 *
 * This class coordinates all major game systems including:
 * - Game loop execution (update/render cycle at 60fps)
 * - Physics simulation for falling shapes
 * - Input handling (keyboard and touch)
 * - Collision detection and matching logic
 * - Particle effects system
 * - Audio playback
 * - Canvas rendering with double buffering
 *
 * @example
 * ```ts
 * const engine = new GameEngine();
 * engine.initialize(canvasElement);
 * engine.start();
 * ```
 */
export class GameEngine {
  private gameLoop: GameLoop;
  private physicsEngine: PhysicsEngine;
  private inputManager: InputManager;
  private particleSystem: ParticleSystem;
  private audioService: AudioService;
  private doubleBuffer: DoubleBuffer | null = null;
  private mainCanvas: HTMLCanvasElement | null = null;
  private mainCtx: CanvasRenderingContext2D | null = null;

  /** Timestamp of the last shape spawn to control spawn intervals */
  private lastShapeSpawn: number = 0;

  /**
   * Creates a new GameEngine instance
   * Initializes all subsystems and binds callbacks
   */
  constructor() {
    this.gameLoop = new GameLoop();
    this.physicsEngine = new PhysicsEngine();
    this.inputManager = InputManager.getInstance();
    this.particleSystem = new ParticleSystem();
    this.audioService = AudioService.getInstance();

    this.setupInputHandlers();
    this.gameLoop.setUpdateCallback(this.update.bind(this));
    this.gameLoop.setRenderCallback(this.render.bind(this));
  }

  /**
   * Initializes the engine with a canvas element
   * Must be called before start()
   *
   * @param canvas - The HTML canvas element to render to
   * @throws {Error} If canvas context cannot be obtained
   */
  public initialize(canvas: HTMLCanvasElement): void {
    this.mainCanvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    this.mainCtx = ctx;
    this.doubleBuffer = new DoubleBuffer(ctx);
  }

  /**
   * Starts the game loop
   * Call after initialize()
   */
  public start(): void {
    if (!this.mainCanvas || !this.mainCtx) {
      console.error('GameEngine not initialized with canvas');
      return;
    }

    this.gameLoop.start();
  }

  /**
   * Stops the game loop completely
   * Use pause() for temporary halts
   */
  public stop(): void {
    this.gameLoop.stop();
  }

  /**
   * Pauses the game
   * Game state is preserved and can be resumed
   */
  public pause(): void {
    this.gameLoop.pause();
    useGameStore.getState().pauseGame();
  }

  /**
   * Resumes the game from paused state
   */
  public resume(): void {
    this.gameLoop.resume();
    useGameStore.getState().resumeGame();
  }

  /**
   * Sets up input event handlers
   * Maps input actions to game state updates
   * @private
   */
  private setupInputHandlers(): void {
    this.inputManager.on(InputAction.MOVE_LEFT, () => {
      useGameStore.getState().moveCatcherLeft();
    });

    this.inputManager.on(InputAction.MOVE_RIGHT, () => {
      useGameStore.getState().moveCatcherRight();
    });

    this.inputManager.on(InputAction.CHANGE_SHAPE, () => {
      useGameStore.getState().changeCatcherShape();
      this.audioService.playShapeChange();
    });

    this.inputManager.on(InputAction.CHANGE_COLOR, () => {
      useGameStore.getState().changeCatcherColor();
      this.audioService.playShapeChange();
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

  /**
   * Main update loop called by GameLoop
   * Updates all game systems in order:
   * 1. Time tracking
   * 2. Combo system
   * 3. Particles
   * 4. Catcher
   * 5. Shape spawning
   * 6. Physics simulation
   * 7. Collision detection
   * 8. Cleanup off-screen shapes
   *
   * @param deltaTime - Time elapsed since last frame in milliseconds
   * @private
   */
  private update = (deltaTime: number): void => {
    const gameState = useGameStore.getState();

    if (gameState.gameStatus !== GameStatus.PLAYING) {
      return;
    }

    // Update time
    gameState.updateGameTime(deltaTime);
    gameState.updateLevelTime(deltaTime);

    // Update combo system
    gameState.updateCombo(deltaTime);

    // Update particle system
    this.particleSystem.update(deltaTime);

    // Handle continuous input for held keys
    if (this.inputManager.isKeyDown('ArrowLeft')) {
      gameState.moveCatcherLeft();
    }
    if (this.inputManager.isKeyDown('ArrowRight')) {
      gameState.moveCatcherRight();
    }
    if (this.inputManager.isKeyDown('ArrowUp')) {
      gameState.changeCatcherShape();
    }
    if (this.inputManager.isKeyDown('ArrowDown')) {
      gameState.changeCatcherColor();
    }

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

  /**
   * Main render loop called by GameLoop
   * Renders all visual elements using double buffering:
   * 1. Background
   * 2. Falling shapes
   * 3. Catcher
   * 4. Particle effects
   * 5. UI elements
   *
   * @param _interpolation - Frame interpolation value (currently unused)
   * @private
   */
  private render = (_interpolation: number): void => {
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

      // Draw particles
      this.particleSystem.render(ctx);

      // Draw UI
      this.drawUI(ctx, gameState);
    } else {
      // Draw menu or game over screen
      this.drawMenuScreen(ctx, gameState);
    }

    // Present the frame
    this.doubleBuffer.present();
  };

  /**
   * Handles shape spawning based on level configuration
   * Spawns regular shapes, special shapes, or bombs based on:
   * - Level spawn interval
   * - Special shape probability
   * - Bomb probability
   *
   * @param _deltaTime - Time elapsed since last frame (currently unused)
   * @private
   */
  private updateShapeSpawning(_deltaTime: number): void {
    const gameState = useGameStore.getState();
    const levelConfig = gameState.levelManager.getCurrentLevelConfig();

    const now = Date.now();
    if (now - this.lastShapeSpawn > levelConfig.spawnInterval) {
      // Determine if special shape should spawn
      const shouldSpawnSpecial = Math.random() < levelConfig.specialShapeChance;
      const shouldSpawnBomb = Math.random() < levelConfig.bombChance;

      let newShape;
      if (shouldSpawnBomb) {
        // Spawn bomb
        newShape = ShapeFactory.createBomb();
      } else if (shouldSpawnSpecial) {
        // Random special shape
        const specialTypes = ['diamond', 'rainbow', 'golden_star', 'time_bonus', 'multiplier'];
        const randomSpecial = specialTypes[Math.floor(Math.random() * specialTypes.length)];

        switch (randomSpecial) {
          case 'diamond':
            newShape = ShapeFactory.createDiamond(
              gameState.availableColors[Math.floor(Math.random() * gameState.availableColors.length)]
            );
            break;
          case 'rainbow':
            newShape = ShapeFactory.createRainbow(
              gameState.availableShapes[Math.floor(Math.random() * gameState.availableShapes.length)]
            );
            break;
          case 'golden_star':
            newShape = ShapeFactory.createGoldenStar();
            break;
          case 'time_bonus':
            newShape = ShapeFactory.createTimeBonus();
            break;
          case 'multiplier':
            newShape = ShapeFactory.createMultiplier();
            break;
          default:
            newShape = ShapeFactory.createDiamond(
              gameState.availableColors[Math.floor(Math.random() * gameState.availableColors.length)]
            );
        }
      } else {
        newShape = ShapeFactory.createRandomShape(
          gameState.availableShapes,
          gameState.availableColors
        );
      }

      // Set fall speed based on level
      newShape.setFallSpeed(levelConfig.fallSpeed);

      gameState.addShape(newShape);
      this.lastShapeSpawn = now;
    }
  }

  /**
   * Checks for collisions between shapes and catcher
   * Handles both successful catches and failures:
   *
   * Success:
   * - Adds score based on shape multiplier
   * - Increments combo
   * - Plays success audio
   * - Emits success particles
   * - Handles special shape effects
   *
   * Failure/Bomb:
   * - Decrements lives
   * - Resets combo
   * - Plays miss/explosion audio
   * - Emits explosion particles
   *
   * @private
   */
  private checkCollisions(): void {
    const gameState = useGameStore.getState();
    const catcher = gameState.catcher;

    gameState.shapes.forEach(shape => {
      const collision = CollisionDetector.checkCollision(shape, catcher);

      if (collision.hasCollision) {
        const specialType = shape.getSpecialType();

        if (collision.isMatch) {
          // Success
          const points = 10 * CollisionDetector.calculateScoreMultiplier(shape);
          gameState.addScore(points);
          gameState.incrementCatch();
          gameState.incrementCombo();

          // Play success sound
          if (specialType) {
            this.audioService.playSpecialShape();
          } else {
            this.audioService.playSuccess();
          }

          // Special shape effects
          if (specialType) {
            switch (specialType) {
              case 'golden_star':
                // TODO: Add powerup to inventory
                this.particleSystem.emitSparkle(shape.position, '#ffd700');
                break;
              case 'time_bonus':
                // TODO: Add time bonus
                this.particleSystem.emitSparkle(shape.position, '#74b9ff');
                break;
              case 'multiplier':
                // TODO: Activate multiplier
                this.particleSystem.emitSparkle(shape.position, '#a29bfe');
                break;
              default:
                this.particleSystem.emitSparkle(shape.position);
            }
          } else {
            // Regular success particles
            this.particleSystem.emitSuccess(shape.position);
          }

          // Emit combo particles if combo is high
          const combo = gameState.comboSystem.getCount();
          if (combo >= 5) {
            const tier = gameState.comboSystem.getCurrentTierIndex();
            this.particleSystem.emitCombo(shape.position, tier);
            this.audioService.playCombo(tier);
          }
        } else {
          // Handle bomb collision
          if (specialType === 'bomb') {
            // Bomb always triggers
            gameState.addScore(-5); // Negative points
            gameState.decrementLives();
            gameState.resetCombo();
            // TODO: Add stun effect to catcher
            this.particleSystem.emitExplosion(shape.position, '#ef4444');
            this.audioService.playExplosion();
          } else {
            // Regular miss
            gameState.decrementLives();
            gameState.resetCombo();
            this.particleSystem.emitExplosion(shape.position);
            this.audioService.playMiss();
          }
        }

        // Remove the shape
        gameState.removeShape(shape.id);
      }
    });
  }

  /**
   * Renders the game UI overlay on the canvas
   * Displays:
   * - Score
   * - Level number
   * - Lives remaining
   * - Time/Progress
   * - Combo counter and timer bar
   * - Combo tier messages
   * - Current catcher shape and color
   *
   * @param ctx - Canvas rendering context
   * @param gameState - Current game state from store
   * @private
   */
  private drawUI(ctx: CanvasRenderingContext2D, gameState: any): void {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';

    // Score
    ctx.fillText(`Score: ${gameState.score}`, 20, 30);

    // Level
    ctx.fillText(`Level: ${gameState.levelManager.getCurrentLevel()}`, 20, 60);

    // Lives
    ctx.fillText(`Lives: ${gameState.lives}`, 20, 90);

    // Progress
    const progress = Math.floor(gameState.levelTime / 1000); // Convert to seconds as proxy for progress
    const timeTarget = 20; // 20 seconds per level
    ctx.fillText(`Time: ${progress}/${timeTarget}s`, 20, 120);

    // Combo
    const combo = gameState.comboSystem.getCount();
    if (combo > 0) {
      const tier = gameState.comboSystem.getCurrentTier();
      ctx.fillStyle = tier ? tier.color : '#fbbf24';
      ctx.fillText(`Combo: ${combo}x`, 20, 150);

      // Combo timer bar
      const timerPercent = gameState.comboSystem.getTimerPercent();
      const barWidth = 100;
      const barHeight = 8;
      const barX = 20;
      const barY = 160;

      // Background
      ctx.fillStyle = '#374151';
      ctx.fillRect(barX, barY, barWidth, barHeight);

      // Timer bar
      ctx.fillStyle = tier ? tier.color : '#fbbf24';
      ctx.fillRect(barX, barY, barWidth * timerPercent, barHeight);

      // Border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    // Combo message
    if (gameState.showComboMessage) {
      ctx.fillStyle = gameState.comboSystem.getComboColor();
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(gameState.comboMessage, ctx.canvas.width / 2, ctx.canvas.height / 2 - 100);
    }

    // Current catcher info
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Shape: ${gameState.catcher.currentShape}`, ctx.canvas.width - 20, 30);
    ctx.fillText(`Color: ${gameState.catcher.currentColor}`, ctx.canvas.width - 20, 55);
  }

  /**
   * Renders menu screens (main menu or game over)
   *
   * @param ctx - Canvas rendering context
   * @param gameState - Current game state from store
   * @private
   */
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

  /**
   * Cleans up engine resources
   * Stops the game loop and removes input listeners
   * Call when unmounting or destroying the game
   */
  public cleanup(): void {
    this.gameLoop.stop();
    this.inputManager.cleanup();
  }
}