import { FPS, FRAME_TIME } from '../config/constants';

export type GameLoopCallback = (deltaTime: number) => void;

export class GameLoop {
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private currentTime: number = 0;

  private updateCallback?: GameLoopCallback;
  private renderCallback?: GameLoopCallback;

  constructor(
    updateCallback?: GameLoopCallback,
    renderCallback?: GameLoopCallback
  ) {
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
  }

  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.loop();
  }

  public stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.isPaused = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public pause(): void {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
  }

  public resume(): void {
    if (!this.isRunning || !this.isPaused) return;
    this.isPaused = false;
    this.lastTime = performance.now();
  }

  public setUpdateCallback(callback: GameLoopCallback): void {
    this.updateCallback = callback;
  }

  public setRenderCallback(callback: GameLoopCallback): void {
    this.renderCallback = callback;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  private loop = (): void => {
    if (!this.isRunning) return;

    this.currentTime = performance.now();
    const frameTime = this.currentTime - this.lastTime;
    this.lastTime = this.currentTime;

    if (!this.isPaused) {
      // Accumulate time for fixed timestep
      this.accumulator += frameTime;

      // Update with fixed timestep
      while (this.accumulator >= FRAME_TIME) {
        if (this.updateCallback) {
          this.updateCallback(FRAME_TIME / 1000); // Convert to seconds
        }
        this.accumulator -= FRAME_TIME;
      }

      // Render with interpolation factor
      const interpolation = this.accumulator / FRAME_TIME;
      if (this.renderCallback) {
        this.renderCallback(interpolation);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}