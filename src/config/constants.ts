// Game canvas dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

// Game performance
export const FPS = 60;
export const FRAME_TIME = 1000 / FPS;

// Catcher properties
export const CATCHER_HEIGHT = 60;
export const CATCHER_WIDTH = 60;
export const CATCHER_SPEED = 12.5;

// Shape properties
export const SHAPE_SIZE = 40;
export const SHAPE_SPAWN_MARGIN = 20;
export const SHAPE_FALL_SPEED_BASE = 0.000075;

// Combo system
export const COMBO_TIMEOUT = 3000; // 3 seconds
export const COMBO_TIERS = [3, 5, 10, 15, 20];

// Lives system
export const INITIAL_LIVES = 3;

// Collision detection
export const COLLISION_BUFFER = 5;

// Special shapes
export const SPECIAL_SHAPE_BASE_CHANCE = 0.1; // 10%
export const BOMB_BASE_CHANCE = 0.05; // 5%

// Animation
export const ROTATION_SPEED = 2;
export const PARTICLE_LIFETIME = 1000; // 1 second
export const PARTICLE_POOL_SIZE = 500;

// Input
export const INPUT_DEBOUNCE_TIME = 50; // 50ms
export const SWIPE_THRESHOLD = 30; // 30px