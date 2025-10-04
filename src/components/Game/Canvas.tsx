import { useRef, useEffect } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../config/constants';
import { GameEngine } from '../../core/GameEngine';

interface CanvasProps {
  className?: string;
}

export const Canvas: React.FC<CanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);

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

    // Cleanup on unmount
    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.cleanup();
      }
    };
  }, []);

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