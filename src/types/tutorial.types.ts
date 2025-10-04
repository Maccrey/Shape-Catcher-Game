export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  highlight?: {
    element?: string; // CSS selector
    area?: { x: number; y: number; width: number; height: number };
  };
  action?: 'wait' | 'click' | 'catch' | 'change_shape' | 'change_color';
  nextTrigger?: 'auto' | 'action' | 'click';
  duration?: number; // for auto-advance
}

export interface TutorialProgress {
  currentStep: number;
  completed: boolean;
  skipped: boolean;
}
