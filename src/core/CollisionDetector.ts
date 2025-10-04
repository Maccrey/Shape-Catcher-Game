import { Shape } from '../game/entities/Shape';
import { Catcher } from '../game/entities/Catcher';
import { ShapeType, ShapeColor, SpecialShapeType } from '../types/shape.types';
import { COLLISION_BUFFER } from '../config/constants';

export interface CollisionResult {
  hasCollision: boolean;
  isMatch: boolean;
  shape: Shape;
  catcher: Catcher;
}

export class CollisionDetector {
  public static checkCollision(shape: Shape, catcher: Catcher): CollisionResult {
    const shapeBounds = shape.getBounds();
    const catcherBounds = catcher.getBounds();

    // AABB collision detection
    const hasCollision = !(
      shapeBounds.right < catcherBounds.left - COLLISION_BUFFER ||
      shapeBounds.left > catcherBounds.right + COLLISION_BUFFER ||
      shapeBounds.bottom < catcherBounds.top - COLLISION_BUFFER ||
      shapeBounds.top > catcherBounds.bottom + COLLISION_BUFFER
    );

    const isMatch = hasCollision ? this.isMatch(shape, catcher) : false;

    return {
      hasCollision,
      isMatch,
      shape,
      catcher
    };
  }

  public static isMatch(shape: Shape, catcher: Catcher): boolean {
    // Special shapes have different matching rules
    if (shape.isSpecialShape()) {
      return this.isSpecialShapeMatch(shape, catcher);
    }

    // Regular shapes need exact match (shape + color)
    return (
      shape.type === catcher.currentShape &&
      shape.color === catcher.currentColor
    );
  }

  private static isSpecialShapeMatch(shape: Shape, catcher: Catcher): boolean {
    const specialType = shape.getSpecialType();

    switch (specialType) {
      case SpecialShapeType.DIAMOND:
        // Diamond: only color needs to match
        return shape.color === catcher.currentColor;

      case SpecialShapeType.RAINBOW:
        // Rainbow: only shape needs to match
        return shape.type === catcher.currentShape;

      case SpecialShapeType.GOLDEN_STAR:
        // Golden Star: exact match required
        return (
          shape.color === catcher.currentColor &&
          catcher.currentShape === ShapeType.STAR
        );

      case SpecialShapeType.BOMB:
        // Bomb: always triggers (negative effect)
        return true;

      case SpecialShapeType.TIME_BONUS:
        // Time Bonus: any match triggers
        return true;

      case SpecialShapeType.MULTIPLIER:
        // Multiplier: any match triggers
        return true;

      default:
        return false;
    }
  }

  public static calculateScoreMultiplier(shape: Shape): number {
    if (!shape.isSpecialShape()) {
      return 1.0;
    }

    const specialType = shape.getSpecialType();

    switch (specialType) {
      case SpecialShapeType.DIAMOND:
        return 2.0; // 2x points

      case SpecialShapeType.RAINBOW:
        return 1.5; // 1.5x points

      case SpecialShapeType.GOLDEN_STAR:
        return 3.0; // 3x points

      case SpecialShapeType.TIME_BONUS:
        return 1.0; // Normal points + time bonus

      case SpecialShapeType.MULTIPLIER:
        return 1.0; // Normal points + multiplier effect

      case SpecialShapeType.BOMB:
        return -1.0; // Negative points

      default:
        return 1.0;
    }
  }

  public static getCollisionPriority(shape: Shape): number {
    // Higher priority values are processed first
    if (!shape.isSpecialShape()) {
      return 1;
    }

    const specialType = shape.getSpecialType();

    switch (specialType) {
      case SpecialShapeType.BOMB:
        return 10; // Highest priority - process bombs first

      case SpecialShapeType.GOLDEN_STAR:
        return 8;

      case SpecialShapeType.TIME_BONUS:
      case SpecialShapeType.MULTIPLIER:
        return 6;

      case SpecialShapeType.DIAMOND:
      case SpecialShapeType.RAINBOW:
        return 4;

      default:
        return 1;
    }
  }

  public static getEffectiveDistance(shape: Shape, catcher: Catcher): number {
    const shapeBounds = shape.getBounds();
    const catcherBounds = catcher.getBounds();

    const centerDistance = Math.sqrt(
      Math.pow(shape.position.x - catcher.position.x, 2) +
      Math.pow(shape.position.y - catcher.position.y, 2)
    );

    return centerDistance;
  }

  public static isNearCollision(shape: Shape, catcher: Catcher, threshold: number = 50): boolean {
    const distance = this.getEffectiveDistance(shape, catcher);
    return distance <= threshold;
  }
}