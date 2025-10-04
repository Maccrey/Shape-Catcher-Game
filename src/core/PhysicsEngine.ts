import { Shape } from '../game/entities/Shape';
import { CANVAS_HEIGHT } from '../config/constants';

export interface PhysicsConfig {
  gravity: number;
  terminalVelocity: number;
  airResistance: number;
}

export class PhysicsEngine {
  private config: PhysicsConfig;

  constructor(config: Partial<PhysicsConfig> = {}) {
    this.config = {
      gravity: 0.2, // Pixels per frame^2
      terminalVelocity: 10, // Max falling speed
      airResistance: 0.99, // Friction factor
      ...config
    };
  }

  public updateShape(shape: Shape, deltaTime: number): void {
    // Apply gravity to Y velocity
    shape.velocity.y += this.config.gravity * deltaTime * 60;

    // Apply terminal velocity limit
    if (shape.velocity.y > this.config.terminalVelocity) {
      shape.velocity.y = this.config.terminalVelocity;
    }

    // Apply air resistance to X velocity (for special effects)
    shape.velocity.x *= this.config.airResistance;

    // Update position
    shape.update(deltaTime);
  }

  public updateShapes(shapes: Shape[], deltaTime: number): void {
    shapes.forEach(shape => {
      this.updateShape(shape, deltaTime);
    });
  }

  public setGravity(gravity: number): void {
    this.config.gravity = gravity;
  }

  public setTerminalVelocity(velocity: number): void {
    this.config.terminalVelocity = velocity;
  }

  public setAirResistance(resistance: number): void {
    this.config.airResistance = Math.max(0, Math.min(1, resistance));
  }

  public applyForce(shape: Shape, forceX: number, forceY: number): void {
    shape.velocity.x += forceX;
    shape.velocity.y += forceY;
  }

  public applyImpulse(shape: Shape, impulseX: number, impulseY: number): void {
    // Impulse is immediate change in velocity
    shape.velocity.x = impulseX;
    shape.velocity.y = impulseY;
  }

  public removeOffscreenShapes(shapes: Shape[]): Shape[] {
    return shapes.filter(shape => !shape.isOffScreen());
  }

  public setFallSpeed(shape: Shape, speed: number): void {
    shape.setFallSpeed(speed);
  }

  public applyWind(shapes: Shape[], windForce: number): void {
    shapes.forEach(shape => {
      this.applyForce(shape, windForce, 0);
    });
  }

  public applyExplosion(
    shapes: Shape[],
    explosionX: number,
    explosionY: number,
    radius: number,
    force: number
  ): void {
    shapes.forEach(shape => {
      const dx = shape.position.x - explosionX;
      const dy = shape.position.y - explosionY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius && distance > 0) {
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        const falloff = 1 - (distance / radius);
        const explosionForce = force * falloff;

        this.applyForce(
          shape,
          normalizedDx * explosionForce,
          normalizedDy * explosionForce
        );
      }
    });
  }

  public getConfig(): PhysicsConfig {
    return { ...this.config };
  }

  public reset(): void {
    this.config = {
      gravity: 0.2,
      terminalVelocity: 10,
      airResistance: 0.99
    };
  }
}