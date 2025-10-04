/**
 * Performance Benchmarking Utility
 *
 * Monitors and reports game performance metrics:
 * - FPS (Frames Per Second)
 * - Frame time
 * - Memory usage
 * - Canvas render time
 */

export interface PerformanceMetrics {
  fps: number;
  avgFrameTime: number;
  minFps: number;
  maxFps: number;
  memoryUsage?: number;
  renderTime: number;
  updateTime: number;
}

export class PerformanceBenchmark {
  private frameTimes: number[] = [];
  private fpsHistory: number[] = [];
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private startTime: number = 0;
  private renderStartTime: number = 0;
  private updateStartTime: number = 0;
  private renderTime: number = 0;
  private updateTime: number = 0;

  private readonly MAX_SAMPLES = 60; // Keep last 60 frames

  constructor() {
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
  }

  /**
   * Call at the start of each frame
   */
  public startFrame(): void {
    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;

    this.frameTimes.push(deltaTime);
    if (this.frameTimes.length > this.MAX_SAMPLES) {
      this.frameTimes.shift();
    }

    const fps = deltaTime > 0 ? 1000 / deltaTime : 60;
    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > this.MAX_SAMPLES) {
      this.fpsHistory.shift();
    }

    this.lastFrameTime = now;
    this.frameCount++;
  }

  /**
   * Call at the start of update cycle
   */
  public startUpdate(): void {
    this.updateStartTime = performance.now();
  }

  /**
   * Call at the end of update cycle
   */
  public endUpdate(): void {
    this.updateTime = performance.now() - this.updateStartTime;
  }

  /**
   * Call at the start of render cycle
   */
  public startRender(): void {
    this.renderStartTime = performance.now();
  }

  /**
   * Call at the end of render cycle
   */
  public endRender(): void {
    this.renderTime = performance.now() - this.renderStartTime;
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    const avgFrameTime = this.frameTimes.length > 0
      ? this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
      : 16.67; // Default to 60fps

    const currentFps = this.fpsHistory.length > 0
      ? this.fpsHistory[this.fpsHistory.length - 1]
      : 60;

    const minFps = this.fpsHistory.length > 0
      ? Math.min(...this.fpsHistory)
      : 60;

    const maxFps = this.fpsHistory.length > 0
      ? Math.max(...this.fpsHistory)
      : 60;

    const memoryUsage = this.getMemoryUsage();

    return {
      fps: Math.round(currentFps),
      avgFrameTime: Math.round(avgFrameTime * 100) / 100,
      minFps: Math.round(minFps),
      maxFps: Math.round(maxFps),
      memoryUsage,
      renderTime: Math.round(this.renderTime * 100) / 100,
      updateTime: Math.round(this.updateTime * 100) / 100
    };
  }

  /**
   * Get memory usage if available
   */
  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      // Return used memory in MB
      return Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100;
    }
    return undefined;
  }

  /**
   * Check if performance meets target
   */
  public meetsTarget(targetFps: number = 60, minAcceptable: number = 30): boolean {
    const metrics = this.getMetrics();
    return metrics.minFps >= minAcceptable && metrics.fps >= targetFps * 0.9;
  }

  /**
   * Get performance grade
   */
  public getGrade(): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
    const metrics = this.getMetrics();

    if (metrics.minFps >= 58 && metrics.fps >= 60) {
      return 'Excellent'; // Solid 60fps
    } else if (metrics.minFps >= 50 && metrics.fps >= 55) {
      return 'Good'; // Mostly 60fps with minor drops
    } else if (metrics.minFps >= 30 && metrics.fps >= 45) {
      return 'Fair'; // Playable but noticeable drops
    } else {
      return 'Poor'; // Below 30fps
    }
  }

  /**
   * Generate performance report
   */
  public generateReport(): string {
    const metrics = this.getMetrics();
    const grade = this.getGrade();
    const runtime = Math.round((performance.now() - this.startTime) / 1000);

    let report = `
=== Performance Report ===
Runtime: ${runtime}s
Frame Count: ${this.frameCount}

FPS Metrics:
- Current FPS: ${metrics.fps}
- Min FPS: ${metrics.minFps}
- Max FPS: ${metrics.maxFps}
- Avg Frame Time: ${metrics.avgFrameTime}ms

Timing Breakdown:
- Update Time: ${metrics.updateTime}ms
- Render Time: ${metrics.renderTime}ms
- Total Frame Budget: ${metrics.avgFrameTime}ms / 16.67ms (60fps)
`;

    if (metrics.memoryUsage !== undefined) {
      report += `\nMemory Usage: ${metrics.memoryUsage}MB`;
    }

    report += `\n\nPerformance Grade: ${grade}`;

    // Add recommendations
    if (grade === 'Poor' || grade === 'Fair') {
      report += '\n\nRecommendations:';
      if (metrics.renderTime > 10) {
        report += '\n- Render time is high. Consider optimizing canvas operations.';
      }
      if (metrics.updateTime > 5) {
        report += '\n- Update time is high. Consider optimizing game logic.';
      }
      if (metrics.memoryUsage && metrics.memoryUsage > 100) {
        report += '\n- Memory usage is high. Check for memory leaks.';
      }
    }

    return report;
  }

  /**
   * Reset all metrics
   */
  public reset(): void {
    this.frameTimes = [];
    this.fpsHistory = [];
    this.frameCount = 0;
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
  }
}

/**
 * Singleton instance for global access
 */
let benchmarkInstance: PerformanceBenchmark | null = null;

export function getPerformanceBenchmark(): PerformanceBenchmark {
  if (!benchmarkInstance) {
    benchmarkInstance = new PerformanceBenchmark();
  }
  return benchmarkInstance;
}

/**
 * Performance monitoring component for debugging
 */
export function logPerformanceMetrics(): void {
  const benchmark = getPerformanceBenchmark();
  const metrics = benchmark.getMetrics();

  console.log('Performance:', {
    fps: metrics.fps,
    frameTime: metrics.avgFrameTime + 'ms',
    render: metrics.renderTime + 'ms',
    update: metrics.updateTime + 'ms',
    memory: metrics.memoryUsage ? metrics.memoryUsage + 'MB' : 'N/A'
  });
}
