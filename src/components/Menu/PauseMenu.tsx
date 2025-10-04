import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { GameStatus } from '../../types/game.types';

export const PauseMenu: React.FC = () => {
  const {
    resumeGame,
    restartGame,
    gameStatus,
    score,
    levelManager,
    comboSystem
  } = useGameStore();

  if (gameStatus !== GameStatus.PAUSED) {
    return null;
  }

  const currentLevel = levelManager.getCurrentLevel();
  const maxCombo = comboSystem.getMaxCount();

  const handleResume = () => {
    resumeGame();
  };

  const handleRestart = () => {
    restartGame();
  };

  const handleQuit = () => {
    // Go back to main menu
    restartGame();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 text-white">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">Game Paused</h2>
          <div className="text-gray-400">Take a break!</div>
        </div>

        {/* Current Stats */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-400 uppercase">Score</div>
              <div className="text-lg font-bold text-yellow-400">{score.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase">Level</div>
              <div className="text-lg font-bold text-blue-400">{currentLevel}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase">Best Combo</div>
              <div className="text-lg font-bold text-purple-400">{maxCombo}x</div>
            </div>
          </div>
        </div>

        {/* Menu Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleResume}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Resume Game
          </button>

          <button
            onClick={handleRestart}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Restart Level
          </button>

          <button
            onClick={handleQuit}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Main Menu
          </button>
        </div>

        {/* Controls Reminder */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <div className="mb-2">Controls:</div>
          <div className="space-y-1">
            <div>← → : Move catcher</div>
            <div>Space : Change shape/color</div>
            <div>ESC : Pause/Resume</div>
          </div>
        </div>
      </div>
    </div>
  );
};