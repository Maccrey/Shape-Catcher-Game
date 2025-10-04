import { Particle, ParticleConfig } from './entities/Particle';
import { Position } from '../types/shape.types';
import { PARTICLE_POOL_SIZE, PARTICLE_LIFETIME } from '../config/constants';

export enum ParticleType {
  SUCCESS = 'success',
  EXPLOSION = 'explosion',
  SPARKLE = 'sparkle',
  TRAIL = 'trail',
  COMBO = 'combo'
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private pool: Particle[] = [];

  constructor(poolSize: number = PARTICLE_POOL_SIZE) {
    // Initialize object pool
    for (let i = 0; i < poolSize; i++) {
      this.pool.push(new Particle(
        { x: 0, y: 0 },
        {
          lifetime: 1000,
          size: 3,
          color: '#ffffff',
          velocity: { x: 0, y: 0 },
          gravity: 0.2,
          fadeOut: true
        }
      ));
    }
  }

  public emit(type: ParticleType, position: Position, count: number = 10, color?: string): void {
    for (let i = 0; i < count; i++) {
      const particle = this.getParticleFromPool();
      if (!particle) break;

      const config = this.getParticleConfig(type, color);
      particle.reset(position, config);
      this.particles.push(particle);
    }
  }

  public emitSuccess(position: Position, color: string = '#22c55e'): void {
    this.emit(ParticleType.SUCCESS, position, 15, color);
  }

  public emitExplosion(position: Position, color: string = '#ef4444'): void {
    this.emit(ParticleType.EXPLOSION, position, 25, color);
  }

  public emitSparkle(position: Position, color: string = '#ffd700'): void {
    this.emit(ParticleType.SPARKLE, position, 8, color);
  }

  public emitTrail(position: Position, color: string = '#3b82f6'): void {
    this.emit(ParticleType.TRAIL, position, 3, color);
  }

  public emitCombo(position: Position, tier: number): void {
    const colors = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#ffd700'];
    const color = colors[Math.min(tier, colors.length - 1)];
    const count = Math.min(5 + tier * 3, 30);
    this.emit(ParticleType.COMBO, position, count, color);
  }

  public update(deltaTime: number): void {
    // Update all active particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update(deltaTime);

      // Remove dead particles and return to pool
      if (!particle.isActive) {
        this.particles.splice(i, 1);
        this.returnParticleToPool(particle);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(particle => {
      particle.render(ctx);
    });
  }

  public clear(): void {
    // Return all particles to pool
    this.particles.forEach(particle => {
      this.returnParticleToPool(particle);
    });
    this.particles = [];
  }

  private getParticleFromPool(): Particle | null {
    return this.pool.pop() || null;
  }

  private returnParticleToPool(particle: Particle): void {
    if (this.pool.length < PARTICLE_POOL_SIZE) {
      this.pool.push(particle);
    }
  }

  private getParticleConfig(type: ParticleType, color?: string): ParticleConfig {
    switch (type) {
      case ParticleType.SUCCESS:
        return {
          lifetime: 1000,
          size: Math.random() * 4 + 2,
          color: color || '#22c55e',
          velocity: {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8 - 3
          },
          gravity: 0.15,
          fadeOut: true
        };

      case ParticleType.EXPLOSION:
        return {
          lifetime: 800,
          size: Math.random() * 6 + 3,
          color: color || '#ef4444',
          velocity: {
            x: (Math.random() - 0.5) * 12,
            y: (Math.random() - 0.5) * 12
          },
          gravity: 0.1,
          fadeOut: true
        };

      case ParticleType.SPARKLE:
        return {
          lifetime: 1500,
          size: Math.random() * 3 + 1,
          color: color || '#ffd700',
          velocity: {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4 - 2
          },
          gravity: 0.05,
          fadeOut: true
        };

      case ParticleType.TRAIL:
        return {
          lifetime: 500,
          size: Math.random() * 2 + 1,
          color: color || '#3b82f6',
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: Math.random() * 2 + 1
          },
          gravity: 0.02,
          fadeOut: true
        };

      case ParticleType.COMBO:
        return {
          lifetime: 2000,
          size: Math.random() * 5 + 2,
          color: color || '#ffd700',
          velocity: {
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 10 - 5
          },
          gravity: 0.08,
          fadeOut: true
        };

      default:
        return {
          lifetime: 1000,
          size: 3,
          color: '#ffffff',
          velocity: { x: 0, y: 0 },
          gravity: 0.1,
          fadeOut: true
        };
    }
  }

  public getActiveParticleCount(): number {
    return this.particles.length;
  }

  public getPoolSize(): number {
    return this.pool.length;
  }
}