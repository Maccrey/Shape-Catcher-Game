import React, { useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * Debounce function to limit rapid function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function execution frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Custom hook for RAF-based animation loop
 */
export function useAnimationFrame(callback: (deltaTime: number) => void, deps: any[] = []) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, ...deps]);
}

/**
 * Object pooling for frequently created/destroyed objects
 */
export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;
  private maxSize: number;

  constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize: number = 10, maxSize: number = 100) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;

    // Pre-allocate objects
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }

  public acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.createFn();
  }

  public release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }

  public clear(): void {
    this.pool = [];
  }

  public getSize(): number {
    return this.pool.length;
  }
}

/**
 * Memoized selector for complex computations
 */
export function createMemoizedSelector<T, R>(
  selector: (state: T) => R,
  comparator: (a: R, b: R) => boolean = (a, b) => a === b
) {
  let lastState: T | undefined;
  let lastResult: R | undefined;

  return (state: T): R => {
    if (lastState === undefined || !comparator(selector(state), lastResult!)) {
      lastState = state;
      lastResult = selector(state);
    }
    return lastResult!;
  };
}

/**
 * Dirty rectangle tracking for canvas optimization
 */
export class DirtyRectTracker {
  private dirtyRects: Set<string> = new Set();
  private regionSize: number;

  constructor(regionSize: number = 50) {
    this.regionSize = regionSize;
  }

  public markDirty(x: number, y: number, width: number, height: number): void {
    const startX = Math.floor(x / this.regionSize);
    const startY = Math.floor(y / this.regionSize);
    const endX = Math.floor((x + width) / this.regionSize);
    const endY = Math.floor((y + height) / this.regionSize);

    for (let rx = startX; rx <= endX; rx++) {
      for (let ry = startY; ry <= endY; ry++) {
        this.dirtyRects.add(`${rx},${ry}`);
      }
    }
  }

  public isDirty(x: number, y: number): boolean {
    const rx = Math.floor(x / this.regionSize);
    const ry = Math.floor(y / this.regionSize);
    return this.dirtyRects.has(`${rx},${ry}`);
  }

  public clear(): void {
    this.dirtyRects.clear();
  }

  public getDirtyRegions(): { x: number; y: number; width: number; height: number }[] {
    const regions: { x: number; y: number; width: number; height: number }[] = [];

    this.dirtyRects.forEach(key => {
      const [rx, ry] = key.split(',').map(Number);
      regions.push({
        x: rx * this.regionSize,
        y: ry * this.regionSize,
        width: this.regionSize,
        height: this.regionSize
      });
    });

    return regions;
  }
}

/**
 * Performance monitor for FPS tracking
 */
export class PerformanceMonitor {
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private fps: number = 60;
  private fpsHistory: number[] = [];
  private readonly historySize: number = 60;

  public update(): void {
    this.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;

    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.fpsHistory.push(this.fps);

      if (this.fpsHistory.length > this.historySize) {
        this.fpsHistory.shift();
      }

      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  public getFPS(): number {
    return this.fps;
  }

  public getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.fpsHistory.length);
  }

  public getMinFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    return Math.min(...this.fpsHistory);
  }

  public reset(): void {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.fpsHistory = [];
  }
}

/**
 * Lazy loading utility for code splitting
 */
export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  return {
    Component: React.lazy(importFunc),
    fallback
  };
}

/**
 * Batch state updates for performance
 */
export class BatchUpdater {
  private updates: Map<string, any> = new Map();
  private scheduledUpdate: number | null = null;
  private callback: (updates: Map<string, any>) => void;

  constructor(callback: (updates: Map<string, any>) => void) {
    this.callback = callback;
  }

  public add(key: string, value: any): void {
    this.updates.set(key, value);

    if (!this.scheduledUpdate) {
      this.scheduledUpdate = requestAnimationFrame(() => {
        this.flush();
      });
    }
  }

  public flush(): void {
    if (this.updates.size > 0) {
      this.callback(new Map(this.updates));
      this.updates.clear();
    }
    this.scheduledUpdate = null;
  }

  public clear(): void {
    if (this.scheduledUpdate) {
      cancelAnimationFrame(this.scheduledUpdate);
      this.scheduledUpdate = null;
    }
    this.updates.clear();
  }
}
