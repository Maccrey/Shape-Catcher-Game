export interface CameraShake {
  duration: number;
  intensity: number;
  startTime: number;
}

export class CameraController {
  private shakeEffects: CameraShake[] = [];
  private offsetX: number = 0;
  private offsetY: number = 0;

  public shake(duration: number = 300, intensity: number = 5): void {
    const shake: CameraShake = {
      duration,
      intensity,
      startTime: Date.now()
    };

    this.shakeEffects.push(shake);
  }

  public update(deltaTime: number): void {
    const now = Date.now();
    this.offsetX = 0;
    this.offsetY = 0;

    // Remove completed shake effects
    this.shakeEffects = this.shakeEffects.filter(shake => {
      const elapsed = now - shake.startTime;
      return elapsed < shake.duration;
    });

    // Apply active shake effects
    for (const shake of this.shakeEffects) {
      const elapsed = now - shake.startTime;
      const progress = elapsed / shake.duration;

      // Decay intensity over time
      const currentIntensity = shake.intensity * (1 - progress);

      // Random shake offset
      this.offsetX += (Math.random() - 0.5) * currentIntensity * 2;
      this.offsetY += (Math.random() - 0.5) * currentIntensity * 2;
    }
  }

  public getOffset(): { x: number; y: number } {
    return {
      x: this.offsetX,
      y: this.offsetY
    };
  }

  public hasActiveShake(): boolean {
    return this.shakeEffects.length > 0;
  }

  public clear(): void {
    this.shakeEffects = [];
    this.offsetX = 0;
    this.offsetY = 0;
  }

  // Screen flash effect
  private flashAlpha: number = 0;
  private flashDuration: number = 0;
  private flashStartTime: number = 0;

  public flash(duration: number = 200, alpha: number = 0.5): void {
    this.flashAlpha = alpha;
    this.flashDuration = duration;
    this.flashStartTime = Date.now();
  }

  public getFlashAlpha(): number {
    if (this.flashDuration === 0) return 0;

    const elapsed = Date.now() - this.flashStartTime;
    if (elapsed >= this.flashDuration) {
      this.flashDuration = 0;
      return 0;
    }

    const progress = elapsed / this.flashDuration;
    return this.flashAlpha * (1 - progress);
  }
}
