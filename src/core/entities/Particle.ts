import { Position, Velocity } from '../../types/shape.types';

export interface ParticleConfig {
  lifetime: number;
  size: number;
  color: string;
  velocity: Velocity;
  gravity: number;
  fadeOut: boolean;
}

export class Particle {
  public position: Position;
  public velocity: Velocity;
  public size: number;
  public color: string;
  public lifetime: number;
  public maxLifetime: number;
  public gravity: number;
  public fadeOut: boolean;
  public isActive: boolean;
  public alpha: number;

  constructor(position: Position, config: ParticleConfig) {
    this.position = { ...position };
    this.velocity = { ...config.velocity };
    this.size = config.size;
    this.color = config.color;
    this.lifetime = config.lifetime;
    this.maxLifetime = config.lifetime;
    this.gravity = config.gravity;
    this.fadeOut = config.fadeOut;
    this.isActive = true;
    this.alpha = 1.0;
  }

  public update(deltaTime: number): void {
    if (!this.isActive) return;

    // Update position
    this.position.x += this.velocity.x * deltaTime * 60;
    this.position.y += this.velocity.y * deltaTime * 60;

    // Apply gravity
    this.velocity.y += this.gravity * deltaTime * 60;

    // Update lifetime
    this.lifetime -= deltaTime * 1000;

    // Update alpha for fade out effect
    if (this.fadeOut) {
      this.alpha = Math.max(0, this.lifetime / this.maxLifetime);
    }

    // Check if particle should die
    if (this.lifetime <= 0) {
      this.isActive = false;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isActive) return;

    ctx.save();

    // Apply alpha
    ctx.globalAlpha = this.alpha;

    // Draw particle
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  public reset(position: Position, config: ParticleConfig): void {
    this.position = { ...position };
    this.velocity = { ...config.velocity };
    this.size = config.size;
    this.color = config.color;
    this.lifetime = config.lifetime;
    this.maxLifetime = config.lifetime;
    this.gravity = config.gravity;
    this.fadeOut = config.fadeOut;
    this.isActive = true;
    this.alpha = 1.0;
  }

  public kill(): void {
    this.isActive = false;
  }
}