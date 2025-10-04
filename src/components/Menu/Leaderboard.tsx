import { motion } from 'framer-motion';
import { useState } from 'react';
import { LeaderboardManager, LeaderboardEntry } from '../../game/LeaderboardManager';
import { GameMode } from '../../types/game.types';

interface LeaderboardProps {
  leaderboardManager: LeaderboardManager;
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  leaderboardManager,
  onClose
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.CLASSIC);
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week'>('all');

  const getLeaderboard = (): LeaderboardEntry[] => {
    switch (timeFilter) {
      case 'today':
        return leaderboardManager.getTodayLeaderboard(selectedMode);
      case 'week':
        return leaderboardManager.getWeeklyLeaderboard(selectedMode);
      default:
        return leaderboardManager.getLeaderboard(selectedMode);
    }
  };

  const entries = getLeaderboard();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
            <p className="text-gray-400 mt-1">Top players and scores</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-3">
          {/* Mode Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {Object.values(GameMode).map(mode => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  selectedMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {mode.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {/* Time Filter */}
          <div className="flex gap-2">
            {['all', 'today', 'week'].map(filter => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timeFilter === filter
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-lg">No scores yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <LeaderboardRow
                  key={entry.id}
                  entry={entry}
                  rank={index + 1}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-gray-400 text-sm">Total Players</div>
            <div className="text-white text-xl font-bold">
              {leaderboardManager.getTotalPlayers()}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Total Scores</div>
            <div className="text-white text-xl font-bold">
              {leaderboardManager.getTotalScores()}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Average Score</div>
            <div className="text-white text-xl font-bold">
              {leaderboardManager.getAverageScore(selectedMode)}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const LeaderboardRow: React.FC<{ entry: LeaderboardEntry; rank: number }> = ({
  entry,
  rank
}) => {
  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-600 to-yellow-700';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-orange-600 to-orange-700';
    return 'from-gray-700 to-gray-800';
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: rank * 0.05 }}
      className={`bg-gradient-to-r ${getRankColor(rank)} rounded-lg p-4 flex items-center gap-4`}
    >
      {/* Rank */}
      <div className="text-3xl font-bold w-16 text-center">
        {getMedalEmoji(rank)}
      </div>

      {/* Player Info */}
      <div className="flex-1">
        <div className="text-white font-bold text-lg">{entry.playerName}</div>
        <div className="text-gray-300 text-sm">
          Level {entry.level} • {new Date(entry.timestamp).toLocaleDateString()}
        </div>
      </div>

      {/* Score */}
      <div className="text-right">
        <div className="text-white font-bold text-2xl">
          {entry.score.toLocaleString()}
        </div>
        {entry.stats && (
          <div className="text-gray-300 text-sm">
            {entry.stats.accuracy && `${entry.stats.accuracy}% acc`}
            {entry.stats.maxCombo && ` • ${entry.stats.maxCombo}x combo`}
          </div>
        )}
      </div>
    </motion.div>
  );
};
