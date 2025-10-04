import { motion, AnimatePresence } from 'framer-motion';
import { PowerUpType } from '../../game/PowerUpManager';
import { useEffect, useState } from 'react';

interface PowerUpDropProps {
  type: PowerUpType | null;
  position: { x: number; y: number };
  onComplete: () => void;
}

export const PowerUpDropAnimation: React.FC<PowerUpDropProps> = ({
  type,
  position,
  onComplete
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (type) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [type, onComplete]);

  if (!type || !isVisible) return null;

  const getPowerUpInfo = (powerUpType: PowerUpType) => {
    switch (powerUpType) {
      case PowerUpType.SLOW_MOTION:
        return { icon: '⏱️', name: 'Slow Motion', color: 'from-blue-500 to-cyan-500' };
      case PowerUpType.SCORE_MULTIPLIER:
        return { icon: '✨', name: '2x Score', color: 'from-yellow-500 to-orange-500' };
      case PowerUpType.SHIELD:
        return { icon: '🛡️', name: 'Shield', color: 'from-green-500 to-emerald-500' };
      case PowerUpType.STAR_SHOWER:
        return { icon: '⭐', name: 'Star Shower', color: 'from-purple-500 to-pink-500' };
      case PowerUpType.AUTO_MATCH:
        return { icon: '🎯', name: 'Auto Match', color: 'from-indigo-500 to-blue-500' };
      default:
        return { icon: '❓', name: 'Unknown', color: 'from-gray-500 to-gray-600' };
    }
  };

  const info = getPowerUpInfo(type);

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          scale: 0,
          opacity: 0,
          x: position.x,
          y: position.y
        }}
        animate={{
          scale: [0, 1.2, 1],
          opacity: [0, 1, 1, 0.8, 0],
          y: [position.y, position.y - 100, position.y - 150],
        }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{
          duration: 2,
          times: [0, 0.3, 0.5, 0.8, 1]
        }}
        className="fixed pointer-events-none z-50"
        style={{
          left: 0,
          top: 0
        }}
      >
        <div className={`flex flex-col items-center gap-2 bg-gradient-to-br ${info.color} p-4 rounded-lg shadow-2xl border-2 border-white/30`}>
          <div className="text-4xl animate-bounce">{info.icon}</div>
          <div className="text-white font-bold text-sm whitespace-nowrap">
            {info.name}
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="text-xs text-white/80"
          >
            Power-Up!
          </motion.div>
        </div>

        {/* Sparkle particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1
            }}
            animate={{
              x: Math.cos((i * Math.PI * 2) / 8) * 60,
              y: Math.sin((i * Math.PI * 2) / 8) * 60,
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: 'easeOut'
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-300 rounded-full"
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

// Manager component to handle multiple powerup drops
interface PowerUpDropManagerProps {
  children: React.ReactNode;
}

interface PowerUpDrop {
  id: number;
  type: PowerUpType;
  position: { x: number; y: number };
}

export const PowerUpDropManager: React.FC<PowerUpDropManagerProps> = ({ children }) => {
  const [drops, setDrops] = useState<PowerUpDrop[]>([]);

  // Expose method to trigger drop animation
  useEffect(() => {
    const handlePowerUpDrop = (event: CustomEvent<{ type: PowerUpType; position: { x: number; y: number } }>) => {
      const newDrop: PowerUpDrop = {
        id: Date.now(),
        type: event.detail.type,
        position: event.detail.position
      };
      setDrops(prev => [...prev, newDrop]);
    };

    window.addEventListener('powerup-drop' as any, handlePowerUpDrop);
    return () => window.removeEventListener('powerup-drop' as any, handlePowerUpDrop);
  }, []);

  const handleDropComplete = (id: number) => {
    setDrops(prev => prev.filter(drop => drop.id !== id));
  };

  return (
    <>
      {children}
      {drops.map(drop => (
        <PowerUpDropAnimation
          key={drop.id}
          type={drop.type}
          position={drop.position}
          onComplete={() => handleDropComplete(drop.id)}
        />
      ))}
    </>
  );
};

// Utility function to trigger powerup drop animation
export const triggerPowerUpDrop = (type: PowerUpType, position: { x: number; y: number }) => {
  const event = new CustomEvent('powerup-drop', {
    detail: { type, position }
  });
  window.dispatchEvent(event);
};
