import { Character, PowerUpType } from './types';

export const CHARACTERS: Character[] = [
  {
    id: 'char_1',
    name: 'Roberto',
    color: '#1e3a8a', // blue-900 (Police Blue)
    accentColor: '#60a5fa',
    powerUp: PowerUpType.DOUBLE_SCORE, 
    description: 'Police Officer. Collect 10 Coins to reload Handcuffs. Ctrl to Shoot.',
  },
  {
    id: 'char_2',
    name: 'Steve',
    color: '#b91c1c', // red-700
    accentColor: '#fca5a5',
    powerUp: PowerUpType.MAGNET,
    description: 'Living Axe. Collect 10 Coins to reload Fireballs. Ctrl to Shoot.',
  },
  {
    id: 'char_3',
    name: 'El',
    color: '#fca5a5', 
    accentColor: '#ef4444', 
    powerUp: PowerUpType.SUPER_JUMP,
    description: 'Psychokinetic. Collect 10 Coins to reload Blood Blast. Ctrl to Shoot.',
  },
  {
    id: 'char_4',
    name: 'Lord Amber',
    color: '#f59e0b', // amber-500
    accentColor: '#000000',
    powerUp: PowerUpType.SHIELD,
    description: 'Sith Lord. Collect 10 Coins to reload Light Stars. Ctrl to Shoot.',
  },
  {
    id: 'char_5',
    name: 'Hopper',
    color: '#78350f', // amber-900
    accentColor: '#d4d4d8',
    powerUp: PowerUpType.SLOW_TIME,
    description: 'Chief. Collect 10 Coins to reload Neon Cats. Ctrl to Shoot.',
  },
  {
    id: 'char_6',
    name: '6-7',
    color: '#10b981', // emerald-500
    accentColor: '#34d399',
    powerUp: PowerUpType.FLOATY,
    description: 'The Numbers. Collect 10 Coins to reload Number Bolts. Ctrl to Shoot.',
  },
  {
    id: 'char_7',
    name: 'Specter',
    color: '#64748b', // slate-500
    accentColor: '#94a3b8',
    powerUp: PowerUpType.PHASE_SHIFT,
    description: 'Ghost. Collect 10 Coins to reload Ecto-Blast. Ctrl to Shoot.',
  },
  {
    id: 'char_8',
    name: 'Shotgun-Bomb',
    color: '#f472b6', // Pink-400
    accentColor: '#be185d', 
    powerUp: PowerUpType.NONE,
    description: 'Pig with Bazooka. Collect 10 Coins to reload Rockets. Ctrl to Shoot.',
  },
];

export const GAME_CONFIG = {
  LANE_WIDTH: 2,
  GRAVITY: 0.1, 
  JUMP_FORCE: 1.5,
  SUPER_JUMP_FORCE: 2.2,
  INITIAL_SPEED: 0.15,
  MAX_SPEED: 1.5,
  SPEED_INCREMENT: 0.00005, 
  SPEED_BOOST_AMOUNT: 0.1, 
  DRAW_DISTANCE: 60,
  PLAYER_Z: 0, 
};