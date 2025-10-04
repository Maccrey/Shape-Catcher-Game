import { GameMode } from '../types/game.types';

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  level: number;
  mode: GameMode;
  timestamp: number;
  date: string;
  stats?: {
    accuracy?: number;
    maxCombo?: number;
    playtime?: number;
  };
}

export class LeaderboardManager {
  private leaderboards: Map<GameMode, LeaderboardEntry[]> = new Map();
  private maxEntriesPerMode: number = 100;

  constructor() {
    this.initializeLeaderboards();
    this.loadLeaderboards();
  }

  private initializeLeaderboards(): void {
    Object.values(GameMode).forEach(mode => {
      this.leaderboards.set(mode, []);
    });
  }

  public addEntry(entry: Omit<LeaderboardEntry, 'id' | 'timestamp' | 'date'>): LeaderboardEntry {
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };

    const modeLeaderboard = this.leaderboards.get(entry.mode) || [];
    modeLeaderboard.push(newEntry);

    // Sort by score (descending)
    modeLeaderboard.sort((a, b) => b.score - a.score);

    // Keep only top entries
    if (modeLeaderboard.length > this.maxEntriesPerMode) {
      modeLeaderboard.length = this.maxEntriesPerMode;
    }

    this.leaderboards.set(entry.mode, modeLeaderboard);
    this.saveLeaderboards();

    return newEntry;
  }

  public getLeaderboard(mode: GameMode, limit: number = 10): LeaderboardEntry[] {
    const leaderboard = this.leaderboards.get(mode) || [];
    return leaderboard.slice(0, limit);
  }

  public getTopScore(mode: GameMode): number {
    const leaderboard = this.leaderboards.get(mode) || [];
    return leaderboard.length > 0 ? leaderboard[0].score : 0;
  }

  public getPlayerRank(mode: GameMode, score: number): number {
    const leaderboard = this.leaderboards.get(mode) || [];
    const rank = leaderboard.findIndex(entry => score > entry.score);
    return rank === -1 ? leaderboard.length + 1 : rank + 1;
  }

  public isHighScore(mode: GameMode, score: number): boolean {
    const leaderboard = this.leaderboards.get(mode) || [];
    return leaderboard.length === 0 || score > leaderboard[0].score;
  }

  public isTopTen(mode: GameMode, score: number): boolean {
    const leaderboard = this.leaderboards.get(mode) || [];
    if (leaderboard.length < 10) return true;
    return score > leaderboard[9].score;
  }

  public getPlayerBestScore(mode: GameMode, playerName: string): LeaderboardEntry | undefined {
    const leaderboard = this.leaderboards.get(mode) || [];
    const playerEntries = leaderboard.filter(entry => entry.playerName === playerName);
    return playerEntries.length > 0 ? playerEntries[0] : undefined;
  }

  public getAllTimeLeaderboard(limit: number = 10): LeaderboardEntry[] {
    const allEntries: LeaderboardEntry[] = [];

    this.leaderboards.forEach(entries => {
      allEntries.push(...entries);
    });

    allEntries.sort((a, b) => b.score - a.score);
    return allEntries.slice(0, limit);
  }

  public getTodayLeaderboard(mode: GameMode, limit: number = 10): LeaderboardEntry[] {
    const today = new Date().toISOString().split('T')[0];
    const leaderboard = this.leaderboards.get(mode) || [];

    return leaderboard
      .filter(entry => entry.date === today)
      .slice(0, limit);
  }

  public getWeeklyLeaderboard(mode: GameMode, limit: number = 10): LeaderboardEntry[] {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const leaderboard = this.leaderboards.get(mode) || [];

    return leaderboard
      .filter(entry => entry.timestamp >= weekAgo)
      .slice(0, limit);
  }

  public clearLeaderboard(mode: GameMode): void {
    this.leaderboards.set(mode, []);
    this.saveLeaderboards();
  }

  public clearAllLeaderboards(): void {
    this.leaderboards.forEach((_, mode) => {
      this.leaderboards.set(mode, []);
    });
    this.saveLeaderboards();
  }

  // Utility methods
  private generateId(): string {
    return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Persistence
  private saveLeaderboards(): void {
    try {
      const data: Record<string, LeaderboardEntry[]> = {};
      this.leaderboards.forEach((entries, mode) => {
        data[mode] = entries;
      });
      localStorage.setItem('leaderboards', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save leaderboards:', error);
    }
  }

  private loadLeaderboards(): void {
    try {
      const saved = localStorage.getItem('leaderboards');
      if (saved) {
        const data = JSON.parse(saved);
        Object.entries(data).forEach(([mode, entries]) => {
          this.leaderboards.set(mode as GameMode, entries as LeaderboardEntry[]);
        });
      }
    } catch (error) {
      console.warn('Failed to load leaderboards:', error);
    }
  }

  // Statistics
  public getTotalPlayers(): number {
    const uniquePlayers = new Set<string>();
    this.leaderboards.forEach(entries => {
      entries.forEach(entry => uniquePlayers.add(entry.playerName));
    });
    return uniquePlayers.size;
  }

  public getTotalScores(): number {
    let total = 0;
    this.leaderboards.forEach(entries => {
      total += entries.length;
    });
    return total;
  }

  public getAverageScore(mode: GameMode): number {
    const leaderboard = this.leaderboards.get(mode) || [];
    if (leaderboard.length === 0) return 0;

    const sum = leaderboard.reduce((acc, entry) => acc + entry.score, 0);
    return Math.round(sum / leaderboard.length);
  }
}
