import { create } from 'zustand';
import { GameStatus, GameMode, DifficultyLevel } from '../types/game.types';
import { ShapeType, ShapeColor } from '../types/shape.types';
import { Shape } from '../game/entities/Shape';
import { Catcher } from '../game/entities/Catcher';
import { INITIAL_LIVES } from '../config/constants';

export interface GameState {
  // Game status
  gameStatus: GameStatus;
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  isPaused: boolean;

  // Level and progress
  currentLevel: number;
  score: number;
  lives: number;
  catchCount: number;
  targetCatches: number;

  // Combo system
  combo: number;
  maxCombo: number;
  comboTimer: number;

  // Entities
  shapes: Shape[];
  catcher: Catcher;
  nextShape: { type: ShapeType; color: ShapeColor } | null;

  // Time
  gameTime: number;
  levelTime: number;

  // Game settings
  availableShapes: ShapeType[];
  availableColors: ShapeColor[];
}

export interface GameActions {
  // Game control
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  gameOver: () => void;

  // Score and progress
  addScore: (points: number) => void;
  incrementCatch: () => void;
  decrementLives: () => void;
  nextLevel: () => void;

  // Combo system
  incrementCombo: () => void;
  resetCombo: () => void;
  updateComboTimer: (time: number) => void;

  // Shapes
  addShape: (shape: Shape) => void;
  removeShape: (shapeId: string) => void;
  updateShapes: (shapes: Shape[]) => void;
  clearShapes: () => void;

  // Catcher
  moveCatcherLeft: () => void;
  moveCatcherRight: () => void;
  changeCatcherShape: () => void;
  changeCatcherColor: () => void;
  setCatcherShape: (shape: ShapeType) => void;
  setCatcherColor: (color: ShapeColor) => void;

  // Time
  updateGameTime: (deltaTime: number) => void;
  updateLevelTime: (deltaTime: number) => void;

  // Settings
  setGameMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  setAvailableShapes: (shapes: ShapeType[]) => void;
  setAvailableColors: (colors: ShapeColor[]) => void;

  // Next shape
  setNextShape: (shape: { type: ShapeType; color: ShapeColor } | null) => void;
}

const initialCatcher = new Catcher();

const initialState: GameState = {
  gameStatus: GameStatus.MENU,
  gameMode: GameMode.CLASSIC,
  difficulty: DifficultyLevel.NORMAL,
  isPaused: false,

  currentLevel: 1,
  score: 0,
  lives: INITIAL_LIVES,
  catchCount: 0,
  targetCatches: 20,

  combo: 0,
  maxCombo: 0,
  comboTimer: 0,

  shapes: [],
  catcher: initialCatcher,
  nextShape: null,

  gameTime: 0,
  levelTime: 0,

  availableShapes: [ShapeType.SQUARE, ShapeType.TRIANGLE, ShapeType.CIRCLE, ShapeType.STAR],
  availableColors: [ShapeColor.RED, ShapeColor.BLUE, ShapeColor.GREEN, ShapeColor.YELLOW]
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  // Game control
  startGame: () => set({
    gameStatus: GameStatus.PLAYING,
    score: 0,
    lives: INITIAL_LIVES,
    currentLevel: 1,
    catchCount: 0,
    combo: 0,
    maxCombo: 0,
    gameTime: 0,
    levelTime: 0,
    shapes: [],
    catcher: new Catcher()
  }),

  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),

  restartGame: () => {
    const { gameMode, difficulty } = get();
    set({
      ...initialState,
      gameMode,
      difficulty,
      catcher: new Catcher()
    });
  },

  gameOver: () => set({ gameStatus: GameStatus.GAME_OVER }),

  // Score and progress
  addScore: (points: number) => {
    const { score, combo } = get();
    const comboMultiplier = Math.floor(combo / 5) * 0.1 + 1; // 10% bonus per 5 combo
    const finalPoints = Math.floor(points * comboMultiplier);
    set({ score: score + finalPoints });
  },

  incrementCatch: () => {
    const { catchCount, targetCatches } = get();
    const newCatchCount = catchCount + 1;
    set({ catchCount: newCatchCount });

    if (newCatchCount >= targetCatches) {
      set({ gameStatus: GameStatus.LEVEL_TRANSITION });
    }
  },

  decrementLives: () => {
    const { lives } = get();
    const newLives = lives - 1;
    set({ lives: newLives });

    if (newLives <= 0) {
      set({ gameStatus: GameStatus.GAME_OVER });
    }
  },

  nextLevel: () => {
    const { currentLevel } = get();
    set({
      currentLevel: currentLevel + 1,
      catchCount: 0,
      levelTime: 0,
      gameStatus: GameStatus.PLAYING
    });
  },

  // Combo system
  incrementCombo: () => {
    const { combo, maxCombo } = get();
    const newCombo = combo + 1;
    set({
      combo: newCombo,
      maxCombo: Math.max(maxCombo, newCombo),
      comboTimer: 3000 // Reset to 3 seconds
    });
  },

  resetCombo: () => set({ combo: 0, comboTimer: 0 }),

  updateComboTimer: (time: number) => {
    const { comboTimer } = get();
    const newTimer = Math.max(0, comboTimer - time);
    set({ comboTimer: newTimer });

    if (newTimer <= 0 && comboTimer > 0) {
      set({ combo: 0 });
    }
  },

  // Shapes
  addShape: (shape: Shape) => {
    const { shapes } = get();
    set({ shapes: [...shapes, shape] });
  },

  removeShape: (shapeId: string) => {
    const { shapes } = get();
    set({ shapes: shapes.filter(shape => shape.id !== shapeId) });
  },

  updateShapes: (shapes: Shape[]) => set({ shapes }),

  clearShapes: () => set({ shapes: [] }),

  // Catcher
  moveCatcherLeft: () => {
    const { catcher } = get();
    catcher.moveLeft();
    set({ catcher });
  },

  moveCatcherRight: () => {
    const { catcher } = get();
    catcher.moveRight();
    set({ catcher });
  },

  changeCatcherShape: () => {
    const { catcher } = get();
    catcher.changeShape();
    set({ catcher });
  },

  changeCatcherColor: () => {
    const { catcher } = get();
    catcher.changeColor();
    set({ catcher });
  },

  setCatcherShape: (shape: ShapeType) => {
    const { catcher } = get();
    catcher.setShape(shape);
    set({ catcher });
  },

  setCatcherColor: (color: ShapeColor) => {
    const { catcher } = get();
    catcher.setColor(color);
    set({ catcher });
  },

  // Time
  updateGameTime: (deltaTime: number) => {
    const { gameTime } = get();
    set({ gameTime: gameTime + deltaTime });
  },

  updateLevelTime: (deltaTime: number) => {
    const { levelTime } = get();
    set({ levelTime: levelTime + deltaTime });
  },

  // Settings
  setGameMode: (mode: GameMode) => set({ gameMode: mode }),
  setDifficulty: (difficulty: DifficultyLevel) => set({ difficulty }),

  setAvailableShapes: (shapes: ShapeType[]) => {
    const { catcher } = get();
    catcher.setAvailableShapes(shapes);
    set({ availableShapes: shapes, catcher });
  },

  setAvailableColors: (colors: ShapeColor[]) => {
    const { catcher } = get();
    catcher.setAvailableColors(colors);
    set({ availableColors: colors, catcher });
  },

  // Next shape
  setNextShape: (shape: { type: ShapeType; color: ShapeColor } | null) => set({ nextShape: shape })
}));