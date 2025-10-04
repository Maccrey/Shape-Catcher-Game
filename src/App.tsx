import { useRef, useEffect } from 'react';
import { Canvas } from './components/Game/Canvas';
import { useGameStore } from './store/gameStore';
import { GameStatus } from './types/game.types';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    gameStatus,
    startGame,
    restartGame,
    proceedToNextLevel,
    score,
    levelManager
  } = useGameStore();

  const handleStartGame = () => {
    const canvas = document.querySelector('canvas');
    const gameEngine = (canvas as any)?.__gameEngine;

    if (gameEngine) {
      startGame();
      gameEngine.start();
    }
  };

  const handleRestartGame = () => {
    const canvas = document.querySelector('canvas');
    const gameEngine = (canvas as any)?.__gameEngine;

    if (gameEngine) {
      gameEngine.stop();
      restartGame();
      gameEngine.start();
    }
  };

  const handleNextLevel = () => {
    proceedToNextLevel();
  };

  // Auto-proceed to next level after 3 seconds
  useEffect(() => {
    if (gameStatus === GameStatus.LEVEL_TRANSITION) {
      const timer = setTimeout(() => {
        handleNextLevel();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [gameStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Shape Catcher Game</h1>
        <Canvas className="mx-auto rounded-lg shadow-lg" />
        <div className="mt-4 space-x-4">
          {gameStatus === GameStatus.MENU && (
            <button
              onClick={handleStartGame}
              className="bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Game
            </button>
          )}

          {gameStatus === GameStatus.GAME_OVER && (
            <>
              <div className="text-white mb-4">
                <p className="text-xl">Game Over!</p>
                <p>Final Score: {score}</p>
              </div>
              <button
                onClick={handleRestartGame}
                className="bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Play Again
              </button>
            </>
          )}

          {gameStatus === GameStatus.LEVEL_TRANSITION && (
            <>
              <div className="text-white mb-4">
                <p className="text-2xl">Level {levelManager.getCurrentLevel() - 1} Complete!</p>
                <p className="text-lg">Level {levelManager.getCurrentLevel()} starting soon...</p>
                <p>Score: {score}</p>
              </div>
              <button
                onClick={handleNextLevel}
                className="bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Continue
              </button>
            </>
          )}

          {gameStatus === GameStatus.PLAYING && (
            <div className="text-white text-sm">
              <p>Use arrow keys to move and change shape/color</p>
              <p>Press ESC to pause</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App