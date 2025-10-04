import { Achievement, AchievementType } from '../types/achievement.types';
import { ACHIEVEMENTS } from '../config/achievementConfig';

export class AchievementManager {
  private achievements: Map<string, Achievement> = new Map();
  private onAchievementUnlocked?: (achievement: Achievement) => void;

  constructor() {
    // Initialize achievements
    ACHIEVEMENTS.forEach(achievement => {
      this.achievements.set(achievement.id, { ...achievement });
    });

    // Load progress from localStorage
    this.loadProgress();
  }

  public updateProgress(achievementId: string, progress: number): void {
    const achievement = this.achievements.get(achievementId);
    if (!achievement || achievement.unlocked) return;

    achievement.progress = Math.min(progress, achievement.requirement);

    // Check if achievement is now unlocked
    if (achievement.progress >= achievement.requirement) {
      this.unlockAchievement(achievementId);
    }

    this.saveProgress();
  }

  public incrementProgress(achievementId: string, amount: number = 1): void {
    const achievement = this.achievements.get(achievementId);
    if (!achievement || achievement.unlocked) return;

    this.updateProgress(achievementId, achievement.progress + amount);
  }

  public unlockAchievement(achievementId: string): void {
    const achievement = this.achievements.get(achievementId);
    if (!achievement || achievement.unlocked) return;

    achievement.unlocked = true;
    achievement.unlockedAt = Date.now();
    achievement.progress = achievement.requirement;

    if (this.onAchievementUnlocked) {
      this.onAchievementUnlocked(achievement);
    }

    this.saveProgress();
  }

  public getAchievement(achievementId: string): Achievement | undefined {
    return this.achievements.get(achievementId);
  }

  public getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  public getUnlockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => a.unlocked);
  }

  public getLockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => !a.unlocked);
  }

  public getAchievementsByType(type: AchievementType): Achievement[] {
    return this.getAllAchievements().filter(a => a.type === type);
  }

  public getProgressPercentage(): number {
    const total = this.achievements.size;
    const unlocked = this.getUnlockedAchievements().length;
    return (unlocked / total) * 100;
  }

  public setOnAchievementUnlocked(callback: (achievement: Achievement) => void): void {
    this.onAchievementUnlocked = callback;
  }

  // Track game events
  public onScoreChanged(score: number): void {
    this.updateProgress('score_1000', score);
    this.updateProgress('score_5000', score);
    this.updateProgress('score_10000', score);
  }

  public onComboChanged(combo: number): void {
    this.updateProgress('combo_5', combo);
    this.updateProgress('combo_10', combo);
    this.updateProgress('combo_20', combo);
    this.updateProgress('combo_30', combo);
  }

  public onLevelCompleted(level: number): void {
    this.updateProgress('level_5', level);
    this.updateProgress('level_10', level);
    this.updateProgress('level_20', level);
  }

  public onGoldenStarCaught(): void {
    this.incrementProgress('golden_star_10');
  }

  public onDiamondCaught(): void {
    this.incrementProgress('diamond_20');
  }

  public onPerfectLevel(): void {
    this.incrementProgress('perfect_level');
    this.incrementProgress('perfect_3_levels');
  }

  public onBombAvoided(): void {
    this.incrementProgress('no_bomb');
  }

  public onStreakChanged(streak: number): void {
    this.updateProgress('streak_50', streak);
    this.updateProgress('streak_100', streak);
  }

  // Persistence
  private saveProgress(): void {
    const data: Record<string, { progress: number; unlocked: boolean; unlockedAt?: number }> = {};

    this.achievements.forEach((achievement, id) => {
      data[id] = {
        progress: achievement.progress,
        unlocked: achievement.unlocked,
        unlockedAt: achievement.unlockedAt
      };
    });

    try {
      localStorage.setItem('achievements', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save achievements:', error);
    }
  }

  private loadProgress(): void {
    try {
      const saved = localStorage.getItem('achievements');
      if (!saved) return;

      const data = JSON.parse(saved);

      Object.entries(data).forEach(([id, savedData]: [string, any]) => {
        const achievement = this.achievements.get(id);
        if (achievement) {
          achievement.progress = savedData.progress || 0;
          achievement.unlocked = savedData.unlocked || false;
          achievement.unlockedAt = savedData.unlockedAt;
        }
      });
    } catch (error) {
      console.warn('Failed to load achievements:', error);
    }
  }

  public reset(): void {
    this.achievements.forEach(achievement => {
      achievement.progress = 0;
      achievement.unlocked = false;
      achievement.unlockedAt = undefined;
    });
    this.saveProgress();
  }
}
