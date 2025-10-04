import { SkinId, SkinState } from '../types/skin.types';
import { SKINS, DEFAULT_SKIN } from '../config/skinConfig';

export class SkinManager {
  private currentSkin: SkinId;
  private unlockedSkins: Set<SkinId>;
  private onSkinUnlocked?: (skinId: SkinId) => void;

  constructor(initialState?: SkinState) {
    this.currentSkin = initialState?.currentSkin || DEFAULT_SKIN;
    this.unlockedSkins = new Set(initialState?.unlockedSkins || [DEFAULT_SKIN]);
  }

  /**
   * Get current active skin
   */
  public getCurrentSkin(): SkinId {
    return this.currentSkin;
  }

  /**
   * Get all unlocked skins
   */
  public getUnlockedSkins(): SkinId[] {
    return Array.from(this.unlockedSkins);
  }

  /**
   * Set active skin (only if unlocked)
   */
  public setSkin(skinId: SkinId): boolean {
    if (this.unlockedSkins.has(skinId)) {
      this.currentSkin = skinId;
      return true;
    }
    return false;
  }

  /**
   * Check if skin is unlocked
   */
  public isSkinUnlocked(skinId: SkinId): boolean {
    return this.unlockedSkins.has(skinId);
  }

  /**
   * Unlock a skin
   */
  public unlockSkin(skinId: SkinId): boolean {
    if (this.unlockedSkins.has(skinId)) {
      return false; // Already unlocked
    }

    this.unlockedSkins.add(skinId);

    if (this.onSkinUnlocked) {
      this.onSkinUnlocked(skinId);
    }

    return true;
  }

  /**
   * Check unlock conditions and unlock skins automatically
   */
  public checkUnlockConditions(gameStats: {
    score: number;
    level: number;
    maxCombo: number;
    achievements: string[];
  }): SkinId[] {
    const newlyUnlocked: SkinId[] = [];

    SKINS.forEach(skin => {
      if (this.unlockedSkins.has(skin.id)) {
        return; // Already unlocked
      }

      let shouldUnlock = false;

      switch (skin.unlockCondition.type) {
        case 'default':
          shouldUnlock = true;
          break;

        case 'score':
          if (
            skin.unlockCondition.requirement &&
            gameStats.score >= (skin.unlockCondition.requirement as number)
          ) {
            shouldUnlock = true;
          }
          break;

        case 'level':
          if (
            skin.unlockCondition.requirement &&
            gameStats.level >= (skin.unlockCondition.requirement as number)
          ) {
            shouldUnlock = true;
          }
          break;

        case 'combo':
          if (
            skin.unlockCondition.requirement &&
            gameStats.maxCombo >= (skin.unlockCondition.requirement as number)
          ) {
            shouldUnlock = true;
          }
          break;

        case 'achievement':
          if (
            skin.unlockCondition.requirement &&
            gameStats.achievements.includes(skin.unlockCondition.requirement as string)
          ) {
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock) {
        this.unlockSkin(skin.id);
        newlyUnlocked.push(skin.id);
      }
    });

    return newlyUnlocked;
  }

  /**
   * Set callback for when skin is unlocked
   */
  public setOnSkinUnlocked(callback: (skinId: SkinId) => void): void {
    this.onSkinUnlocked = callback;
  }

  /**
   * Get skin state for persistence
   */
  public getState(): SkinState {
    return {
      currentSkin: this.currentSkin,
      unlockedSkins: this.getUnlockedSkins()
    };
  }

  /**
   * Get skin unlock progress
   */
  public getUnlockProgress(): {
    total: number;
    unlocked: number;
    percentage: number;
  } {
    const total = SKINS.length;
    const unlocked = this.unlockedSkins.size;
    const percentage = (unlocked / total) * 100;

    return { total, unlocked, percentage };
  }

  /**
   * Get next skin to unlock
   */
  public getNextSkinToUnlock(gameStats: {
    score: number;
    level: number;
    maxCombo: number;
  }): { skinId: SkinId; progress: number } | null {
    let closestSkin: { skinId: SkinId; progress: number } | null = null;
    let minProgress = Infinity;

    SKINS.forEach(skin => {
      if (this.unlockedSkins.has(skin.id)) {
        return; // Already unlocked
      }

      let progress = 0;

      switch (skin.unlockCondition.type) {
        case 'score':
          if (skin.unlockCondition.requirement) {
            progress =
              (gameStats.score / (skin.unlockCondition.requirement as number)) * 100;
          }
          break;

        case 'level':
          if (skin.unlockCondition.requirement) {
            progress =
              (gameStats.level / (skin.unlockCondition.requirement as number)) * 100;
          }
          break;

        case 'combo':
          if (skin.unlockCondition.requirement) {
            progress =
              (gameStats.maxCombo / (skin.unlockCondition.requirement as number)) * 100;
          }
          break;
      }

      if (progress < 100 && progress > 0 && progress < minProgress) {
        minProgress = progress;
        closestSkin = {
          skinId: skin.id,
          progress: Math.min(progress, 100)
        };
      }
    });

    return closestSkin;
  }

  /**
   * Reset to default
   */
  public reset(): void {
    this.currentSkin = DEFAULT_SKIN;
    this.unlockedSkins.clear();
    this.unlockedSkins.add(DEFAULT_SKIN);
  }
}
