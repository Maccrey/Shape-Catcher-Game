import { DirtyRectTracker } from './performanceOptimization';

/**
 * Optimized Canvas Renderer with dirty rectangle and layer management
 */
export class OptimizedCanvasRenderer {
  private mainCanvas: HTMLCanvasElement;
  private mainCtx: CanvasRenderingContext2D;
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;
  private dirtyTracker: DirtyRectTracker;
  private layers: Map<string, HTMLCanvasElement> = new Map();
  private useDirtyRect: boolean;

  constructor(canvas: HTMLCanvasElement, useDirtyRect: boolean = true) {
    this.mainCanvas = canvas;
    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true
    });

    if (!ctx) {
      throw new Error('Could not get canvas 2D context');
    }

    this.mainCtx = ctx;
    this.useDirtyRect = useDirtyRect;
    this.dirtyTracker = new DirtyRectTracker(50);

    // Create offscreen canvas for double buffering
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = canvas.width;
    this.offscreenCanvas.height = canvas.height;

    const offCtx = this.offscreenCanvas.getContext('2d', { alpha: false });
    if (!offCtx) {
      throw new Error('Could not create offscreen context');
    }

    this.offscreenCtx = offCtx;
  }

  /**
   * Create a separate layer for static content
   */
  public createLayer(name: string, width?: number, height?: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width || this.mainCanvas.width;
    canvas.height = height || this.mainCanvas.height;
    this.layers.set(name, canvas);
    return canvas;
  }

  /**
   * Get a layer canvas
   */
  public getLayer(name: string): HTMLCanvasElement | undefined {
    return this.layers.get(name);
  }

  /**
   * Clear a specific region
   */
  public clearRegion(x: number, y: number, width: number, height: number): void {
    this.offscreenCtx.clearRect(x, y, width, height);
    if (this.useDirtyRect) {
      this.dirtyTracker.markDirty(x, y, width, height);
    }
  }

  /**
   * Clear entire canvas
   */
  public clear(): void {
    this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
    if (this.useDirtyRect) {
      this.dirtyTracker.markDirty(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
    }
  }

  /**
   * Draw to offscreen buffer
   */
  public draw(drawFunc: (ctx: CanvasRenderingContext2D) => void): void {
    drawFunc(this.offscreenCtx);
  }

  /**
   * Draw with dirty rectangle tracking
   */
  public drawWithDirtyRect(
    x: number,
    y: number,
    width: number,
    height: number,
    drawFunc: (ctx: CanvasRenderingContext2D) => void
  ): void {
    drawFunc(this.offscreenCtx);
    if (this.useDirtyRect) {
      this.dirtyTracker.markDirty(x, y, width, height);
    }
  }

  /**
   * Composite layers onto offscreen canvas
   */
  public compositeLayer(layerName: string, x: number = 0, y: number = 0): void {
    const layer = this.layers.get(layerName);
    if (layer) {
      this.offscreenCtx.drawImage(layer, x, y);
      if (this.useDirtyRect) {
        this.dirtyTracker.markDirty(x, y, layer.width, layer.height);
      }
    }
  }

  /**
   * Present the offscreen buffer to the main canvas
   */
  public present(): void {
    if (this.useDirtyRect) {
      // Only redraw dirty regions
      const dirtyRegions = this.dirtyTracker.getDirtyRegions();

      if (dirtyRegions.length === 0) {
        return; // Nothing to update
      }

      dirtyRegions.forEach(region => {
        this.mainCtx.drawImage(
          this.offscreenCanvas,
          region.x,
          region.y,
          region.width,
          region.height,
          region.x,
          region.y,
          region.width,
          region.height
        );
      });

      this.dirtyTracker.clear();
    } else {
      // Full screen blit
      this.mainCtx.drawImage(this.offscreenCanvas, 0, 0);
    }
  }

  /**
   * Batch draw multiple objects
   */
  public batchDraw(
    objects: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      draw: (ctx: CanvasRenderingContext2D) => void;
    }>
  ): void {
    // Sort objects by y-coordinate for painter's algorithm
    objects.sort((a, b) => a.y - b.y);

    objects.forEach(obj => {
      this.offscreenCtx.save();
      this.offscreenCtx.translate(obj.x, obj.y);
      obj.draw(this.offscreenCtx);
      this.offscreenCtx.restore();

      if (this.useDirtyRect) {
        this.dirtyTracker.markDirty(obj.x, obj.y, obj.width, obj.height);
      }
    });
  }

  /**
   * Enable/disable dirty rectangle optimization
   */
  public setDirtyRectEnabled(enabled: boolean): void {
    this.useDirtyRect = enabled;
  }

  /**
   * Resize canvases
   */
  public resize(width: number, height: number): void {
    this.mainCanvas.width = width;
    this.mainCanvas.height = height;
    this.offscreenCanvas.width = width;
    this.offscreenCanvas.height = height;

    // Resize layers
    this.layers.forEach((canvas, name) => {
      canvas.width = width;
      canvas.height = height;
    });
  }

  /**
   * Get the rendering context
   */
  public getContext(): CanvasRenderingContext2D {
    return this.offscreenCtx;
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.layers.clear();
    this.dirtyTracker.clear();
  }
}

/**
 * Canvas sprite batching for improved performance
 */
export class SpriteBatcher {
  private ctx: CanvasRenderingContext2D;
  private sprites: Array<{
    image: HTMLImageElement | HTMLCanvasElement;
    sx: number;
    sy: number;
    sw: number;
    sh: number;
    dx: number;
    dy: number;
    dw: number;
    dh: number;
  }> = [];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public add(
    image: HTMLImageElement | HTMLCanvasElement,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void {
    this.sprites.push({ image, sx, sy, sw, sh, dx, dy, dw, dh });
  }

  public flush(): void {
    // Group sprites by image for batching
    const batches = new Map<HTMLImageElement | HTMLCanvasElement, typeof this.sprites>();

    this.sprites.forEach(sprite => {
      if (!batches.has(sprite.image)) {
        batches.set(sprite.image, []);
      }
      batches.get(sprite.image)!.push(sprite);
    });

    // Draw each batch
    batches.forEach(batch => {
      batch.forEach(sprite => {
        this.ctx.drawImage(
          sprite.image,
          sprite.sx,
          sprite.sy,
          sprite.sw,
          sprite.sh,
          sprite.dx,
          sprite.dy,
          sprite.dw,
          sprite.dh
        );
      });
    });

    this.sprites = [];
  }

  public clear(): void {
    this.sprites = [];
  }
}
