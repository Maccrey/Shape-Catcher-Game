export enum ShapeType {
  SQUARE = 'square',
  TRIANGLE = 'triangle',
  CIRCLE = 'circle',
  STAR = 'star'
}

export enum ShapeColor {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
  PURPLE = 'purple',
  ORANGE = 'orange'
}

export enum SpecialShapeType {
  DIAMOND = 'diamond',
  RAINBOW = 'rainbow',
  GOLDEN_STAR = 'golden_star',
  BOMB = 'bomb',
  TIME_BONUS = 'time_bonus',
  MULTIPLIER = 'multiplier'
}

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Shape {
  id: string;
  type: ShapeType | SpecialShapeType;
  color: ShapeColor;
  position: Position;
  velocity: Velocity;
  size: number;
  rotation: number;
}