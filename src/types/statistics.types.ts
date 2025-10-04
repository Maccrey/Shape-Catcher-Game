export interface GameStatistics {
  // Overall stats
  totalGamesPlayed: number;
  totalGamesWon: number;
  totalGameTime: number; // in milliseconds

  // Score stats
  highScore: number;
  totalScore: number;
  averageScore: number;

  // Level stats
  highestLevelReached: number;
  totalLevelsCompleted: number;

  // Catch stats
  totalCatches: number;
  perfectCatches: number;
  totalMisses: number;
  catchAccuracy: number; // percentage

  // Combo stats
  highestCombo: number;
  totalCombos: number;

  // Special shape stats
  goldenStarsCaught: number;
  diamondsCaught: number;
  rainbowsCaught: number;
  bombsHit: number;

  // Streak stats
  currentStreak: number;
  longestStreak: number;

  // Time stats
  fastestLevelCompletion: number; // in milliseconds
  averageLevelTime: number; // in milliseconds

  // Last updated
  lastUpdated: number;
}

export const DEFAULT_STATISTICS: GameStatistics = {
  totalGamesPlayed: 0,
  totalGamesWon: 0,
  totalGameTime: 0,
  highScore: 0,
  totalScore: 0,
  averageScore: 0,
  highestLevelReached: 0,
  totalLevelsCompleted: 0,
  totalCatches: 0,
  perfectCatches: 0,
  totalMisses: 0,
  catchAccuracy: 0,
  highestCombo: 0,
  totalCombos: 0,
  goldenStarsCaught: 0,
  diamondsCaught: 0,
  rainbowsCaught: 0,
  bombsHit: 0,
  currentStreak: 0,
  longestStreak: 0,
  fastestLevelCompletion: Infinity,
  averageLevelTime: 0,
  lastUpdated: Date.now()
};
