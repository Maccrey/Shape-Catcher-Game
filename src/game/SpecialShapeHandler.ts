import { Shape } from './entities/Shape';
import { Catcher } from './entities/Catcher';
import { SpecialShapeType } from '../types/shape.types';
import { CameraController } from '../core/CameraController';
import { PowerUpManager, PowerUpType } from './PowerUpManager';
import { AudioService } from '../services/AudioService';

export interface SpecialShapeEffect {
  type: SpecialShapeType;
  scoreBonus: number;
  timeBonus: number;
  shouldStunCatcher: boolean;
  stunDuration: number;
  shouldShakeCamera: boolean;
  message: string;
}

export class SpecialShapeHandler {
  private cameraController: CameraController;
  private powerUpManager: PowerUpManager;
  private audioService: AudioService;

  constructor(
    cameraController: CameraController,
    powerUpManager: PowerUpManager
  ) {
    this.cameraController = cameraController;
    this.powerUpManager = powerUpManager;
    this.audioService = AudioService.getInstance();
  }

  public handleSpecialShape(
    shape: Shape,
    catcher: Catcher
  ): SpecialShapeEffect | null {
    if (!shape.isSpecialShape()) {
      return null;
    }

    const specialType = shape.getSpecialType();
    if (!specialType) return null;

    switch (specialType) {
      case SpecialShapeType.BOMB:
        return this.handleBomb(catcher);

      case SpecialShapeType.TIME_BONUS:
        return this.handleTimeBonus();

      case SpecialShapeType.MULTIPLIER:
        return this.handleMultiplier();

      case SpecialShapeType.GOLDEN_STAR:
        return this.handleGoldenStar();

      case SpecialShapeType.DIAMOND:
        return this.handleDiamond();

      case SpecialShapeType.RAINBOW:
        return this.handleRainbow();

      default:
        return null;
    }
  }

  private handleBomb(catcher: Catcher): SpecialShapeEffect {
    // Camera shake effect
    this.cameraController.shake(300, 10);
    this.cameraController.flash(200, 0.3);

    // Stun the catcher
    catcher.stun(1.0);

    // Play bomb sound
    this.audioService.playExplosion?.();

    return {
      type: SpecialShapeType.BOMB,
      scoreBonus: -5,
      timeBonus: 0,
      shouldStunCatcher: true,
      stunDuration: 1.0,
      shouldShakeCamera: true,
      message: 'BOMB! -5 points'
    };
  }

  private handleTimeBonus(): SpecialShapeEffect {
    // Activate time bonus power-up
    this.powerUpManager.activatePowerUp(SpecialShapeType.TIME_BONUS);

    // Play bonus sound
    this.audioService.playPowerUp?.();

    return {
      type: SpecialShapeType.TIME_BONUS,
      scoreBonus: 5,
      timeBonus: 10000, // 10 seconds
      shouldStunCatcher: false,
      stunDuration: 0,
      shouldShakeCamera: false,
      message: '+10 Seconds!'
    };
  }

  private handleMultiplier(): SpecialShapeEffect {
    // Activate multiplier power-up
    this.powerUpManager.activatePowerUp(SpecialShapeType.MULTIPLIER);

    // Play bonus sound
    this.audioService.playPowerUp?.();

    return {
      type: SpecialShapeType.MULTIPLIER,
      scoreBonus: 5,
      timeBonus: 0,
      shouldStunCatcher: false,
      stunDuration: 0,
      shouldShakeCamera: false,
      message: '2x Score for 10 seconds!'
    };
  }

  private handleGoldenStar(): SpecialShapeEffect {
    // Play special sound
    this.audioService.playGoldenStar?.();

    // Small camera effect
    this.cameraController.flash(300, 0.2);

    // Drop a random powerup
    this.dropRandomPowerUp();

    return {
      type: SpecialShapeType.GOLDEN_STAR,
      scoreBonus: 30, // Base score, will be multiplied by 3x
      timeBonus: 0,
      shouldStunCatcher: false,
      stunDuration: 0,
      shouldShakeCamera: false,
      message: 'GOLDEN STAR! 3x Points!'
    };
  }

  private dropRandomPowerUp(): void {
    const powerUpTypes = [
      { type: PowerUpType.SLOW_MOTION, duration: 5000, weight: 20 },
      { type: PowerUpType.SCORE_MULTIPLIER, duration: 10000, weight: 25 },
      { type: PowerUpType.SHIELD, duration: 0, weight: 15 },
      { type: PowerUpType.STAR_SHOWER, duration: 5000, weight: 10 },
      { type: PowerUpType.AUTO_MATCH, duration: 0, weight: 30 }
    ];

    // Calculate total weight
    const totalWeight = powerUpTypes.reduce((sum, p) => sum + p.weight, 0);

    // Random selection based on weight
    let random = Math.random() * totalWeight;
    let selectedPowerUp = powerUpTypes[0];

    for (const powerUp of powerUpTypes) {
      if (random < powerUp.weight) {
        selectedPowerUp = powerUp;
        break;
      }
      random -= powerUp.weight;
    }

    // Activate the selected powerup
    this.powerUpManager.activatePowerUpByType(
      selectedPowerUp.type,
      selectedPowerUp.duration
    );

    // Play powerup collect sound
    this.audioService.playPowerUp?.();
  }

  private handleDiamond(): SpecialShapeEffect {
    // Play diamond sound
    this.audioService.playSpecialCatch?.();

    return {
      type: SpecialShapeType.DIAMOND,
      scoreBonus: 20, // Base score, will be multiplied by 2x
      timeBonus: 0,
      shouldStunCatcher: false,
      stunDuration: 0,
      shouldShakeCamera: false,
      message: 'DIAMOND! 2x Points!'
    };
  }

  private handleRainbow(): SpecialShapeEffect {
    // Play rainbow sound
    this.audioService.playSpecialCatch?.();

    return {
      type: SpecialShapeType.RAINBOW,
      scoreBonus: 15, // Base score, will be multiplied by 1.5x
      timeBonus: 0,
      shouldStunCatcher: false,
      stunDuration: 0,
      shouldShakeCamera: false,
      message: 'RAINBOW! 1.5x Points!'
    };
  }

  public reset(): void {
    this.cameraController.clear();
    this.powerUpManager.clear();
  }
}
