import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { GameStatus } from '../../types/game.types';

export const GameOverScreen: React.FC = () => {
  const {
    score,
    levelManager,
    gameTime,
    comboSystem,
    restartGame,
    gameStatus
  } = useGameStore();

  if (gameStatus !== GameStatus.GAME_OVER) {
    return null;
  }

  const currentLevel = levelManager.getCurrentLevel();
  const maxCombo = comboSystem.getMaxCombo();

  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const statistics = [
    { label: 'Final Score', value: score.toLocaleString(), color: 'text-yellow-400' },
    { label: 'Level Reached', value: currentLevel, color: 'text-blue-400' },
    { label: 'Time Played', value: formatTime(gameTime), color: 'text-green-400' },
    { label: 'Max Combo', value: `${maxCombo}x`, color: 'text-purple-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4"
      >
        {/* Game Over Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-5xl font-bold text-red-500 mb-2 drop-shadow-lg">
            Game Over
          </h2>
          <p className="text-gray-400 text-lg">
            Nice try! Better luck next time
          </p>
        </motion.div>

        {/* Statistics */}
        <div className="space-y-4 mb-8">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex justify-between items-center bg-gray-800/50 p-4 rounded-lg"
            >
              <span className="text-gray-300 font-medium">{stat.label}</span>
              <span className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* High Score Indicator (if applicable) */}
        {score > 1000 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
            className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-3 mb-6 text-center"
          >
            <div className="text-yellow-400 font-bold text-sm">
              🏆 Great Score!
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <button
            onClick={restartGame}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Play Again
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Back to Menu
          </button>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
      </motion.div>
    </motion.div>
  );
};
