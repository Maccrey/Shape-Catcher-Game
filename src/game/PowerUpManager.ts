import { SpecialShapeType } from '../types/shape.types';

export enum PowerUpType {
  TIME_BONUS = 'TIME_BONUS',
  SCORE_MULTIPLIER = 'SCORE_MULTIPLIER',
  INVINCIBILITY = 'INVINCIBILITY',
  SLOW_MOTION = 'SLOW_MOTION'
}

export interface ActivePowerUp {
  type: PowerUpType;
  startTime: number;
  duration: number;
  multiplier?: number;
}

export class PowerUpManager {
  private activePowerUps: Map<PowerUpType, ActivePowerUp> = new Map();
  private onPowerUpActivated?: (powerUp: ActivePowerUp) => void;
  private onPowerUpExpired?: (type: PowerUpType) => void;

  public activatePowerUp(specialShapeType: SpecialShapeType): void {
    const now = Date.now();

    switch (specialShapeType) {
      case SpecialShapeType.TIME_BONUS:
        this.addPowerUp({
          type: PowerUpType.TIME_BONUS,
          startTime: now,
          duration: 0 // Instant effect
        });
        break;

      case SpecialShapeType.MULTIPLIER:
        this.addPowerUp({
          type: PowerUpType.SCORE_MULTIPLIER,
          startTime: now,
          duration: 10000, // 10 seconds
          multiplier: 2.0
        });
        break;

      case SpecialShapeType.GOLDEN_STAR:
        // Golden star gives instant high score, no ongoing effect
        break;

      case SpecialShapeType.DIAMOND:
        // Diamond gives instant score boost, no ongoing effect
        break;

      case SpecialShapeType.RAINBOW:
        // Rainbow gives instant score, no ongoing effect
        break;
    }
  }

  public update(deltaTime: number): void {
    const now = Date.now();
    const expiredPowerUps: PowerUpType[] = [];

    // Check for expired power-ups
    this.activePowerUps.forEach((powerUp, type) => {
      if (powerUp.duration > 0) {
        const elapsed = now - powerUp.startTime;
        if (elapsed >= powerUp.duration) {
          expiredPowerUps.push(type);
        }
      }
    });

    // Remove expired power-ups
    expiredPowerUps.forEach(type => {
      this.activePowerUps.delete(type);
      if (this.onPowerUpExpired) {
        this.onPowerUpExpired(type);
      }
    });
  }

  public isActive(type: PowerUpType): boolean {
    return this.activePowerUps.has(type);
  }

  public getActiveMultiplier(): number {
    let multiplier = 1.0;

    this.activePowerUps.forEach(powerUp => {
      if (powerUp.type === PowerUpType.SCORE_MULTIPLIER && powerUp.multiplier) {
        multiplier *= powerUp.multiplier;
      }
    });

    return multiplier;
  }

  public getActivePowerUps(): ActivePowerUp[] {
    return Array.from(this.activePowerUps.values());
  }

  public getRemainingTime(type: PowerUpType): number {
    const powerUp = this.activePowerUps.get(type);
    if (!powerUp || powerUp.duration === 0) return 0;

    const elapsed = Date.now() - powerUp.startTime;
    const remaining = powerUp.duration - elapsed;
    return Math.max(0, remaining);
  }

  public clear(): void {
    this.activePowerUps.clear();
  }

  public setOnPowerUpActivated(callback: (powerUp: ActivePowerUp) => void): void {
    this.onPowerUpActivated = callback;
  }

  public setOnPowerUpExpired(callback: (type: PowerUpType) => void): void {
    this.onPowerUpExpired = callback;
  }

  private addPowerUp(powerUp: ActivePowerUp): void {
    // If the same power-up is active, extend or replace it
    const existing = this.activePowerUps.get(powerUp.type);
    if (existing) {
      // Extend duration or reset timer
      powerUp.startTime = Date.now();
    }

    this.activePowerUps.set(powerUp.type, powerUp);

    if (this.onPowerUpActivated) {
      this.onPowerUpActivated(powerUp);
    }
  }

  // Time bonus effect (adds time to level timer)
  public getTimeBonusAmount(): number {
    const timeBonusPowerUp = this.activePowerUps.get(PowerUpType.TIME_BONUS);
    if (timeBonusPowerUp) {
      this.activePowerUps.delete(PowerUpType.TIME_BONUS); // Consume instantly
      return 10000; // 10 seconds bonus
    }
    return 0;
  }

  // Slow motion effect
  public getTimeScale(): number {
    if (this.isActive(PowerUpType.SLOW_MOTION)) {
      return 0.5; // 50% speed
    }
    return 1.0; // Normal speed
  }

  // Invincibility check
  public isInvincible(): boolean {
    return this.isActive(PowerUpType.INVINCIBILITY);
  }
}
