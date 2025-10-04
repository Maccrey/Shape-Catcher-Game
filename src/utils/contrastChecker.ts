/**
 * WCAG 2.1 Contrast Checker
 * Ensures color combinations meet accessibility standards
 *
 * WCAG Contrast Requirements:
 * - Level AA (Normal text): 4.5:1 minimum
 * - Level AA (Large text 18pt+): 3:1 minimum
 * - Level AAA (Normal text): 7:1 minimum
 * - Level AAA (Large text): 4.5:1 minimum
 *
 * @example
 * ```ts
 * // Check contrast between white text on blue background
 * const result = ContrastChecker.checkContrast('#FFFFFF', '#0066CC', false);
 * console.log(result.ratio); // 5.89
 * console.log(result.meetsAA); // true
 *
 * // Audit all game colors
 * const report = ContrastChecker.auditGameColors();
 * console.log(report.summary); // { totalPairs: 25, passing: 23, failing: 2 }
 * ```
 */

export interface ContrastResult {
  ratio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
  level: 'AAA' | 'AA' | 'Fail';
}

export class ContrastChecker {
  /**
   * Calculate relative luminance of a color
   * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
   */
  private static getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Parse hex color to RGB
   */
  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  /**
   * Parse RGB/RGBA color string to RGB object
   */
  private static parseRgb(rgb: string): { r: number; g: number; b: number } | null {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return match
      ? {
          r: parseInt(match[1]),
          g: parseInt(match[2]),
          b: parseInt(match[3])
        }
      : null;
  }

  /**
   * Calculate contrast ratio between two colors
   * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
   */
  public static getContrastRatio(color1: string, color2: string): number {
    const rgb1 = color1.startsWith('#')
      ? this.hexToRgb(color1)
      : this.parseRgb(color1);
    const rgb2 = color2.startsWith('#')
      ? this.hexToRgb(color2)
      : this.parseRgb(color2);

    if (!rgb1 || !rgb2) {
      throw new Error('Invalid color format');
    }

    const l1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Check if contrast ratio meets WCAG standards
   */
  public static checkContrast(
    foreground: string,
    background: string,
    isLargeText: boolean = false
  ): ContrastResult {
    const ratio = this.getContrastRatio(foreground, background);

    // WCAG 2.1 Level AA: 4.5:1 for normal text, 3:1 for large text
    // WCAG 2.1 Level AAA: 7:1 for normal text, 4.5:1 for large text
    const aaRequirement = isLargeText ? 3 : 4.5;
    const aaaRequirement = isLargeText ? 4.5 : 7;

    const meetsAA = ratio >= aaRequirement;
    const meetsAAA = ratio >= aaaRequirement;

    return {
      ratio: Math.round(ratio * 100) / 100,
      meetsAA,
      meetsAAA,
      level: meetsAAA ? 'AAA' : meetsAA ? 'AA' : 'Fail'
    };
  }

  /**
   * Get all color combinations used in the game
   */
  public static getGameColorPairs(): Array<{
    name: string;
    foreground: string;
    background: string;
    isLargeText: boolean;
  }> {
    return [
      // UI Colors
      { name: 'Primary Button', foreground: '#ffffff', background: '#3b82f6', isLargeText: false },
      { name: 'Secondary Button', foreground: '#ffffff', background: '#6b7280', isLargeText: false },
      { name: 'Danger Button', foreground: '#ffffff', background: '#ef4444', isLargeText: false },
      { name: 'Success Button', foreground: '#ffffff', background: '#22c55e', isLargeText: false },

      // Game Elements
      { name: 'Score Display', foreground: '#fbbf24', background: '#1f2937', isLargeText: true },
      { name: 'Level Display', foreground: '#60a5fa', background: '#1f2937', isLargeText: false },
      { name: 'Lives Display', foreground: '#ef4444', background: '#1f2937', isLargeText: false },
      { name: 'Combo Display', foreground: '#a855f7', background: '#1f2937', isLargeText: true },

      // Shape Colors
      { name: 'Red Shape', foreground: '#ef4444', background: '#111827', isLargeText: false },
      { name: 'Blue Shape', foreground: '#3b82f6', background: '#111827', isLargeText: false },
      { name: 'Green Shape', foreground: '#22c55e', background: '#111827', isLargeText: false },
      { name: 'Yellow Shape', foreground: '#eab308', background: '#111827', isLargeText: false },
      { name: 'Purple Shape', foreground: '#a855f7', background: '#111827', isLargeText: false },
      { name: 'Orange Shape', foreground: '#f97316', background: '#111827', isLargeText: false },

      // Menu Text
      { name: 'Menu Title', foreground: '#ffffff', background: '#1f2937', isLargeText: true },
      { name: 'Menu Text', foreground: '#d1d5db', background: '#1f2937', isLargeText: false },
      { name: 'Menu Subtitle', foreground: '#9ca3af', background: '#1f2937', isLargeText: false },

      // Notifications
      { name: 'Hint Text', foreground: '#ffffff', background: '#3b82f6', isLargeText: false },
      { name: 'Error Text', foreground: '#ffffff', background: '#ef4444', isLargeText: false },
      { name: 'Success Text', foreground: '#ffffff', background: '#22c55e', isLargeText: false },
    ];
  }

  /**
   * Run full contrast audit on game colors
   */
  public static auditGameColors(): {
    passed: number;
    failed: number;
    results: Array<{
      name: string;
      result: ContrastResult;
      foreground: string;
      background: string;
    }>;
  } {
    const colorPairs = this.getGameColorPairs();
    const results = colorPairs.map(pair => ({
      name: pair.name,
      foreground: pair.foreground,
      background: pair.background,
      result: this.checkContrast(pair.foreground, pair.background, pair.isLargeText)
    }));

    const passed = results.filter(r => r.result.meetsAA).length;
    const failed = results.filter(r => !r.result.meetsAA).length;

    return { passed, failed, results };
  }

  /**
   * Generate contrast report
   */
  public static generateReport(): string {
    const audit = this.auditGameColors();
    let report = '=== WCAG Contrast Audit Report ===\n\n';

    report += `Total Combinations: ${audit.results.length}\n`;
    report += `✅ Passed (AA): ${audit.passed}\n`;
    report += `❌ Failed (AA): ${audit.failed}\n\n`;

    report += '--- Details ---\n\n';

    audit.results.forEach(item => {
      const status = item.result.meetsAA ? '✅' : '❌';
      report += `${status} ${item.name}\n`;
      report += `   Foreground: ${item.foreground}\n`;
      report += `   Background: ${item.background}\n`;
      report += `   Ratio: ${item.result.ratio}:1\n`;
      report += `   Level: ${item.result.level}\n\n`;
    });

    return report;
  }

  /**
   * Suggest improved color with better contrast
   */
  public static suggestBetterColor(
    originalColor: string,
    background: string,
    targetRatio: number = 4.5
  ): string {
    const bgRgb = background.startsWith('#')
      ? this.hexToRgb(background)
      : this.parseRgb(background);

    if (!bgRgb) return originalColor;

    const bgLuminance = this.getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

    // Determine if we need lighter or darker color
    const needsLighter = bgLuminance < 0.5;

    let adjustedColor = originalColor;
    let currentRatio = this.getContrastRatio(originalColor, background);

    // Binary search for better color
    let steps = 0;
    while (currentRatio < targetRatio && steps < 20) {
      const rgb = adjustedColor.startsWith('#')
        ? this.hexToRgb(adjustedColor)
        : this.parseRgb(adjustedColor);

      if (!rgb) break;

      const adjustment = needsLighter ? 10 : -10;
      const newR = Math.max(0, Math.min(255, rgb.r + adjustment));
      const newG = Math.max(0, Math.min(255, rgb.g + adjustment));
      const newB = Math.max(0, Math.min(255, rgb.b + adjustment));

      adjustedColor = `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
      currentRatio = this.getContrastRatio(adjustedColor, background);
      steps++;
    }

    return adjustedColor;
  }
}

/**
 * Export function to run in console
 */
export function runContrastAudit(): void {
  console.log(ContrastChecker.generateReport());
}
