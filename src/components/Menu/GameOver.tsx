import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { GameStatus } from '../../types/game.types';

export const GameOver: React.FC = () => {
  const {
    restartGame,
    startGame,
    gameStatus,
    score,
    levelManager,
    comboSystem,
    gameTime
  } = useGameStore();

  console.log('GameOver render - status:', gameStatus);

  if (gameStatus !== GameStatus.GAME_OVER) {
    return null;
  }

  console.log('GameOver showing!');

  const currentLevel = levelManager.getCurrentLevel();
  const maxCombo = comboSystem.getMaxCount();
  const totalTime = Math.floor(gameTime / 1000);

  const handleRestart = () => {
    startGame();
  };

  const handleMainMenu = () => {
    restartGame();
  };

  // Calculate performance metrics
  const getPerformanceGrade = () => {
    if (score >= 10000) return { grade: 'S', color: 'text-yellow-400', bg: 'bg-yellow-400' };
    if (score >= 5000) return { grade: 'A', color: 'text-green-400', bg: 'bg-green-400' };
    if (score >= 2000) return { grade: 'B', color: 'text-blue-400', bg: 'bg-blue-400' };
    if (score >= 1000) return { grade: 'C', color: 'text-purple-400', bg: 'bg-purple-400' };
    return { grade: 'D', color: 'text-gray-400', bg: 'bg-gray-400' };
  };

  const performance = getPerformanceGrade();
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90">
      <div className="bg-gray-900 rounded-lg p-8 max-w-lg w-full mx-4 text-white shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-red-400 mb-2">Game Over</h2>
          <div className="text-gray-400">Better luck next time!</div>
        </div>

        {/* Performance Grade */}
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${performance.bg} bg-opacity-20 border-4 border-current ${performance.color} text-4xl font-bold`}
          >
            {performance.grade}
          </div>
        </div>

        {/* Final Stats */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase">Final Score</div>
              <div className="text-2xl font-bold text-yellow-400">{score.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase">Level Reached</div>
              <div className="text-2xl font-bold text-blue-400">{currentLevel}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase">Best Combo</div>
              <div className="text-2xl font-bold text-purple-400">{maxCombo}x</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase">Time Played</div>
              <div className="text-2xl font-bold text-green-400">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-400 mb-2">Achievements:</div>
          <div className="space-y-1 text-sm">
            {maxCombo >= 10 && (
              <div className="text-purple-300">🔥 Combo Master - Reached {maxCombo}x combo!</div>
            )}
            {currentLevel >= 5 && (
              <div className="text-blue-300">🏆 Level Climber - Reached level {currentLevel}!</div>
            )}
            {score >= 5000 && (
              <div className="text-yellow-300">💎 High Scorer - Scored {score.toLocaleString()} points!</div>
            )}
            {totalTime >= 300 && (
              <div className="text-green-300">⏰ Endurance - Played for {minutes} minutes!</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRestart}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Play Again
          </button>

          <button
            onClick={handleMainMenu}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};