import { motion } from 'framer-motion';
import { useState } from 'react';
import { Achievement, AchievementRarity, AchievementType } from '../../types/achievement.types';
import { AchievementManager } from '../../game/AchievementManager';

interface AchievementsProps {
  achievementManager: AchievementManager;
  onClose: () => void;
}

export const Achievements: React.FC<AchievementsProps> = ({
  achievementManager,
  onClose
}) => {
  const [filter, setFilter] = useState<'all' | AchievementType>('all');
  const allAchievements = achievementManager.getAllAchievements();

  const filteredAchievements = filter === 'all'
    ? allAchievements
    : achievementManager.getAchievementsByType(filter);

  const unlockedCount = achievementManager.getUnlockedAchievements().length;
  const totalCount = allAchievements.length;
  const progressPercentage = achievementManager.getProgressPercentage();

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
            <h2 className="text-3xl font-bold text-white">Achievements</h2>
            <p className="text-gray-400 mt-1">
              {unlockedCount} / {totalCount} unlocked ({Math.round(progressPercentage)}%)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All
          </FilterButton>
          {Object.values(AchievementType).map(type => (
            <FilterButton
              key={type}
              active={filter === type}
              onClick={() => setFilter(type)}
            >
              {type}
            </FilterButton>
          ))}
        </div>

        {/* Achievement List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredAchievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const FilterButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
      active
        ? 'bg-blue-600 text-white'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {children}
  </button>
);

const AchievementCard: React.FC<{ achievement: Achievement }> = ({
  achievement
}) => {
  const getRarityColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case AchievementRarity.COMMON:
        return 'border-gray-600 bg-gray-800/50';
      case AchievementRarity.RARE:
        return 'border-blue-500 bg-blue-900/20';
      case AchievementRarity.EPIC:
        return 'border-purple-500 bg-purple-900/20';
      case AchievementRarity.LEGENDARY:
        return 'border-yellow-500 bg-yellow-900/20';
    }
  };

  const progressPercentage = achievement.unlocked
    ? 100
    : (achievement.progress / achievement.requirement) * 100;

  return (
    <motion.div
      className={`border-2 rounded-lg p-4 ${getRarityColor(achievement.rarity)} ${
        !achievement.unlocked ? 'opacity-60' : ''
      }`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`text-5xl ${achievement.unlocked ? '' : 'grayscale'}`}>
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">
                {achievement.name}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {achievement.description}
              </p>
            </div>

            {/* Rarity Badge */}
            <span className="text-xs font-semibold px-2 py-1 rounded bg-black/30 text-gray-300">
              {achievement.rarity}
            </span>
          </div>

          {/* Progress */}
          {!achievement.unlocked && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Progress</span>
                <span>
                  {achievement.progress} / {achievement.requirement}
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Unlocked Info */}
          {achievement.unlocked && achievement.unlockedAt && (
            <div className="mt-2 text-sm text-green-400">
              ✓ Unlocked on{' '}
              {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}

          {/* Reward */}
          {achievement.reward && (
            <div className="mt-2 text-sm text-yellow-400">
              🎁 Reward:{' '}
              {achievement.reward.type === 'score'
                ? `+${achievement.reward.value} points`
                : achievement.reward.value}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
