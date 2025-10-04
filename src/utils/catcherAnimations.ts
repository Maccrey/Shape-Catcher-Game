import { Catcher } from '../game/entities/Catcher';

export interface CatcherAnimation {
  type: 'bounce' | 'shake' | 'flash' | 'transform';
  duration: number;
  startTime: number;
  easing?: (t: number) => number;
}

export class CatcherAnimationController {
  private animations: CatcherAnimation[] = [];
  private offsetX: number = 0;
  private offsetY: number = 0;
  private scale: number = 1;
  private flashAlpha: number = 0;

  public addBounceAnimation(): void {
    this.animations.push({
      type: 'bounce',
      duration: 0.3,
      startTime: Date.now(),
      easing: this.easeOutBounce
    });
  }

  public addShakeAnimation(): void {
    this.animations.push({
      type: 'shake',
      duration: 0.5,
      startTime: Date.now()
    });
  }

  public addFlashAnimation(): void {
    this.animations.push({
      type: 'flash',
      duration: 0.2,
      startTime: Date.now()
    });
  }

  public addTransformAnimation(): void {
    this.animations.push({
      type: 'transform',
      duration: 0.25,
      startTime: Date.now(),
      easing: this.easeOutQuad
    });
  }

  public update(deltaTime: number): void {
    const now = Date.now();
    this.offsetX = 0;
    this.offsetY = 0;
    this.scale = 1;
    this.flashAlpha = 0;

    // Remove completed animations
    this.animations = this.animations.filter(anim => {
      const elapsed = (now - anim.startTime) / 1000;
      return elapsed < anim.duration;
    });

    // Apply active animations
    for (const anim of this.animations) {
      const elapsed = (now - anim.startTime) / 1000;
      const progress = Math.min(elapsed / anim.duration, 1);
      const easedProgress = anim.easing ? anim.easing(progress) : progress;

      switch (anim.type) {
        case 'bounce':
          this.applyBounce(easedProgress);
          break;
        case 'shake':
          this.applyShake(progress);
          break;
        case 'flash':
          this.applyFlash(progress);
          break;
        case 'transform':
          this.applyTransform(easedProgress);
          break;
      }
    }
  }

  public getOffsets(): { x: number; y: number; scale: number; flashAlpha: number } {
    return {
      x: this.offsetX,
      y: this.offsetY,
      scale: this.scale,
      flashAlpha: this.flashAlpha
    };
  }

  public hasActiveAnimations(): boolean {
    return this.animations.length > 0;
  }

  public clear(): void {
    this.animations = [];
    this.offsetX = 0;
    this.offsetY = 0;
    this.scale = 1;
    this.flashAlpha = 0;
  }

  private applyBounce(progress: number): void {
    // Bounce up and down
    const bounceHeight = 15;
    this.offsetY -= Math.sin(progress * Math.PI) * bounceHeight;
  }

  private applyShake(progress: number): void {
    // Shake left and right
    const shakeIntensity = 5 * (1 - progress); // Decrease intensity over time
    this.offsetX += (Math.random() - 0.5) * shakeIntensity * 2;
    this.offsetY += (Math.random() - 0.5) * shakeIntensity;
  }

  private applyFlash(progress: number): void {
    // Flash white
    this.flashAlpha = Math.sin(progress * Math.PI) * 0.7;
  }

  private applyTransform(progress: number): void {
    // Scale animation (pulse)
    const scaleAmount = 0.2;
    this.scale += Math.sin(progress * Math.PI) * scaleAmount;
  }

  private easeOutBounce(t: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }

  private easeOutQuad(t: number): number {
    return 1 - (1 - t) * (1 - t);
  }

  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
}

export function renderCatcherWithAnimation(
  ctx: CanvasRenderingContext2D,
  catcher: Catcher,
  animationController: CatcherAnimationController,
  drawCatcherFn: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    shapeType: any,
    color: any,
    isStunned: boolean
  ) => void
): void {
  const offsets = animationController.getOffsets();

  ctx.save();

  // Apply scale transformation
  if (offsets.scale !== 1) {
    ctx.translate(catcher.position.x, catcher.position.y);
    ctx.scale(offsets.scale, offsets.scale);
    ctx.translate(-catcher.position.x, -catcher.position.y);
  }

  // Draw the catcher with offsets
  drawCatcherFn(
    ctx,
    catcher.position.x + offsets.x,
    catcher.position.y + offsets.y,
    catcher.size,
    50, // Height (CATCHER_HEIGHT constant)
    catcher.currentShape,
    catcher.currentColor,
    catcher.isStunned()
  );

  // Apply flash effect
  if (offsets.flashAlpha > 0) {
    ctx.globalAlpha = offsets.flashAlpha;
    ctx.fillStyle = '#ffffff';
    const bounds = catcher.getBounds();
    ctx.fillRect(
      bounds.left + offsets.x,
      bounds.top + offsets.y,
      bounds.right - bounds.left,
      bounds.bottom - bounds.top
    );
  }

  ctx.restore();
}
