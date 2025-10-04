import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface VisualEffectsProps {
  flashAlpha?: number;
  borderGlow?: boolean;
  comboLevel?: number;
}

export const VisualEffects: React.FC<VisualEffectsProps> = ({
  flashAlpha = 0,
  borderGlow = false,
  comboLevel = 0
}) => {
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    if (flashAlpha > 0) {
      setShowFlash(true);
      const timer = setTimeout(() => setShowFlash(false), 200);
      return () => clearTimeout(timer);
    }
  }, [flashAlpha]);

  const getBorderColor = () => {
    if (comboLevel >= 20) return '#f59e0b'; // Gold
    if (comboLevel >= 15) return '#a855f7'; // Purple
    if (comboLevel >= 10) return '#3b82f6'; // Blue
    if (comboLevel >= 5) return '#22c55e'; // Green
    return 'transparent';
  };

  return (
    <>
      {/* Flash Effect */}
      <AnimatePresence>
        {showFlash && flashAlpha > 0 && (
          <motion.div
            initial={{ opacity: flashAlpha }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white pointer-events-none"
            style={{ opacity: flashAlpha }}
          />
        )}
      </AnimatePresence>

      {/* Border Glow Effect */}
      {borderGlow && comboLevel >= 5 && (
        <motion.div
          animate={{
            boxShadow: [
              `inset 0 0 20px ${getBorderColor()}`,
              `inset 0 0 40px ${getBorderColor()}`,
              `inset 0 0 20px ${getBorderColor()}`
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="fixed inset-0 z-30 pointer-events-none rounded-lg"
          style={{
            border: `4px solid ${getBorderColor()}`
          }}
        />
      )}

      {/* Vignette Effect for High Combos */}
      {comboLevel >= 10 && (
        <div
          className="fixed inset-0 z-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle, transparent 60%, rgba(0,0,0,${
              Math.min(0.4, comboLevel / 50)
            }) 100%)`
          }}
        />
      )}
    </>
  );
};

interface ScorePopupProps {
  score: number;
  x: number;
  y: number;
  message?: string;
  color?: string;
  onComplete?: () => void;
}

export const ScorePopup: React.FC<ScorePopupProps> = ({
  score,
  x,
  y,
  message,
  color = '#fbbf24',
  onComplete
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -50, scale: 1.2 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="fixed pointer-events-none z-50"
      style={{
        left: x,
        top: y,
        color: color,
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }}
    >
      <div className="font-bold text-2xl">
        {score > 0 ? '+' : ''}
        {score}
      </div>
      {message && (
        <div className="text-sm font-semibold mt-1">{message}</div>
      )}
    </motion.div>
  );
};

interface ComboMessageProps {
  combo: number;
  message: string;
  show: boolean;
}

export const ComboMessage: React.FC<ComboMessageProps> = ({
  combo,
  message,
  show
}) => {
  if (!show) return null;

  const getColor = () => {
    if (combo >= 20) return '#f59e0b';
    if (combo >= 15) return '#a855f7';
    if (combo >= 10) return '#3b82f6';
    if (combo >= 5) return '#22c55e';
    return '#fbbf24';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 0.5,
            repeat: 2
          }}
          className="text-center"
        >
          <div
            className="text-6xl font-black drop-shadow-lg"
            style={{ color: getColor() }}
          >
            {message}
          </div>
          <div className="text-3xl font-bold text-white mt-2 drop-shadow-md">
            {combo}x COMBO!
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
