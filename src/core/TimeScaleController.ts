export interface TimeScaleEffect {
  scale: number;
  duration: number;
  startTime: number;
  priority: number;
}

export class TimeScaleController {
  private effects: TimeScaleEffect[] = [];
  private currentScale: number = 1.0;

  public setTimeScale(scale: number, duration: number, priority: number = 0): void {
    const effect: TimeScaleEffect = {
      scale,
      duration,
      startTime: Date.now(),
      priority
    };

    this.effects.push(effect);
    this.updateCurrentScale();
  }

  public slowMotion(duration: number = 1000, scale: number = 0.5): void {
    this.setTimeScale(scale, duration, 10);
  }

  public update(deltaTime: number): void {
    const now = Date.now();

    // Remove expired effects
    this.effects = this.effects.filter(effect => {
      const elapsed = now - effect.startTime;
      return elapsed < effect.duration;
    });

    this.updateCurrentScale();
  }

  private updateCurrentScale(): void {
    if (this.effects.length === 0) {
      this.currentScale = 1.0;
      return;
    }

    // Use the effect with highest priority
    const sortedEffects = [...this.effects].sort((a, b) => b.priority - a.priority);
    this.currentScale = sortedEffects[0].scale;
  }

  public getCurrentScale(): number {
    return this.currentScale;
  }

  public hasActiveEffects(): boolean {
    return this.effects.length > 0;
  }

  public clear(): void {
    this.effects = [];
    this.currentScale = 1.0;
  }

  public reset(): void {
    this.clear();
  }
}
