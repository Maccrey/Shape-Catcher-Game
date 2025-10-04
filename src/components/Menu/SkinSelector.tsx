import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Skin, SkinId, SkinRarity } from '../../types/skin.types';
import { SKINS } from '../../config/skinConfig';
import { ShapeType } from '../../types/shape.types';

interface SkinSelectorProps {
  currentSkin: SkinId;
  unlockedSkins: SkinId[];
  onSelectSkin: (skinId: SkinId) => void;
  onClose: () => void;
}

export const SkinSelector: React.FC<SkinSelectorProps> = ({
  currentSkin,
  unlockedSkins,
  onSelectSkin,
  onClose
}) => {
  const [selectedSkin, setSelectedSkin] = useState<SkinId>(currentSkin);
  const [previewShape, setPreviewShape] = useState<ShapeType>(ShapeType.CIRCLE);

  const handleSelect = () => {
    onSelectSkin(selectedSkin);
    onClose();
  };

  const getRarityColor = (rarity: SkinRarity): string => {
    switch (rarity) {
      case SkinRarity.COMMON:
        return 'from-gray-500 to-gray-600';
      case SkinRarity.RARE:
        return 'from-blue-500 to-blue-600';
      case SkinRarity.EPIC:
        return 'from-purple-500 to-purple-600';
      case SkinRarity.LEGENDARY:
        return 'from-yellow-500 to-orange-500';
    }
  };

  const getRarityBorderColor = (rarity: SkinRarity): string => {
    switch (rarity) {
      case SkinRarity.COMMON:
        return 'border-gray-500';
      case SkinRarity.RARE:
        return 'border-blue-500';
      case SkinRarity.EPIC:
        return 'border-purple-500';
      case SkinRarity.LEGENDARY:
        return 'border-yellow-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Catcher Skins</h2>
            <p className="text-gray-400 mt-1">Customize your catcher appearance</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Preview Section */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Preview</h3>
            <div className="flex gap-2">
              {[ShapeType.CIRCLE, ShapeType.SQUARE, ShapeType.TRIANGLE, ShapeType.STAR].map(
                shape => (
                  <button
                    key={shape}
                    onClick={() => setPreviewShape(shape)}
                    className={`px-3 py-1 rounded transition-colors ${
                      previewShape === shape
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {shape}
                  </button>
                )
              )}
            </div>
          </div>
          <SkinPreview skinId={selectedSkin} shapeType={previewShape} />
        </div>

        {/* Skins Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SKINS.map(skin => {
              const isUnlocked = unlockedSkins.includes(skin.id);
              const isSelected = selectedSkin === skin.id;

              return (
                <motion.button
                  key={skin.id}
                  onClick={() => isUnlocked && setSelectedSkin(skin.id)}
                  disabled={!isUnlocked}
                  whileHover={isUnlocked ? { scale: 1.05 } : {}}
                  whileTap={isUnlocked ? { scale: 0.95 } : {}}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? `${getRarityBorderColor(skin.rarity)} bg-gradient-to-br ${getRarityColor(
                          skin.rarity
                        )}/20`
                      : isUnlocked
                      ? 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                      : 'border-gray-700 bg-gray-900/50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {/* Lock Icon */}
                  {!isUnlocked && (
                    <div className="absolute top-2 right-2 text-2xl">🔒</div>
                  )}

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                      SELECTED
                    </div>
                  )}

                  {/* Skin Info */}
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-white mb-1">{skin.name}</h4>
                    <p className="text-sm text-gray-400 mb-3">{skin.description}</p>

                    {/* Rarity Badge */}
                    <div
                      className={`inline-block px-2 py-1 rounded text-xs font-bold bg-gradient-to-r ${getRarityColor(
                        skin.rarity
                      )} text-white mb-3`}
                    >
                      {skin.rarity.toUpperCase()}
                    </div>

                    {/* Unlock Condition */}
                    <div className="text-xs text-gray-500">
                      {isUnlocked ? '✓ Unlocked' : `🔒 ${skin.unlockCondition.description}`}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-700 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={selectedSkin === currentSkin}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
          >
            Apply Skin
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Skin Preview Component
const SkinPreview: React.FC<{ skinId: SkinId; shapeType: ShapeType }> = ({
  skinId,
  shapeType
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const skin = SKINS.find(s => s.id === skinId);
    if (!skin) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw skin preview
    const x = 50;
    const y = 20;
    const width = 100;
    const height = 80;
    const color = '#3b82f6'; // Blue color for preview

    skin.renderFunction(ctx, x, y, width, height, shapeType, color);
  }, [skinId, shapeType]);

  return (
    <div className="bg-gray-900/50 rounded-lg p-4 flex justify-center">
      <canvas ref={canvasRef} width={200} height={120} className="rounded" />
    </div>
  );
};
