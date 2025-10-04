import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LevelTransitionProps {
  level: number;
  onTransitionComplete: () => void;
  show: boolean;
}

export const LevelTransition: React.FC<LevelTransitionProps> = ({
  level,
  onTransitionComplete,
  show
}) => {
  const [phase, setPhase] = useState<'entering' | 'showing' | 'exiting'>('entering');

  useEffect(() => {
    if (!show) return;

    // Entering phase
    setPhase('entering');

    // Show phase (display level number)
    const showTimer = setTimeout(() => {
      setPhase('showing');
    }, 500);

    // Exit phase
    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, 2000);

    // Complete transition
    const completeTimer = setTimeout(() => {
      onTransitionComplete();
    }, 2500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [show, onTransitionComplete]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      >
        <div className="text-center">
          {/* Level Complete Text */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: phase === 'entering' ? 1 : 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-8"
          >
            <h2 className="text-4xl font-bold text-green-400 drop-shadow-lg">
              Level Complete!
            </h2>
          </motion.div>

          {/* Next Level Number */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase === 'showing' || phase === 'exiting' ? 1 : 0,
              opacity: phase === 'showing' ? 1 : 0
            }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative"
          >
            <div className="text-9xl font-black text-white drop-shadow-2xl">
              {level}
            </div>
            <div className="text-2xl font-semibold text-gray-300 mt-4">
              Level {level}
            </div>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'showing' ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="mt-8 flex justify-center gap-4"
          >
            <Star delay={0} />
            <Star delay={0.1} />
            <Star delay={0.2} />
          </motion.div>

          {/* Ready text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: phase === 'exiting' ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="mt-12 text-2xl font-semibold text-yellow-400"
          >
            Get Ready!
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const Star: React.FC<{ delay: number }> = ({ delay }) => (
  <motion.svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{
      duration: 0.5,
      delay: 0.8 + delay,
      type: 'spring',
      stiffness: 200
    }}
  >
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill="#fbbf24"
      stroke="#f59e0b"
      strokeWidth="1"
    />
  </motion.svg>
);
