import { useEffect, lazy, Suspense } from 'react';
import { Canvas } from './components/Game/Canvas';
import { StatusBar } from './components/UI/StatusBar';
import { useGameStore } from './store/gameStore';
import { GameStatus } from './types/game.types';

// Lazy load menu components for better initial load performance
const MainMenu = lazy(() => import('./components/Menu/MainMenu').then(m => ({ default: m.MainMenu })));
const PauseMenu = lazy(() => import('./components/Menu/PauseMenu').then(m => ({ default: m.PauseMenu })));
const GameOver = lazy(() => import('./components/Menu/GameOver').then(m => ({ default: m.GameOver })));

/**
 * Loading fallback component for lazy-loaded modules
 */
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <div className="text-white text-2xl animate-pulse">Loading...</div>
  </div>
);

function App() {
  const {
    gameStatus,
    startGame,
    proceedToNextLevel
  } = useGameStore();

  // Auto-proceed to next level after 3 seconds
  useEffect(() => {
    if (gameStatus === GameStatus.LEVEL_TRANSITION) {
      const timer = setTimeout(() => {
        proceedToNextLevel();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [gameStatus, proceedToNextLevel]);

  // Show main menu if game status is MENU
  if (gameStatus === GameStatus.MENU) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <MainMenu />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Status Bar - Always visible during gameplay */}
      {(gameStatus === GameStatus.PLAYING || gameStatus === GameStatus.PAUSED) && (
        <StatusBar />
      )}

      {/* Game Canvas */}
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="relative">
          <Canvas className="rounded-lg shadow-2xl border-2 border-gray-700" />

          {/* Level Transition Overlay */}
          {gameStatus === GameStatus.LEVEL_TRANSITION && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <div className="text-4xl font-bold mb-4 text-yellow-400">
                  Level Complete!
                </div>
                <div className="text-xl mb-2">
                  Advancing to Level {useGameStore.getState().levelManager.getCurrentLevel()}
                </div>
                <div className="text-gray-300">
                  Get ready for increased difficulty...
                </div>
                <div className="mt-4">
                  <div className="w-48 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay Menus - Lazy loaded */}
      <Suspense fallback={null}>
        <PauseMenu />
        <GameOver />
      </Suspense>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse" />
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-400 rotate-45 animate-bounce" />
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-green-400 animate-spin" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        <div className="absolute bottom-32 right-32 w-14 h-14 bg-red-400 animate-pulse" style={{ clipPath: 'polygon(25% 0%, 100% 50%, 25% 100%, 0% 50%)' }} />
      </div>
    </div>
  );
}

export default App;