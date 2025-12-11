
export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export enum PowerUpType {
  NONE = 'NONE',
  SHIELD = 'SHIELD',
  MAGNET = 'MAGNET',
  DOUBLE_SCORE = 'DOUBLE_SCORE',
  SUPER_JUMP = 'SUPER_JUMP',
  SLOW_TIME = 'SLOW_TIME',
  DOUBLE_COINS = 'DOUBLE_COINS',
  PHASE_SHIFT = 'PHASE_SHIFT', // Pass through low obstacles
  FLOATY = 'FLOATY',
}

export interface Character {
  id: string;
  name: string;
  color: string;
  accentColor: string;
  powerUp: PowerUpType;
  description: string;
}

export enum Lane {
  FAR_LEFT = -2,
  LEFT = -1,
  CENTER = 0,
  RIGHT = 1,
  FAR_RIGHT = 2,
}

export enum ObstacleType {
  LOW_BARRIER = 'LOW_BARRIER', // Jump over
  HIGH_BARRIER = 'HIGH_BARRIER', // Roll under
  TRAIN = 'TRAIN', // Block full lane
}

export interface Entity {
  x: number; // Lane (-2, -1, 0, 1, 2)
  y: number; // Vertical height (0 is ground)
  z: number; // Depth
  width: number;
  height: number;
  type: ObstacleType | 'PIZZA' | 'SPEED_BOOST' | 'PROJECTILE';
  subType?: string; // To distinguish projectile visuals (BLOOD, HANDCUFF, FIREBALL, etc)
  active: boolean;
}

export interface GameStats {
  score: number;
  coins: number;
  distance: number;
}
