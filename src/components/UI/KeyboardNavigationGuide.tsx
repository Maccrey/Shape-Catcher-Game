import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface KeyboardShortcut {
  keys: string[];
  description: string;
  category: 'gameplay' | 'navigation' | 'controls';
}

const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  // Gameplay
  { keys: ['↑', '↓'], description: 'Change shape', category: 'gameplay' },
  { keys: ['←', '→'], description: 'Change color', category: 'gameplay' },
  { keys: ['Space'], description: 'Use powerup', category: 'gameplay' },
  { keys: ['Esc'], description: 'Pause game', category: 'gameplay' },

  // Navigation
  { keys: ['Tab'], description: 'Navigate forward', category: 'navigation' },
  { keys: ['Shift', 'Tab'], description: 'Navigate backward', category: 'navigation' },
  { keys: ['Enter'], description: 'Select/Activate', category: 'navigation' },

  // Controls
  { keys: ['?'], description: 'Show this help', category: 'controls' },
  { keys: ['M'], description: 'Toggle mute', category: 'controls' },
];

export const KeyboardNavigationGuide: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.shiftKey) {
        setIsVisible(prev => !prev);
      } else if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-30 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-500"
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (Press ?)"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>

      {/* Guide overlay */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-labelledby="keyboard-guide-title"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2
                  id="keyboard-guide-title"
                  className="text-3xl font-bold text-white"
                >
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl focus:outline-none focus:ring-2 focus:ring-white rounded"
                  aria-label="Close keyboard guide"
                >
                  ✕
                </button>
              </div>

              {/* Shortcuts by category */}
              <div className="space-y-6">
                {['gameplay', 'navigation', 'controls'].map(category => (
                  <div key={category}>
                    <h3 className="text-xl font-bold text-blue-400 mb-3 capitalize">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {KEYBOARD_SHORTCUTS.filter(s => s.category === category).map(
                        (shortcut, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg"
                          >
                            <span className="text-gray-300">
                              {shortcut.description}
                            </span>
                            <div className="flex gap-2">
                              {shortcut.keys.map((key, i) => (
                                <kbd
                                  key={i}
                                  className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 font-mono text-sm"
                                >
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm text-center">
                  Press <kbd className="px-2 py-1 bg-gray-700 text-white rounded text-xs">
                    ?
                  </kbd>{' '}
                  to toggle this guide | Press{' '}
                  <kbd className="px-2 py-1 bg-gray-700 text-white rounded text-xs">
                    Esc
                  </kbd>{' '}
                  to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * Focus indicator component for keyboard navigation
 */
export const FocusIndicator: React.FC = () => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => {
    if (isKeyboardUser) {
      document.body.classList.add('keyboard-navigation');
    } else {
      document.body.classList.remove('keyboard-navigation');
    }
  }, [isKeyboardUser]);

  return null;
};

/**
 * CSS for enhanced focus styles
 */
export const focusStyles = `
  /* Default: Hide focus outline */
  * {
    outline: none;
  }

  /* Show focus outline only for keyboard users */
  body.keyboard-navigation *:focus {
    outline: 3px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Enhanced button focus */
  body.keyboard-navigation button:focus,
  body.keyboard-navigation a:focus {
    outline: 3px solid #3b82f6;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
  }

  /* Focus visible for specific elements */
  body.keyboard-navigation select:focus,
  body.keyboard-navigation input:focus,
  body.keyboard-navigation textarea:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 1px;
    border-color: #3b82f6;
  }

  /* Skip to content link */
  .skip-to-content {
    position: absolute;
    left: -9999px;
    z-index: 999;
    padding: 1rem 1.5rem;
    background-color: #1f2937;
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
  }

  .skip-to-content:focus {
    left: 1rem;
    top: 1rem;
  }
`;
