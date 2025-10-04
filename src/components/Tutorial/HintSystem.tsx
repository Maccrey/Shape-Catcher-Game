import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export enum HintType {
  CHECK_SHAPE_COLOR = 'check_shape_color',
  MAINTAIN_COMBO = 'maintain_combo',
  USE_POWERUP = 'use_powerup',
  MOVE_FASTER = 'move_faster',
  SPECIAL_SHAPE = 'special_shape',
  AVOID_BOMB = 'avoid_bomb',
  CHANGE_SHAPE = 'change_shape',
  CHANGE_COLOR = 'change_color'
}

export interface Hint {
  type: HintType;
  message: string;
  icon: string;
  duration?: number;
}

const HINT_MESSAGES: Record<HintType, Hint> = {
  [HintType.CHECK_SHAPE_COLOR]: {
    type: HintType.CHECK_SHAPE_COLOR,
    message: '도형과 색상을 확인하세요!',
    icon: '👀',
    duration: 3000
  },
  [HintType.MAINTAIN_COMBO]: {
    type: HintType.MAINTAIN_COMBO,
    message: '빠르게 캐치하여 콤보를 유지하세요!',
    icon: '⚡',
    duration: 3000
  },
  [HintType.USE_POWERUP]: {
    type: HintType.USE_POWERUP,
    message: '파워업을 사용해보세요!',
    icon: '✨',
    duration: 3000
  },
  [HintType.MOVE_FASTER]: {
    type: HintType.MOVE_FASTER,
    message: '더 빠르게 움직이세요!',
    icon: '🏃',
    duration: 2500
  },
  [HintType.SPECIAL_SHAPE]: {
    type: HintType.SPECIAL_SHAPE,
    message: '특수 도형을 캐치하면 보너스!',
    icon: '⭐',
    duration: 3000
  },
  [HintType.AVOID_BOMB]: {
    type: HintType.AVOID_BOMB,
    message: '폭탄을 조심하세요!',
    icon: '💣',
    duration: 2500
  },
  [HintType.CHANGE_SHAPE]: {
    type: HintType.CHANGE_SHAPE,
    message: '↑↓ 키로 도형을 변경하세요',
    icon: '🔄',
    duration: 3000
  },
  [HintType.CHANGE_COLOR]: {
    type: HintType.CHANGE_COLOR,
    message: '←→ 키로 색상을 변경하세요',
    icon: '🎨',
    duration: 3000
  }
};

interface HintSystemProps {
  currentHint: HintType | null;
  onHintDismissed?: () => void;
}

export const HintSystem: React.FC<HintSystemProps> = ({
  currentHint,
  onHintDismissed
}) => {
  const [visibleHint, setVisibleHint] = useState<Hint | null>(null);

  useEffect(() => {
    if (currentHint) {
      const hint = HINT_MESSAGES[currentHint];
      setVisibleHint(hint);

      const timer = setTimeout(() => {
        setVisibleHint(null);
        onHintDismissed?.();
      }, hint.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [currentHint, onHintDismissed]);

  return (
    <AnimatePresence>
      {visibleHint && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-2xl"
            >
              {visibleHint.icon}
            </motion.span>
            <span className="font-semibold text-lg">{visibleHint.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook for managing hints based on game state
export const useGameHints = () => {
  const [currentHint, setCurrentHint] = useState<HintType | null>(null);
  const [hintHistory, setHintHistory] = useState<Set<HintType>>(new Set());
  const [lastHintTime, setLastHintTime] = useState<number>(0);

  const MIN_HINT_INTERVAL = 5000; // 5 seconds between hints

  const showHint = (type: HintType, force: boolean = false) => {
    const now = Date.now();

    // Don't show the same hint twice (unless forced)
    if (hintHistory.has(type) && !force) {
      return;
    }

    // Don't show hints too frequently
    if (now - lastHintTime < MIN_HINT_INTERVAL && !force) {
      return;
    }

    setCurrentHint(type);
    setHintHistory(prev => new Set([...prev, type]));
    setLastHintTime(now);
  };

  const dismissHint = () => {
    setCurrentHint(null);
  };

  const resetHints = () => {
    setHintHistory(new Set());
    setCurrentHint(null);
  };

  return {
    currentHint,
    showHint,
    dismissHint,
    resetHints
  };
};

// Context-aware hint triggers
export class HintTrigger {
  private consecutiveMisses: number = 0;
  private lastCombo: number = 0;
  private powerUpCount: number = 0;
  private lastPowerUpUseTime: number = 0;
  private showHintCallback: (type: HintType) => void;

  constructor(showHintCallback: (type: HintType) => void) {
    this.showHintCallback = showHintCallback;
  }

  // Trigger on consecutive misses
  public onMiss(): void {
    this.consecutiveMisses++;

    if (this.consecutiveMisses >= 3) {
      this.showHintCallback(HintType.CHECK_SHAPE_COLOR);
      this.consecutiveMisses = 0;
    }
  }

  // Trigger on successful catch
  public onCatch(): void {
    this.consecutiveMisses = 0;
  }

  // Trigger on combo break
  public onComboChange(currentCombo: number): void {
    if (this.lastCombo >= 5 && currentCombo === 0) {
      this.showHintCallback(HintType.MAINTAIN_COMBO);
    }
    this.lastCombo = currentCombo;
  }

  // Trigger when powerups are available but unused
  public onPowerUpAvailable(count: number): void {
    const now = Date.now();
    this.powerUpCount = count;

    if (count >= 2 && now - this.lastPowerUpUseTime > 10000) {
      this.showHintCallback(HintType.USE_POWERUP);
    }
  }

  // Record powerup usage
  public onPowerUpUsed(): void {
    this.lastPowerUpUseTime = Date.now();
  }

  // Trigger on special shape appearance
  public onSpecialShapeSpawned(isFirstTime: boolean): void {
    if (isFirstTime) {
      this.showHintCallback(HintType.SPECIAL_SHAPE);
    }
  }

  // Trigger on bomb appearance
  public onBombSpawned(): void {
    this.showHintCallback(HintType.AVOID_BOMB);
  }

  // Reset all triggers
  public reset(): void {
    this.consecutiveMisses = 0;
    this.lastCombo = 0;
    this.powerUpCount = 0;
    this.lastPowerUpUseTime = 0;
  }
}
