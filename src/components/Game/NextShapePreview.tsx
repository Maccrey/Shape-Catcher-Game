import { useEffect, useRef } from 'react';
import { Shape } from '../../game/entities/Shape';
import { drawShape } from '../../utils/renderUtils';

interface NextShapePreviewProps {
  nextShape: Shape | null;
  className?: string;
}

export const NextShapePreview: React.FC<NextShapePreviewProps> = ({
  nextShape,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw next shape if available
    if (nextShape) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const size = 60; // Preview size

      drawShape(
        ctx,
        nextShape.type,
        centerX,
        centerY,
        size,
        nextShape.color,
        0 // No rotation in preview
      );
    } else {
      // Draw placeholder
      ctx.fillStyle = '#888888';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', canvas.width / 2, canvas.height / 2);
    }
  }, [nextShape]);

  return (
    <div className={`flex flex-col items-center ${className || ''}`}>
      <div className="text-sm font-semibold text-gray-700 mb-2">Next Shape</div>
      <canvas
        ref={canvasRef}
        width={100}
        height={100}
        className="border-2 border-gray-300 rounded-lg bg-white shadow-md"
      />
      {nextShape && (
        <div className="mt-2 text-xs text-gray-600">
          <div className="capitalize">{nextShape.type}</div>
          <div className="capitalize">{nextShape.color}</div>
        </div>
      )}
    </div>
  );
};
