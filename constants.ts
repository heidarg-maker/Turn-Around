
import { Character, PowerUpType } from './types';

export const CHARACTERS: Character[] = [
  {
    id: 'char_1',
    name: 'Roberto',
    color: '#1e3a8a', // blue-900 (Police Blue)
    accentColor: '#60a5fa',
    powerUp: PowerUpType.DOUBLE_SCORE, 
    description: 'Lögregluþjónn. Safnaðu 10 Pitsum til að hlaða Handjárn. Ctrl til að skjóta.',
  },
  {
    id: 'char_2',
    name: 'Steve',
    color: '#b91c1c', // red-700
    accentColor: '#fca5a5',
    powerUp: PowerUpType.MAGNET,
    description: 'Lifandi Öxi. Safnaðu 10 Pitsum til að hlaða Eldkúlur. Ctrl til að skjóta.',
  },
  {
    id: 'char_3',
    name: 'El',
    color: '#fca5a5', 
    accentColor: '#ef4444', 
    powerUp: PowerUpType.SUPER_JUMP,
    description: 'Hugarorkusérfræðingur. Safnaðu 10 Pitsum til að hlaða Blóðsprengju. Ctrl til að skjóta.',
  },
  {
    id: 'char_4',
    name: 'Lord Amber',
    color: '#f59e0b', // amber-500
    accentColor: '#000000',
    powerUp: PowerUpType.SHIELD,
    description: 'Sith Drottinn. Safnaðu 10 Pitsum til að hlaða Ljósstjörnur. Ctrl til að skjóta.',
  },
  {
    id: 'char_5',
    name: 'Hopper',
    color: '#78350f', // amber-900
    accentColor: '#d4d4d8',
    powerUp: PowerUpType.SLOW_TIME,
    description: 'Lögreglustjóri. Safnaðu 10 Pitsum til að hlaða Neon Ketti. Ctrl til að skjóta.',
  },
  {
    id: 'char_6',
    name: '6-7',
    color: '#10b981', // emerald-500
    accentColor: '#34d399',
    powerUp: PowerUpType.FLOATY,
    description: 'Tölustafirnir. Safnaðu 10 Pitsum til að hlaða Tölu-bolta. Ctrl til að skjóta.',
  },
  {
    id: 'char_7',
    name: 'Specter',
    color: '#64748b', // slate-500
    accentColor: '#94a3b8',
    powerUp: PowerUpType.PHASE_SHIFT,
    description: 'Draugur. Safnaðu 10 Pitsum til að hlaða Ecto-sprengju. Ctrl til að skjóta.',
  },
  {
    id: 'char_8',
    name: 'Shotgun-Bomb',
    color: '#f472b6', // Pink-400
    accentColor: '#be185d', 
    powerUp: PowerUpType.NONE,
    description: 'Svín með Bazooka. Safnaðu 10 Pitsum til að hlaða Eldflaugar. Ctrl til að skjóta.',
  },
  {
    id: 'char_9',
    name: 'Bragnaldo',
    color: '#166534', // Green-700
    accentColor: '#dc2626', // Red-600
    powerUp: PowerUpType.NONE,
    description: 'Fótboltastjarna. Safnaðu 10 Pitsum til að hlaða Fótbolta. Ctrl til að skjóta.',
  },
  {
    id: 'char_10',
    name: 'Cyclo',
    color: '#475569', // Slate-600
    accentColor: '#38bdf8', // Sky-400 (Water)
    powerUp: PowerUpType.NONE,
    description: 'Hálfur maður, hálft hjól. Safnaðu 10 Pitsum til að hlaða Vatnsflöskur. Ctrl til að skjóta.',
  },
  {
    id: 'char_11',
    name: 'Generic 3',
    color: '#f97316', // Orange-500
    accentColor: '#fb923c',
    powerUp: PowerUpType.NONE,
    description: 'Venjulegur. Safnaðu 10 Pitsum til að hlaða. Ctrl til að skjóta.',
  },
  {
    id: 'char_12',
    name: 'Generic 4',
    color: '#a855f7', // Purple-500
    accentColor: '#c084fc',
    powerUp: PowerUpType.NONE,
    description: 'Venjulegur. Safnaðu 10 Pitsum til að hlaða. Ctrl til að skjóta.',
  },
  {
    id: 'char_13',
    name: 'Generic 5',
    color: '#84cc16', // Lime-500
    accentColor: '#a3e635',
    powerUp: PowerUpType.NONE,
    description: 'Venjulegur. Safnaðu 10 Pitsum til að hlaða. Ctrl til að skjóta.',
  },
  {
    id: 'char_14',
    name: 'Generic 6',
    color: '#f43f5e', // Rose-500
    accentColor: '#fb7185',
    powerUp: PowerUpType.NONE,
    description: 'Venjulegur. Safnaðu 10 Pitsum til að hlaða. Ctrl til að skjóta.',
  },
  {
    id: 'char_15',
    name: 'Generic 7',
    color: '#8b5cf6', // Violet-500
    accentColor: '#a78bfa',
    powerUp: PowerUpType.NONE,
    description: 'Venjulegur. Safnaðu 10 Pitsum til að hlaða. Ctrl til að skjóta.',
  },
  {
    id: 'char_16',
    name: 'Generic 8',
    color: '#ec4899', // Pink-500
    accentColor: '#f472b6',
    powerUp: PowerUpType.NONE,
    description: 'Venjulegur. Safnaðu 10 Pitsum til að hlaða. Ctrl til að skjóta.',
  },
];

export const GAME_CONFIG = {
  LANE_WIDTH: 2.0, 
  GRAVITY: 0.04, // Even lower for extra floaty
  JUMP_FORCE: 0.9, // Balanced with low gravity
  SUPER_JUMP_FORCE: 1.4,
  INITIAL_SPEED: 0.005, 
  MAX_SPEED: 0.05,     
  SPEED_INCREMENT: 0.000001, 
  SPEED_BOOST_AMOUNT: 0.005, 
  DRAW_DISTANCE: 150, 
  PLAYER_Z: 0, 
  RAMPAGE_DURATION: 10000,
};
