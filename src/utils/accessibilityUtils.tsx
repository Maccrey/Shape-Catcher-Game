import { useEffect, useRef } from 'react';

/**
 * ARIA live region announcer for screen readers
 */
export class AriaAnnouncer {
  private static instance: AriaAnnouncer;
  private liveRegion: HTMLDivElement | null = null;
  private politeRegion: HTMLDivElement | null = null;

  private constructor() {
    this.createLiveRegions();
  }

  public static getInstance(): AriaAnnouncer {
    if (!AriaAnnouncer.instance) {
      AriaAnnouncer.instance = new AriaAnnouncer();
    }
    return AriaAnnouncer.instance;
  }

  private createLiveRegions(): void {
    // Assertive region for important announcements
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', 'assertive');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    document.body.appendChild(this.liveRegion);

    // Polite region for less urgent announcements
    this.politeRegion = document.createElement('div');
    this.politeRegion.setAttribute('role', 'status');
    this.politeRegion.setAttribute('aria-live', 'polite');
    this.politeRegion.setAttribute('aria-atomic', 'true');
    this.politeRegion.className = 'sr-only';
    document.body.appendChild(this.politeRegion);
  }

  /**
   * Announce message assertively (interrupts current announcements)
   */
  public announce(message: string): void {
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        if (this.liveRegion) this.liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Announce message politely (waits for current announcements)
   */
  public announcePolite(message: string): void {
    if (this.politeRegion) {
      this.politeRegion.textContent = message;
      setTimeout(() => {
        if (this.politeRegion) this.politeRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Announce game state changes
   */
  public announceGameState(state: string, details?: string): void {
    const message = details ? `${state}: ${details}` : state;
    this.announce(message);
  }

  /**
   * Announce score updates
   */
  public announceScore(score: number, change?: number): void {
    const message = change
      ? `Score: ${score}. Gained ${change} points`
      : `Score: ${score}`;
    this.announcePolite(message);
  }

  /**
   * Announce combo
   */
  public announceCombo(combo: number): void {
    if (combo >= 5) {
      this.announce(`${combo} combo!`);
    }
  }

  /**
   * Announce level change
   */
  public announceLevel(level: number): void {
    this.announce(`Level ${level}`);
  }
}

/**
 * Hook for managing focus
 */
export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return containerRef;
}

/**
 * Hook for keyboard navigation
 */
export function useKeyboardNavigation(onNavigate: (direction: 'up' | 'down' | 'left' | 'right' | 'select') => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          onNavigate('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          onNavigate('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onNavigate('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNavigate('right');
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onNavigate('select');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);
}

/**
 * Accessible button component with proper ARIA attributes
 */
interface AccessibleButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  onClick,
  children,
  ariaLabel,
  disabled = false,
  variant = 'primary',
  className = ''
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-4';

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300'
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${className}`}
    >
      {children}
    </button>
  );
};

/**
 * Skip to main content link for keyboard users
 */
export const SkipToContent: React.FC<{ targetId: string }> = ({ targetId }) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
    >
      Skip to main content
    </a>
  );
};

/**
 * Game state announcer component
 */
interface GameStateAnnouncerProps {
  gameState: string;
  score: number;
  level: number;
  lives: number;
  combo: number;
}

export const GameStateAnnouncer: React.FC<GameStateAnnouncerProps> = ({
  gameState,
  score,
  level,
  lives,
  combo
}) => {
  const prevScore = useRef(score);
  const prevCombo = useRef(combo);
  const prevLevel = useRef(level);
  const announcer = AriaAnnouncer.getInstance();

  useEffect(() => {
    if (gameState === 'playing') {
      // Announce score changes
      if (score !== prevScore.current) {
        const change = score - prevScore.current;
        announcer.announceScore(score, change);
        prevScore.current = score;
      }

      // Announce combo milestones
      if (combo !== prevCombo.current && combo >= 5) {
        announcer.announceCombo(combo);
        prevCombo.current = combo;
      }

      // Announce level changes
      if (level !== prevLevel.current) {
        announcer.announceLevel(level);
        prevLevel.current = level;
      }
    }
  }, [gameState, score, level, combo, announcer]);

  useEffect(() => {
    // Announce game state changes
    switch (gameState) {
      case 'menu':
        announcer.announceGameState('Main Menu');
        break;
      case 'playing':
        announcer.announceGameState('Game Started', `Level ${level}`);
        break;
      case 'paused':
        announcer.announceGameState('Game Paused');
        break;
      case 'gameOver':
        announcer.announceGameState('Game Over', `Final Score: ${score}`);
        break;
    }
  }, [gameState, announcer, level, score]);

  // Low lives warning
  useEffect(() => {
    if (lives === 1) {
      announcer.announce('Warning: Only 1 life remaining!');
    }
  }, [lives, announcer]);

  return null; // This component doesn't render anything
};

/**
 * CSS for screen reader only content
 */
export const srOnlyStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .focus\\:not-sr-only:focus {
    position: static;
    width: auto;
    height: auto;
    padding: inherit;
    margin: inherit;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
`;
