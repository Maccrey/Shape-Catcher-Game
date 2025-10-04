import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Theme, ThemeId, ThemeRenderContext } from '../../types/theme.types';
import { THEMES, themeAnimations } from '../../config/themeConfig';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  unlockedThemes: ThemeId[];
  onSelectTheme: (themeId: ThemeId) => void;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  unlockedThemes,
  onSelectTheme,
  onClose
}) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>(currentTheme);

  const handleSelect = () => {
    onSelectTheme(selectedTheme);
    onClose();
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'nature':
        return 'from-green-500 to-emerald-600';
      case 'space':
        return 'from-purple-500 to-indigo-600';
      case 'elemental':
        return 'from-red-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Background Themes</h2>
            <p className="text-gray-400 mt-1">Change your game's atmosphere</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Preview Section */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Preview</h3>
          <ThemePreview themeId={selectedTheme} />
        </div>

        {/* Themes Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEMES.map(theme => {
              const isUnlocked = unlockedThemes.includes(theme.id);
              const isSelected = selectedTheme === theme.id;

              return (
                <motion.button
                  key={theme.id}
                  onClick={() => isUnlocked && setSelectedTheme(theme.id)}
                  disabled={!isUnlocked}
                  whileHover={isUnlocked ? { scale: 1.05 } : {}}
                  whileTap={isUnlocked ? { scale: 0.95 } : {}}
                  className={`relative p-4 rounded-xl border-2 transition-all overflow-hidden ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/20'
                      : isUnlocked
                      ? 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                      : 'border-gray-700 bg-gray-900/50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {/* Theme Preview Mini */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `linear-gradient(to bottom, ${theme.colors.gradient.start}, ${theme.colors.gradient.end})`
                    }}
                  />

                  {/* Lock Icon */}
                  {!isUnlocked && (
                    <div className="absolute top-2 right-2 text-2xl z-10">🔒</div>
                  )}

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold z-10">
                      SELECTED
                    </div>
                  )}

                  {/* Theme Info */}
                  <div className="relative z-10 text-left">
                    <h4 className="text-lg font-bold text-white mb-1">{theme.name}</h4>
                    <p className="text-sm text-gray-300 mb-3">{theme.description}</p>

                    {/* Category Badge */}
                    <div
                      className={`inline-block px-2 py-1 rounded text-xs font-bold bg-gradient-to-r ${getCategoryColor(
                        theme.category
                      )} text-white mb-3`}
                    >
                      {theme.category.toUpperCase()}
                    </div>

                    {/* Color Palette */}
                    <div className="flex gap-2 mb-3">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white/30"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white/30"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white/30"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>

                    {/* Unlock Condition */}
                    <div className="text-xs text-gray-400">
                      {isUnlocked ? '✓ Unlocked' : `🔒 ${theme.unlockCondition.description}`}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-700 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={selectedTheme === currentTheme}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
          >
            Apply Theme
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Theme Preview Component
const ThemePreview: React.FC<{ themeId: ThemeId }> = ({ themeId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) return;

    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const time = (currentTime - startTime) / 1000;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, theme.colors.gradient.start);
      if (theme.colors.gradient.middle) {
        gradient.addColorStop(0.5, theme.colors.gradient.middle);
      }
      gradient.addColorStop(1, theme.colors.gradient.end);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animation
      const renderContext: ThemeRenderContext = {
        ctx,
        width: canvas.width,
        height: canvas.height,
        time,
        deltaTime: 0.016
      };

      const animationRenderer = themeAnimations[theme.animation.type];
      if (animationRenderer) {
        animationRenderer(renderContext);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [themeId]);

  return (
    <div className="bg-gray-900/50 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} width={800} height={200} className="w-full h-auto" />
    </div>
  );
};
