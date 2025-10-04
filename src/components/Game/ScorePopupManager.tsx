import { useState, useCallback } from 'react';
import { ScorePopup } from './VisualEffects';

export interface PopupData {
  id: string;
  score: number;
  x: number;
  y: number;
  message?: string;
  color?: string;
}

export const ScorePopupManager: React.FC = () => {
  const [popups, setPopups] = useState<PopupData[]>([]);

  const addPopup = useCallback((popup: Omit<PopupData, 'id'>) => {
    const id = `popup-${Date.now()}-${Math.random()}`;
    setPopups(prev => [...prev, { ...popup, id }]);
  }, []);

  const removePopup = useCallback((id: string) => {
    setPopups(prev => prev.filter(p => p.id !== id));
  }, []);

  // Expose addPopup globally for GameEngine to use
  if (typeof window !== 'undefined') {
    (window as any).__addScorePopup = addPopup;
  }

  return (
    <>
      {popups.map(popup => (
        <ScorePopup
          key={popup.id}
          score={popup.score}
          x={popup.x}
          y={popup.y}
          message={popup.message}
          color={popup.color}
          onComplete={() => removePopup(popup.id)}
        />
      ))}
    </>
  );
};
