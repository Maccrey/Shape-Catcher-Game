import { TutorialStep } from '../types/tutorial.types';

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Shape Catcher!',
    description: 'Learn the basics and start catching shapes. Tap to continue.',
    nextTrigger: 'click',
    duration: 3000
  },
  {
    id: 'goal',
    title: 'Your Goal',
    description: 'Match the falling shapes by changing your catcher\'s shape and color. The catcher at the bottom shows what you can catch.',
    highlight: {
      area: { x: 0, y: 500, width: 600, height: 100 }
    },
    nextTrigger: 'click'
  },
  {
    id: 'move',
    title: 'Move the Catcher',
    description: 'Use arrow keys (← →) or swipe left/right to move the catcher.',
    action: 'wait',
    nextTrigger: 'click'
  },
  {
    id: 'change_shape',
    title: 'Change Shape',
    description: 'Press UP arrow or swipe up to change the catcher\'s shape.',
    action: 'change_shape',
    nextTrigger: 'action'
  },
  {
    id: 'change_color',
    title: 'Change Color',
    description: 'Press DOWN arrow or swipe down to change the catcher\'s color.',
    action: 'change_color',
    nextTrigger: 'action'
  },
  {
    id: 'first_catch',
    title: 'Catch a Shape!',
    description: 'Now try to catch a falling shape by matching both its shape AND color.',
    action: 'catch',
    nextTrigger: 'action'
  },
  {
    id: 'combo',
    title: 'Build Combos',
    description: 'Catch shapes consecutively without missing to build combos and earn bonus points!',
    nextTrigger: 'click'
  },
  {
    id: 'special_shapes',
    title: 'Special Shapes',
    description: 'Watch for special shapes like diamonds 💎, golden stars ⭐, and rainbows 🌈 for bonus points!',
    nextTrigger: 'click'
  },
  {
    id: 'bombs',
    title: 'Avoid Bombs!',
    description: 'Watch out for bombs 💣! Catching them will stun you and cost points.',
    nextTrigger: 'click'
  },
  {
    id: 'ready',
    title: 'You\'re Ready!',
    description: 'Good luck! Try to complete all 20 levels and beat your high score!',
    nextTrigger: 'click'
  }
];

export function getTutorialStep(id: string): TutorialStep | undefined {
  return TUTORIAL_STEPS.find(step => step.id === id);
}

export function getTutorialStepByIndex(index: number): TutorialStep | undefined {
  return TUTORIAL_STEPS[index];
}

export function getTotalSteps(): number {
  return TUTORIAL_STEPS.length;
}
