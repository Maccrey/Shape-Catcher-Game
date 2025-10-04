import { Shape } from '../game/entities/Shape';
import { Catcher } from '../game/entities/Catcher';
import { ShapeType, ShapeColor, SpecialShapeType } from '../types/shape.types';
import { COLLISION_BUFFER } from '../config/constants';

/**
 * Result of a collision check between a shape and catcher
 */
export interface CollisionResult {
  /** Whether a physical collision occurred */
  hasCollision: boolean;
  /** Whether the shape matches the catcher's configuration */
  isMatch: boolean;
  /** The shape involved in the collision */
  shape: Shape;
  /** The catcher involved in the collision */
  catcher: Catcher;
}

/**
 * CollisionDetector - Handles collision detection and matching logic
 *
 * Uses Axis-Aligned Bounding Box (AABB) algorithm for efficient collision detection.
 * Implements special matching rules for different shape types:
 * - Regular shapes: Exact shape + color match required
 * - Diamond: Only color match required (2x score)
 * - Rainbow: Only shape match required (1.5x score)
 * - Golden Star: Exact match required (3x score)
 * - Bomb: Always triggers on collision (negative effect)
 */
export class CollisionDetector {
  /**
   * Checks for collision between a shape and the catcher
   * Uses AABB (Axis-Aligned Bounding Box) algorithm with configurable buffer
   *
   * @param shape - The falling shape to check
   * @param catcher - The player's catcher
   * @returns CollisionResult containing collision status and match validity
   */
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

  /**
   * Determines if a shape matches the catcher's current configuration
   * Applies different rules for special shapes
   *
   * @param shape - The shape to check
   * @param catcher - The catcher to match against
   * @returns true if the shape matches, false otherwise
   */
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

  /**
   * Applies special matching rules for non-regular shapes
   * Each special shape type has unique matching criteria
   *
   * @param shape - The special shape to check
   * @param catcher - The catcher to match against
   * @returns true if the special shape's criteria are met
   * @private
   */
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