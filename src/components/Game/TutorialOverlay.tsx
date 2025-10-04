import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TutorialStep } from '../../types/tutorial.types';
import { TUTORIAL_STEPS } from '../../config/tutorialConfig';

interface TutorialOverlayProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  onComplete,
  onSkip
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const currentStep = TUTORIAL_STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / TUTORIAL_STEPS.length) * 100;

  useEffect(() => {
    if (currentStep.nextTrigger === 'auto' && currentStep.duration) {
      const timer = setTimeout(() => {
        handleNext();
      }, currentStep.duration);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleSkipTutorial = () => {
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Overlay with spotlight effect */}
        <div className="absolute inset-0 bg-black/70 pointer-events-auto">
          {currentStep.highlight?.area && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute border-4 border-yellow-400 rounded-lg"
              style={{
                left: currentStep.highlight.area.x,
                top: currentStep.highlight.area.y,
                width: currentStep.highlight.area.width,
                height: currentStep.highlight.area.height,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)'
              }}
            />
          )}
        </div>

        {/* Tutorial Card */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            key={currentStepIndex}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 max-w-md mx-4 shadow-2xl pointer-events-auto"
          >
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-white/80 mb-2">
                <span>Tutorial</span>
                <span>
                  {currentStepIndex + 1} / {TUTORIAL_STEPS.length}
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="text-white mb-6">
              <h2 className="text-3xl font-bold mb-3">{currentStep.title}</h2>
              <p className="text-lg text-white/90">{currentStep.description}</p>
            </div>

            {/* Action indicator */}
            {currentStep.action && currentStep.action !== 'wait' && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mb-6 p-4 bg-white/10 rounded-lg text-center"
              >
                <div className="text-yellow-300 font-semibold">
                  {getActionText(currentStep.action)}
                </div>
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              {currentStep.nextTrigger === 'click' && (
                <button
                  onClick={handleNext}
                  className="flex-1 bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  {currentStepIndex === TUTORIAL_STEPS.length - 1
                    ? "Let's Play!"
                    : 'Next'}
                </button>
              )}

              <button
                onClick={handleSkipTutorial}
                className="bg-white/10 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/20 transition-colors"
              >
                Skip
              </button>
            </div>
          </motion.div>
        </div>

        {/* Tutorial pointer/arrow for highlighted areas */}
        {currentStep.highlight?.area && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute"
            style={{
              left: currentStep.highlight.area.x + currentStep.highlight.area.width / 2,
              top: currentStep.highlight.area.y - 40,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="text-6xl animate-bounce">👇</div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

function getActionText(action: string): string {
  switch (action) {
    case 'change_shape':
      return '↑ Press UP or Swipe Up to change shape';
    case 'change_color':
      return '↓ Press DOWN or Swipe Down to change color';
    case 'catch':
      return 'Match and catch a shape!';
    default:
      return '';
  }
}

// Tutorial Manager Component
interface TutorialManagerProps {
  onActionPerformed?: (action: string) => void;
  children: React.ReactNode;
}

export const TutorialManager: React.FC<TutorialManagerProps> = ({
  onActionPerformed,
  children
}) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  useEffect(() => {
    // Check if user has completed tutorial
    const completed = localStorage.getItem('tutorial_completed');
    if (!completed) {
      setShowTutorial(true);
    } else {
      setTutorialCompleted(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('tutorial_completed', 'true');
    setShowTutorial(false);
    setTutorialCompleted(true);
  };

  const handleSkip = () => {
    localStorage.setItem('tutorial_completed', 'true');
    setShowTutorial(false);
    setTutorialCompleted(true);
  };

  return (
    <>
      {showTutorial && (
        <TutorialOverlay onComplete={handleComplete} onSkip={handleSkip} />
      )}
      {children}
    </>
  );
};
