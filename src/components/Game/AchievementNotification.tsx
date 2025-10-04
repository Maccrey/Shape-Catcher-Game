import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, AchievementRarity } from '../../types/achievement.types';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose
}) => {
  if (!achievement) return null;

  const getRarityColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case AchievementRarity.COMMON:
        return 'from-gray-600 to-gray-700';
      case AchievementRarity.RARE:
        return 'from-blue-600 to-blue-700';
      case AchievementRarity.EPIC:
        return 'from-purple-600 to-purple-700';
      case AchievementRarity.LEGENDARY:
        return 'from-yellow-600 to-orange-600';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getRarityGlow = (rarity: AchievementRarity) => {
    switch (rarity) {
      case AchievementRarity.LEGENDARY:
        return '0 0 20px rgba(234, 179, 8, 0.5)';
      case AchievementRarity.EPIC:
        return '0 0 15px rgba(168, 85, 247, 0.5)';
      case AchievementRarity.RARE:
        return '0 0 10px rgba(59, 130, 246, 0.5)';
      default:
        return 'none';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed top-20 right-4 z-50 w-80"
      >
        <motion.div
          className={`bg-gradient-to-r ${getRarityColor(
            achievement.rarity
          )} rounded-lg shadow-2xl p-4 text-white`}
          style={{ boxShadow: getRarityGlow(achievement.rarity) }}
          animate={
            achievement.rarity === AchievementRarity.LEGENDARY
              ? {
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, -1, 0]
                }
              : {}
          }
          transition={{
            duration: 0.5,
            repeat: achievement.rarity === AchievementRarity.LEGENDARY ? 3 : 0
          }}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="text-4xl">{achievement.icon}</div>

            {/* Content */}
            <div className="flex-1">
              <div className="font-bold text-sm uppercase tracking-wide opacity-80">
                Achievement Unlocked!
              </div>
              <div className="font-bold text-lg mt-1">{achievement.name}</div>
              <div className="text-sm opacity-90 mt-1">{achievement.description}</div>

              {/* Rarity Badge */}
              <div className="mt-2">
                <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-black/20">
                  {achievement.rarity}
                </span>
              </div>

              {/* Reward */}
              {achievement.reward && (
                <div className="mt-2 text-sm opacity-90">
                  🎁 Reward:{' '}
                  {achievement.reward.type === 'score'
                    ? `+${achievement.reward.value} points`
                    : achievement.reward.value}
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </motion.div>

        {/* Particle Effects for Legendary */}
        {achievement.rarity === AchievementRarity.LEGENDARY && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{
                  x: 160,
                  y: 80,
                  scale: 0
                }}
                animate={{
                  x: 160 + (Math.random() - 0.5) * 200,
                  y: 80 + (Math.random() - 0.5) * 200,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
