import { motion } from 'framer-motion';
import { StatisticsManager } from '../../game/StatisticsManager';

interface StatisticsProps {
  statisticsManager: StatisticsManager;
  onClose: () => void;
}

export const Statistics: React.FC<StatisticsProps> = ({
  statisticsManager,
  onClose
}) => {
  const stats = statisticsManager.getStatistics();
  const winRate = statisticsManager.getWinRate();
  const totalPlayTime = statisticsManager.getTotalPlayTime();
  const avgLevelTime = statisticsManager.getAverageLevelTime();
  const fastestLevelTime = statisticsManager.getFastestLevelTime();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Statistics</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh]">
          {/* Game Stats */}
          <StatCard
            title="Games Played"
            value={stats.totalGamesPlayed}
            icon="🎮"
            color="blue"
          />
          <StatCard
            title="Games Won"
            value={stats.totalGamesWon}
            icon="🏆"
            color="green"
          />
          <StatCard
            title="Win Rate"
            value={`${winRate.toFixed(1)}%`}
            icon="📊"
            color="purple"
          />

          {/* Score Stats */}
          <StatCard
            title="High Score"
            value={stats.highScore.toLocaleString()}
            icon="⭐"
            color="yellow"
          />
          <StatCard
            title="Total Score"
            value={stats.totalScore.toLocaleString()}
            icon="💎"
            color="blue"
          />
          <StatCard
            title="Average Score"
            value={Math.round(stats.averageScore).toLocaleString()}
            icon="📈"
            color="green"
          />

          {/* Level Stats */}
          <StatCard
            title="Highest Level"
            value={stats.highestLevelReached}
            icon="🏔️"
            color="purple"
          />
          <StatCard
            title="Levels Completed"
            value={stats.totalLevelsCompleted}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Total Play Time"
            value={totalPlayTime}
            icon="⏱️"
            color="blue"
          />

          {/* Catch Stats */}
          <StatCard
            title="Total Catches"
            value={stats.totalCatches.toLocaleString()}
            icon="🎯"
            color="green"
          />
          <StatCard
            title="Perfect Catches"
            value={stats.perfectCatches.toLocaleString()}
            icon="✨"
            color="yellow"
          />
          <StatCard
            title="Catch Accuracy"
            value={`${stats.catchAccuracy.toFixed(1)}%`}
            icon="🎪"
            color="purple"
          />

          {/* Combo Stats */}
          <StatCard
            title="Highest Combo"
            value={`${stats.highestCombo}x`}
            icon="🔥"
            color="red"
          />
          <StatCard
            title="Total Combos"
            value={stats.totalCombos.toLocaleString()}
            icon="⚡"
            color="yellow"
          />
          <StatCard
            title="Longest Streak"
            value={stats.longestStreak}
            icon="🏅"
            color="gold"
          />

          {/* Special Shape Stats */}
          <StatCard
            title="Golden Stars"
            value={stats.goldenStarsCaught}
            icon="⭐"
            color="yellow"
          />
          <StatCard
            title="Diamonds"
            value={stats.diamondsCaught}
            icon="💎"
            color="blue"
          />
          <StatCard
            title="Rainbows"
            value={stats.rainbowsCaught}
            icon="🌈"
            color="purple"
          />

          {/* Time Stats */}
          <StatCard
            title="Avg Level Time"
            value={avgLevelTime}
            icon="⏲️"
            color="blue"
          />
          <StatCard
            title="Fastest Level"
            value={fastestLevelTime}
            icon="⚡"
            color="yellow"
          />
          <StatCard
            title="Bombs Hit"
            value={stats.bombsHit}
            icon="💣"
            color="red"
          />
        </div>

        {/* Reset Button */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all statistics?')) {
                statisticsManager.reset();
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Reset Statistics
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gold';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    yellow: 'from-yellow-600 to-yellow-700',
    red: 'from-red-600 to-red-700',
    gold: 'from-yellow-500 to-orange-500'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-4 shadow-lg`}
    >
      <div className="flex items-center gap-3">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <div className="text-sm text-white/80 font-medium">{title}</div>
          <div className="text-2xl font-bold text-white mt-1">{value}</div>
        </div>
      </div>
    </motion.div>
  );
};
