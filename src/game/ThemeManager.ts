import { ThemeId, ThemeState, Theme } from '../types/theme.types';
import { THEMES, DEFAULT_THEME, getThemeByLevel } from '../config/themeConfig';

export class ThemeManager {
  private currentTheme: ThemeId;
  private unlockedThemes: Set<ThemeId>;
  private onThemeUnlocked?: (themeId: ThemeId) => void;

  constructor(initialState?: ThemeState) {
    this.currentTheme = initialState?.currentTheme || DEFAULT_THEME;
    this.unlockedThemes = new Set(initialState?.unlockedThemes || [DEFAULT_THEME]);
  }

  /**
   * Get current active theme
   */
  public getCurrentTheme(): ThemeId {
    return this.currentTheme;
  }

  /**
   * Get current theme object
   */
  public getCurrentThemeObject(): Theme | undefined {
    return THEMES.find(t => t.id === this.currentTheme);
  }

  /**
   * Get all unlocked themes
   */
  public getUnlockedThemes(): ThemeId[] {
    return Array.from(this.unlockedThemes);
  }

  /**
   * Set active theme (only if unlocked)
   */
  public setTheme(themeId: ThemeId): boolean {
    if (this.unlockedThemes.has(themeId)) {
      this.currentTheme = themeId;
      return true;
    }
    return false;
  }

  /**
   * Check if theme is unlocked
   */
  public isThemeUnlocked(themeId: ThemeId): boolean {
    return this.unlockedThemes.has(themeId);
  }

  /**
   * Unlock a theme
   */
  public unlockTheme(themeId: ThemeId): boolean {
    if (this.unlockedThemes.has(themeId)) {
      return false; // Already unlocked
    }

    this.unlockedThemes.add(themeId);

    if (this.onThemeUnlocked) {
      this.onThemeUnlocked(themeId);
    }

    return true;
  }

  /**
   * Check unlock conditions based on level and unlock themes automatically
   */
  public checkUnlockConditions(level: number): ThemeId[] {
    const newlyUnlocked: ThemeId[] = [];

    THEMES.forEach(theme => {
      if (this.unlockedThemes.has(theme.id)) {
        return; // Already unlocked
      }

      let shouldUnlock = false;

      switch (theme.unlockCondition.type) {
        case 'default':
          shouldUnlock = true;
          break;

        case 'level':
          if (
            theme.unlockCondition.requirement &&
            level >= theme.unlockCondition.requirement
          ) {
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock) {
        this.unlockTheme(theme.id);
        newlyUnlocked.push(theme.id);
      }
    });

    return newlyUnlocked;
  }

  /**
   * Auto-switch theme based on level
   */
  public autoSwitchThemeByLevel(level: number): void {
    const recommendedTheme = getThemeByLevel(level);
    if (this.unlockedThemes.has(recommendedTheme.id)) {
      this.currentTheme = recommendedTheme.id;
    }
  }

  /**
   * Set callback for when theme is unlocked
   */
  public setOnThemeUnlocked(callback: (themeId: ThemeId) => void): void {
    this.onThemeUnlocked = callback;
  }

  /**
   * Get theme state for persistence
   */
  public getState(): ThemeState {
    return {
      currentTheme: this.currentTheme,
      unlockedThemes: this.getUnlockedThemes()
    };
  }

  /**
   * Get theme unlock progress
   */
  public getUnlockProgress(): {
    total: number;
    unlocked: number;
    percentage: number;
  } {
    const total = THEMES.length;
    const unlocked = this.unlockedThemes.size;
    const percentage = (unlocked / total) * 100;

    return { total, unlocked, percentage };
  }

  /**
   * Get next theme to unlock
   */
  public getNextThemeToUnlock(currentLevel: number): {
    themeId: ThemeId;
    requiredLevel: number;
    levelsRemaining: number;
  } | null {
    let nextTheme: {
      themeId: ThemeId;
      requiredLevel: number;
      levelsRemaining: number;
    } | null = null;

    let minLevelsRemaining = Infinity;

    THEMES.forEach(theme => {
      if (this.unlockedThemes.has(theme.id)) {
        return; // Already unlocked
      }

      if (theme.unlockCondition.type === 'level' && theme.unlockCondition.requirement) {
        const requiredLevel = theme.unlockCondition.requirement;
        const levelsRemaining = requiredLevel - currentLevel;

        if (levelsRemaining > 0 && levelsRemaining < minLevelsRemaining) {
          minLevelsRemaining = levelsRemaining;
          nextTheme = {
            themeId: theme.id,
            requiredLevel,
            levelsRemaining
          };
        }
      }
    });

    return nextTheme;
  }

  /**
   * Get recommended theme for current level
   */
  public getRecommendedTheme(level: number): Theme {
    return getThemeByLevel(level);
  }

  /**
   * Reset to default
   */
  public reset(): void {
    this.currentTheme = DEFAULT_THEME;
    this.unlockedThemes.clear();
    this.unlockedThemes.add(DEFAULT_THEME);
  }
}
