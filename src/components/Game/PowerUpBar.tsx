import { motion } from 'framer-motion';
import { PowerUpType } from '../../game/PowerUpManager';
import { getPowerUpConfig } from '../../config/powerUpConfig';

interface PowerUpBarProps {
  inventory: Array<{ type: PowerUpType; quantity: number }>;
  activePowerUps: Array<{ type: PowerUpType; remainingTime: number }>;
  onUsePowerUp?: (type: PowerUpType) => void;
}

export const PowerUpBar: React.FC<PowerUpBarProps> = ({
  inventory,
  activePowerUps,
  onUsePowerUp
}) => {
  const isActive = (type: PowerUpType) => {
    return activePowerUps.some(p => p.type === type);
  };

  const getRemainingTime = (type: PowerUpType) => {
    const active = activePowerUps.find(p => p.type === type);
    return active ? Math.ceil(active.remainingTime / 1000) : 0;
  };

  if (inventory.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
      <div className="bg-gray-900/90 rounded-lg p-3 shadow-lg">
        <div className="flex gap-2">
          {inventory.map(item => {
            const config = getPowerUpConfig(item.type as any);
            const active = isActive(item.type);
            const remainingTime = getRemainingTime(item.type);

            return (
              <PowerUpSlot
                key={item.type}
                icon={config?.icon || '⭐'}
                quantity={item.quantity}
                active={active}
                remainingTime={remainingTime}
                onClick={() => onUsePowerUp?.(item.type)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface PowerUpSlotProps {
  icon: string;
  quantity: number;
  active: boolean;
  remainingTime: number;
  onClick: () => void;
}

const PowerUpSlot: React.FC<PowerUpSlotProps> = ({
  icon,
  quantity,
  active,
  remainingTime,
  onClick
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={quantity === 0}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={
        active
          ? {
              boxShadow: [
                '0 0 0 2px #fbbf24',
                '0 0 0 4px #fbbf24',
                '0 0 0 2px #fbbf24'
              ]
            }
          : {}
      }
      transition={{ duration: 0.5, repeat: active ? Infinity : 0 }}
      className={`relative w-16 h-16 rounded-lg flex items-center justify-center text-3xl transition-all ${
        quantity === 0
          ? 'bg-gray-700 opacity-50 cursor-not-allowed'
          : active
          ? 'bg-yellow-600 cursor-default'
          : 'bg-gray-800 hover:bg-gray-700 cursor-pointer'
      }`}
    >
      <span>{icon}</span>

      {/* Quantity Badge */}
      {quantity > 0 && !active && (
        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {quantity}
        </div>
      )}

      {/* Timer Badge */}
      {active && remainingTime > 0 && (
        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {remainingTime}
        </div>
      )}

      {/* Progress Ring for Active Powerups */}
      {active && remainingTime > 0 && (
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="28"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeDasharray="176"
            strokeDashoffset={176 * (1 - remainingTime / 10)}
            className="transition-all duration-1000"
          />
        </svg>
      )}
    </motion.button>
  );
};
