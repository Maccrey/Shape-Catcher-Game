import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { GameMode, DifficultyLevel } from '../../types/game.types';

export const MainMenu: React.FC = () => {
  const {
    startGame,
    setGameMode,
    setDifficulty,
    gameMode,
    difficulty
  } = useGameStore();

  const handleStartGame = () => {
    startGame();
  };

  const gameModes = [
    { value: GameMode.CLASSIC, label: 'Classic', description: '20 levels of increasing difficulty' },
    { value: GameMode.ENDLESS, label: 'Endless', description: 'Survive as long as you can' },
    { value: GameMode.TIME_ATTACK, label: 'Time Attack', description: 'Score as much as possible in 3 minutes' }
  ];

  const difficulties = [
    { value: DifficultyLevel.EASY, label: 'Easy', description: 'Slower falling speed' },
    { value: DifficultyLevel.NORMAL, label: 'Normal', description: 'Balanced gameplay' },
    { value: DifficultyLevel.HARD, label: 'Hard', description: 'Faster falling speed' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md w-full mx-4">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            Shape
          </h1>
          <h1 className="text-6xl font-bold text-yellow-400 drop-shadow-lg">
            Catcher
          </h1>
          <p className="text-gray-300 text-lg">
            Match shapes and colors to score points!
          </p>
        </div>

        {/* Game Mode Selection */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Game Mode</h3>
          <div className="space-y-2">
            {gameModes.map((mode) => (
              <button
                key={mode.value}
                onClick={() => setGameMode(mode.value)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  gameMode === mode.value
                    ? 'border-yellow-400 bg-yellow-400 bg-opacity-20 text-yellow-100'
                    : 'border-gray-600 bg-gray-800 bg-opacity-50 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="font-semibold">{mode.label}</div>
                <div className="text-sm opacity-80">{mode.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Difficulty</h3>
          <div className="grid grid-cols-3 gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                onClick={() => setDifficulty(diff.value)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  difficulty === diff.value
                    ? 'border-yellow-400 bg-yellow-400 bg-opacity-20 text-yellow-100'
                    : 'border-gray-600 bg-gray-800 bg-opacity-50 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="font-semibold text-sm">{diff.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartGame}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Start Game
        </button>

        {/* Controls Info */}
        <div className="text-gray-400 text-sm space-y-1">
          <div>Use arrow keys or swipe to move</div>
          <div>Space or tap to change shape/color</div>
          <div>ESC to pause</div>
        </div>
      </div>
    </div>
  );
};