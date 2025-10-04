import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const StatusBar: React.FC = () => {
  const {
    score,
    lives,
    levelManager,
    comboSystem,
    gameTime,
    levelTime
  } = useGameStore();

  const currentLevel = levelManager.getCurrentLevel();
  const combo = comboSystem.getCount();
  const comboTier = comboSystem.getCurrentTier();
  const timerPercent = comboSystem.getTimerPercent();

  // Format time display
  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-gray-900 bg-opacity-80 text-white p-4">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        {/* Left side - Score and Level */}
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-xs text-gray-400">SCORE</div>
            <div className="text-xl font-bold text-yellow-400">{score.toLocaleString()}</div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-400">LEVEL</div>
            <div className="text-xl font-bold text-blue-400">{currentLevel}</div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-400">TIME</div>
            <div className="text-lg font-mono text-green-400">{formatTime(gameTime)}</div>
          </div>
        </div>

        {/* Center - Combo */}
        {combo > 0 && (
          <div className="text-center">
            <div className="text-xs text-gray-400">COMBO</div>
            <div
              className="text-2xl font-bold"
              style={{ color: comboTier?.color || '#fbbf24' }}
            >
              {combo}x
            </div>
            {comboTier && (
              <div
                className="text-sm font-semibold"
                style={{ color: comboTier.color }}
              >
                {comboTier.name}
              </div>
            )}

            {/* Combo timer bar */}
            <div className="mt-2 w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-100 ease-linear rounded-full"
                style={{
                  width: `${timerPercent * 100}%`,
                  backgroundColor: comboTier?.color || '#fbbf24'
                }}
              />
            </div>
          </div>
        )}

        {/* Right side - Lives */}
        <div className="text-center">
          <div className="text-xs text-gray-400">LIVES</div>
          <div className="flex space-x-1 mt-1">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                  i < lives
                    ? 'bg-red-500 border-red-400 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-500'
                }`}
              >
                ♥
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};