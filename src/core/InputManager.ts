import { INPUT_DEBOUNCE_TIME, SWIPE_THRESHOLD } from '../config/constants';

export enum InputAction {
  MOVE_LEFT = 'move_left',
  MOVE_RIGHT = 'move_right',
  CHANGE_SHAPE = 'change_shape',
  CHANGE_COLOR = 'change_color',
  PAUSE = 'pause'
}

export type InputCallback = (action: InputAction) => void;

export class InputManager {
  private static instance: InputManager;

  private callbacks: Map<InputAction, InputCallback[]> = new Map();
  private keyStates: Map<string, boolean> = new Map();
  private lastInputTime: number = 0;

  // Touch handling
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private isTouching: boolean = false;

  private constructor() {
    this.setupKeyboardListeners();
    this.setupTouchListeners();
  }

  public static getInstance(): InputManager {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager();
    }
    return InputManager.instance;
  }

  public on(action: InputAction, callback: InputCallback): void {
    if (!this.callbacks.has(action)) {
      this.callbacks.set(action, []);
    }
    this.callbacks.get(action)!.push(callback);
  }

  public off(action: InputAction, callback: InputCallback): void {
    const callbacks = this.callbacks.get(action);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  public isKeyDown(key: string): boolean {
    return this.keyStates.get(key) || false;
  }

  private emit(action: InputAction): void {
    // Debounce inputs
    const now = Date.now();
    if (now - this.lastInputTime < INPUT_DEBOUNCE_TIME) {
      return;
    }
    this.lastInputTime = now;

    const callbacks = this.callbacks.get(action);
    if (callbacks) {
      callbacks.forEach(callback => callback(action));
    }
  }

  private setupKeyboardListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private setupTouchListeners(): void {
    document.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    document.addEventListener('pointermove', this.handlePointerMove.bind(this));
    document.addEventListener('pointerup', this.handlePointerUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key;
    this.keyStates.set(key, true);

    switch (key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.emit(InputAction.MOVE_LEFT);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.emit(InputAction.MOVE_RIGHT);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.emit(InputAction.CHANGE_SHAPE);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.emit(InputAction.CHANGE_COLOR);
        break;
      case ' ':
        event.preventDefault();
        this.emit(InputAction.CHANGE_SHAPE);
        break;
      case 'Escape':
        event.preventDefault();
        this.emit(InputAction.PAUSE);
        break;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keyStates.set(event.key, false);
  }

  private handlePointerDown(event: PointerEvent): void {
    this.isTouching = true;
    this.touchStartX = event.clientX;
    this.touchStartY = event.clientY;
  }

  private handlePointerMove(event: PointerEvent): void {
    if (!this.isTouching) return;
    // Prevent scrolling while touching
    event.preventDefault();
  }

  private handlePointerUp(event: PointerEvent): void {
    if (!this.isTouching) return;
    this.isTouching = false;

    const deltaX = event.clientX - this.touchStartX;
    const deltaY = event.clientY - this.touchStartY;

    // Check for swipe gestures
    if (Math.abs(deltaX) > SWIPE_THRESHOLD || Math.abs(deltaY) > SWIPE_THRESHOLD) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          this.emit(InputAction.MOVE_RIGHT);
        } else {
          this.emit(InputAction.MOVE_LEFT);
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          this.emit(InputAction.CHANGE_COLOR);
        } else {
          this.emit(InputAction.CHANGE_SHAPE);
        }
      }
    } else {
      // Tap gesture - change shape
      this.emit(InputAction.CHANGE_SHAPE);
    }
  }

  public cleanup(): void {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
    document.removeEventListener('pointerdown', this.handlePointerDown.bind(this));
    document.removeEventListener('pointermove', this.handlePointerMove.bind(this));
    document.removeEventListener('pointerup', this.handlePointerUp.bind(this));
  }
}