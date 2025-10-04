import { GameStatistics, DEFAULT_STATISTICS } from '../types/statistics.types';

export class StatisticsManager {
  private stats: GameStatistics;

  constructor() {
    this.stats = { ...DEFAULT_STATISTICS };
    this.loadStatistics();
  }

  // Game stats
  public recordGameStart(): void {
    this.stats.totalGamesPlayed++;
    this.save();
  }

  public recordGameWin(score: number, level: number, gameTime: number): void {
    this.stats.totalGamesWon++;
    this.stats.totalGameTime += gameTime;
    this.stats.totalScore += score;
    this.stats.averageScore = this.stats.totalScore / this.stats.totalGamesPlayed;

    if (score > this.stats.highScore) {
      this.stats.highScore = score;
    }

    if (level > this.stats.highestLevelReached) {
      this.stats.highestLevelReached = level;
    }

    this.save();
  }

  public recordLevelComplete(level: number, levelTime: number): void {
    this.stats.totalLevelsCompleted++;

    if (levelTime < this.stats.fastestLevelCompletion) {
      this.stats.fastestLevelCompletion = levelTime;
    }

    // Update average level time
    const totalLevelTime = this.stats.averageLevelTime * (this.stats.totalLevelsCompleted - 1) + levelTime;
    this.stats.averageLevelTime = totalLevelTime / this.stats.totalLevelsCompleted;

    this.save();
  }

  // Catch stats
  public recordCatch(isPerfect: boolean = false): void {
    this.stats.totalCatches++;
    if (isPerfect) {
      this.stats.perfectCatches++;
    }

    this.updateCatchAccuracy();
    this.incrementStreak();
    this.save();
  }

  public recordMiss(): void {
    this.stats.totalMisses++;
    this.updateCatchAccuracy();
    this.resetStreak();
    this.save();
  }

  private updateCatchAccuracy(): void {
    const total = this.stats.totalCatches + this.stats.totalMisses;
    if (total > 0) {
      this.stats.catchAccuracy = (this.stats.totalCatches / total) * 100;
    }
  }

  // Combo stats
  public recordCombo(combo: number): void {
    if (combo > 0) {
      this.stats.totalCombos++;
    }

    if (combo > this.stats.highestCombo) {
      this.stats.highestCombo = combo;
    }

    this.save();
  }

  // Special shape stats
  public recordGoldenStar(): void {
    this.stats.goldenStarsCaught++;
    this.save();
  }

  public recordDiamond(): void {
    this.stats.diamondsCaught++;
    this.save();
  }

  public recordRainbow(): void {
    this.stats.rainbowsCaught++;
    this.save();
  }

  public recordBombHit(): void {
    this.stats.bombsHit++;
    this.save();
  }

  // Streak management
  private incrementStreak(): void {
    this.stats.currentStreak++;
    if (this.stats.currentStreak > this.stats.longestStreak) {
      this.stats.longestStreak = this.stats.currentStreak;
    }
  }

  private resetStreak(): void {
    this.stats.currentStreak = 0;
  }

  // Getters
  public getStatistics(): GameStatistics {
    return { ...this.stats };
  }

  public getWinRate(): number {
    if (this.stats.totalGamesPlayed === 0) return 0;
    return (this.stats.totalGamesWon / this.stats.totalGamesPlayed) * 100;
  }

  public getTotalPlayTime(): string {
    const hours = Math.floor(this.stats.totalGameTime / (1000 * 60 * 60));
    const minutes = Math.floor((this.stats.totalGameTime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  public getAverageLevelTime(): string {
    if (this.stats.averageLevelTime === 0) return '0:00';
    const minutes = Math.floor(this.stats.averageLevelTime / (1000 * 60));
    const seconds = Math.floor((this.stats.averageLevelTime % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  public getFastestLevelTime(): string {
    if (this.stats.fastestLevelCompletion === Infinity) return 'N/A';
    const minutes = Math.floor(this.stats.fastestLevelCompletion / (1000 * 60));
    const seconds = Math.floor((this.stats.fastestLevelCompletion % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Persistence
  private save(): void {
    this.stats.lastUpdated = Date.now();
    try {
      localStorage.setItem('game_statistics', JSON.stringify(this.stats));
    } catch (error) {
      console.warn('Failed to save statistics:', error);
    }
  }

  private loadStatistics(): void {
    try {
      const saved = localStorage.getItem('game_statistics');
      if (saved) {
        this.stats = { ...DEFAULT_STATISTICS, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load statistics:', error);
    }
  }

  public reset(): void {
    this.stats = { ...DEFAULT_STATISTICS };
    this.save();
  }
}
