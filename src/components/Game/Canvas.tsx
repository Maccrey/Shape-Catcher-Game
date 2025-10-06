import { useRef, useEffect } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../config/constants';
import { GameEngine } from '../../core/GameEngine';
import { useGameStore } from '../../store/gameStore';
import { GameStatus } from '../../types/game.types';

interface CanvasProps {
  className?: string;
}

export const Canvas: React.FC<CanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const gameStatus = useGameStore(state => state.gameStatus);

  // Initialize GameEngine once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for Canvas support
    if (!canvas.getContext) {
      console.error('Canvas is not supported in this browser');
      return;
    }

    // Set canvas size
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Initialize GameEngine
    const gameEngine = new GameEngine();
    gameEngine.initialize(canvas);
    gameEngineRef.current = gameEngine;

    // Store references for external access
    (canvas as any).__gameEngine = gameEngine;

    console.log('GameEngine initialized');

    // Cleanup on unmount
    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.cleanup();
      }
    };
  }, []);

  // Start/stop GameEngine based on game status
  useEffect(() => {
    const gameEngine = gameEngineRef.current;
    if (!gameEngine) return;

    if (gameStatus === GameStatus.PLAYING) {
      console.log('Starting game engine - status:', gameStatus);
      gameEngine.start();
    } else if (gameStatus === GameStatus.PAUSED) {
      console.log('Pausing game engine');
      gameEngine.pause();
    } else if (gameStatus === GameStatus.GAME_OVER || gameStatus === GameStatus.MENU) {
      console.log('Stopping game engine');
      gameEngine.stop();
    }
  }, [gameStatus]);

  return (
    <canvas
      ref={canvasRef}
      className={`border border-gray-300 ${className || ''}`}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  );
};
