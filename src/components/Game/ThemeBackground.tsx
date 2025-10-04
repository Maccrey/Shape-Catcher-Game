import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LevelTheme } from '../../types/level.types';

interface ThemeBackgroundProps {
  theme: LevelTheme;
  level: number;
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ theme, level }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  useEffect(() => {
    // Generate background particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }));
    setParticles(newParticles);
  }, [level]);

  const getAnimationStyle = () => {
    switch (theme.bgAnimation) {
      case 'pulse':
        return {
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8]
        };
      case 'waves':
        return {
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        };
      case 'float':
        return {
          y: [0, -10, 0]
        };
      default:
        return {};
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main Background Gradient */}
      <motion.div
        className="absolute inset-0"
        style={{ background: theme.background }}
        animate={getAnimationStyle()}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Animated Particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: theme.particleColor,
            opacity: 0.3
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Overlay Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, ${theme.particleColor} 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Vignette Effect */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
        }}
      />
    </div>
  );
};

interface DynamicBackgroundProps {
  level: number;
  combo: number;
  intensity?: number;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  level,
  combo,
  intensity = 1
}) => {
  const getBackgroundColor = () => {
    // Change background based on combo
    if (combo >= 20) return 'from-purple-900 via-pink-900 to-red-900';
    if (combo >= 15) return 'from-blue-900 via-purple-900 to-pink-900';
    if (combo >= 10) return 'from-indigo-900 via-blue-900 to-purple-900';
    if (combo >= 5) return 'from-gray-900 via-indigo-900 to-blue-900';
    return 'from-gray-900 via-slate-900 to-gray-900';
  };

  const getPulseSpeed = () => {
    if (combo >= 15) return 1;
    if (combo >= 10) return 1.5;
    if (combo >= 5) return 2;
    return 3;
  };

  return (
    <motion.div
      className={`absolute inset-0 bg-gradient-to-br ${getBackgroundColor()}`}
      animate={{
        opacity: [0.7, 0.9, 0.7]
      }}
      transition={{
        duration: getPulseSpeed(),
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {/* Combo intensity overlay */}
      {combo >= 5 && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, transparent 0%, rgba(255,215,0,${
              Math.min(combo / 100, 0.2)
            }) 100%)`
          }}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity
          }}
        />
      )}
    </motion.div>
  );
};
