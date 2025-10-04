import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config/constants';

export class DoubleBuffer {
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;
  private mainCtx: CanvasRenderingContext2D;

  constructor(mainContext: CanvasRenderingContext2D) {
    this.mainCtx = mainContext;

    // Create offscreen canvas
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = CANVAS_WIDTH;
    this.offscreenCanvas.height = CANVAS_HEIGHT;

    const ctx = this.offscreenCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to create offscreen canvas context');
    }

    this.offscreenCtx = ctx;

    // Copy rendering settings from main context
    this.offscreenCtx.imageSmoothingEnabled = true;
    this.offscreenCtx.imageSmoothingQuality = 'high';
    this.offscreenCtx.textBaseline = 'middle';
    this.offscreenCtx.textAlign = 'center';
  }

  getOffscreenContext(): CanvasRenderingContext2D {
    return this.offscreenCtx;
  }

  clear(): void {
    this.offscreenCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  present(): void {
    // Copy offscreen buffer to main canvas
    this.mainCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.mainCtx.drawImage(this.offscreenCanvas, 0, 0);
  }
}