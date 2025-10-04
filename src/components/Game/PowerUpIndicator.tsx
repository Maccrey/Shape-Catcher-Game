import { motion, AnimatePresence } from 'framer-motion';
import { PowerUpType, ActivePowerUp } from '../../game/PowerUpManager';

interface PowerUpIndicatorProps {
  activePowerUps: ActivePowerUp[];
}

export const PowerUpIndicator: React.FC<PowerUpIndicatorProps> = ({
  activePowerUps
}) => {
  if (activePowerUps.length === 0) return null;

  return (
    <div className="absolute top-20 right-4 z-20 space-y-2">
      <AnimatePresence>
        {activePowerUps.map((powerUp) => (
          <PowerUpCard key={powerUp.type} powerUp={powerUp} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const PowerUpCard: React.FC<{ powerUp: ActivePowerUp }> = ({ powerUp }) => {
  const config = getPowerUpConfig(powerUp.type);
  const remainingTime = Math.max(
    0,
    powerUp.duration - (Date.now() - powerUp.startTime)
  );
  const progress = powerUp.duration > 0 ? remainingTime / powerUp.duration : 0;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`${config.bgColor} ${config.textColor} rounded-lg shadow-lg p-3 min-w-[180px]`}
    >
      <div className="flex items-center gap-2">
        <div className="text-2xl">{config.icon}</div>
        <div className="flex-1">
          <div className="font-bold text-sm">{config.name}</div>
          {powerUp.duration > 0 && (
            <div className="text-xs opacity-80">
              {Math.ceil(remainingTime / 1000)}s
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {powerUp.duration > 0 && (
        <div className="mt-2 h-1 bg-black/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white/80 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      )}
    </motion.div>
  );
};

function getPowerUpConfig(type: PowerUpType): {
  name: string;
  icon: string;
  bgColor: string;
  textColor: string;
} {
  switch (type) {
    case PowerUpType.SCORE_MULTIPLIER:
      return {
        name: '2x Score',
        icon: '✨',
        bgColor: 'bg-purple-600',
        textColor: 'text-white'
      };
    case PowerUpType.TIME_BONUS:
      return {
        name: '+10 Seconds',
        icon: '⏱️',
        bgColor: 'bg-blue-600',
        textColor: 'text-white'
      };
    case PowerUpType.INVINCIBILITY:
      return {
        name: 'Invincible',
        icon: '🛡️',
        bgColor: 'bg-yellow-500',
        textColor: 'text-gray-900'
      };
    case PowerUpType.SLOW_MOTION:
      return {
        name: 'Slow Motion',
        icon: '🐌',
        bgColor: 'bg-green-600',
        textColor: 'text-white'
      };
    default:
      return {
        name: 'Power Up',
        icon: '⭐',
        bgColor: 'bg-gray-600',
        textColor: 'text-white'
      };
  }
}
