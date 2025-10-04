import { create } from 'zustand';
import { GameStatus, GameMode, DifficultyLevel } from '../types/game.types';
import { ShapeType, ShapeColor } from '../types/shape.types';
import { Shape } from '../game/entities/Shape';
import { Catcher } from '../game/entities/Catcher';
import { ComboSystem } from '../game/ComboSystem';
import { LevelManager } from '../game/LevelManager';
import { AudioService } from '../services/AudioService';
import { INITIAL_LIVES } from '../config/constants';

export interface GameState {
  // Game status
  gameStatus: GameStatus;
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  isPaused: boolean;

  // Level and progress
  levelManager: LevelManager;
  score: number;
  lives: number;

  // Combo system
  comboSystem: ComboSystem;
  comboMessage: string;
  showComboMessage: boolean;

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
  completeLevel: () => void;
  proceedToNextLevel: () => void;

  // Combo system
  incrementCombo: () => void;
  resetCombo: () => void;
  updateCombo: (deltaTime: number) => void;
  showCombo: (message: string, duration?: number) => void;

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
const initialComboSystem = new ComboSystem();
const initialLevelManager = new LevelManager();

const initialState: GameState = {
  gameStatus: GameStatus.MENU,
  gameMode: GameMode.CLASSIC,
  difficulty: DifficultyLevel.NORMAL,
  isPaused: false,

  levelManager: initialLevelManager,
  score: 0,
  lives: INITIAL_LIVES,

  comboSystem: initialComboSystem,
  comboMessage: '',
  showComboMessage: false,

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
  startGame: () => {
    const newComboSystem = new ComboSystem();
    const newLevelManager = new LevelManager();
    const newCatcher = new Catcher();

    // Update available shapes and colors based on level
    const levelConfig = newLevelManager.getCurrentLevelConfig();
    const shapes = Object.values(ShapeType).slice(0, levelConfig.shapeTypeCount);
    const colors = Object.values(ShapeColor).slice(0, levelConfig.colorCount);

    newCatcher.setAvailableShapes(shapes);
    newCatcher.setAvailableColors(colors);

    set({
      gameStatus: GameStatus.PLAYING,
      score: 0,
      lives: INITIAL_LIVES,
      levelManager: newLevelManager,
      comboSystem: newComboSystem,
      comboMessage: '',
      showComboMessage: false,
      gameTime: 0,
      levelTime: 0,
      shapes: [],
      catcher: newCatcher,
      availableShapes: shapes,
      availableColors: colors
    });
  },

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
    const { score, comboSystem } = get();
    const finalPoints = comboSystem.calculateBonusScore(points);
    set({ score: score + finalPoints });
  },

  incrementCatch: () => {
    // Simple level completion after 20 seconds for faster gameplay
    const { levelTime } = get();
    if (levelTime > 20000) { // 20 seconds
      get().completeLevel();
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

  completeLevel: () => {
    AudioService.getInstance().playLevelComplete();
    set({ gameStatus: GameStatus.LEVEL_TRANSITION });
  },

  proceedToNextLevel: () => {
    const { levelManager, catcher } = get();
    levelManager.nextLevel();

    // Update available shapes and colors based on new level
    const levelConfig = levelManager.getCurrentLevelConfig();
    const shapes = Object.values(ShapeType).slice(0, levelConfig.shapeTypeCount);
    const colors = Object.values(ShapeColor).slice(0, levelConfig.colorCount);

    catcher.setAvailableShapes(shapes);
    catcher.setAvailableColors(colors);

    set({
      levelManager,
      catcher,
      levelTime: 0,
      gameStatus: GameStatus.PLAYING,
      shapes: [], // Clear existing shapes
      availableShapes: shapes,
      availableColors: colors
    });
  },

  // Combo system
  incrementCombo: () => {
    const { comboSystem } = get();
    comboSystem.increment();

    // Setup callbacks for combo system
    comboSystem.setOnTierReached((tier) => {
      get().showCombo(tier.message, 2000);
    });

    set({ comboSystem });
  },

  resetCombo: () => {
    const { comboSystem } = get();
    comboSystem.reset();
    set({ comboSystem });
  },

  updateCombo: (deltaTime: number) => {
    const { comboSystem } = get();
    comboSystem.update(deltaTime);
    set({ comboSystem });
  },

  showCombo: (message: string, duration: number = 1500) => {
    set({ comboMessage: message, showComboMessage: true });
    setTimeout(() => {
      set({ showComboMessage: false });
    }, duration);
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