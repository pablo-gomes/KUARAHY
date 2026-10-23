/**
 * KUARAHY — Game Engine Type Definitions
 */

export type GameMode = 'menu' | 'select_char' | 'select_stage' | 'fight' | 'training' | 'lan_lobby' | 'options';

export type SubMode = '1vbot' | '1v1_local' | 'lan' | 'training';

export type AIDifficulty = 'facil' | 'normal' | 'dificil';

export type FighterId = 'terere' | 'harpa' | 'chaco' | 'nanduti' | 'itaipu' | 'guarani';

export type StageId = 'assuncao' | 'chaco_stage' | 'itaipu_stage' | 'rio_paraguai' | 'encarnacion' | 'arena_cultural';

export type FighterActionState =
  | 'idle'
  | 'walk_forward'
  | 'walk_backward'
  | 'crouch'
  | 'jump'
  | 'jump_fall'
  | 'punch'
  | 'kick'
  | 'heavy'
  | 'crouch_punch'
  | 'crouch_kick'
  | 'jump_punch'
  | 'jump_kick'
  | 'special1'
  | 'special2'
  | 'super'
  | 'grab_startup'
  | 'grab_hit'
  | 'grabbed'
  | 'block'
  | 'parry'
  | 'hit'
  | 'hit_crouch'
  | 'knockdown'
  | 'getup'
  | 'victory'
  | 'defeat';

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface AttackFrameData {
  name: string;
  type: 'punch' | 'kick' | 'heavy' | 'special1' | 'special2' | 'super' | 'grab';
  startup: number;    // frames before hitbox becomes active
  active: number;     // active hitbox duration in frames
  recovery: number;   // recovery frames after active
  damage: number;
  energyGain: number; // energy gained on hit
  energyCost: number; // required energy to cast
  hitstun: number;    // enemy stun duration
  blockstun: number;  // enemy blockstun duration
  knockbackX: number;
  knockbackY: number;
  isUnblockable?: boolean;
  hitboxOffset: Box;  // offset relative to fighter position & facing
  soundEffect: 'punch' | 'kick' | 'heavy' | 'special' | 'super' | 'grab' | 'laser' | 'water';
  projectile?: {
    speed: number;
    w: number;
    h: number;
    lifetime: number;
    type: 'water' | 'note' | 'electricity' | 'thread' | 'earth';
  };
}

export interface FighterStats {
  damage: number;      // 1 to 5
  speed: number;       // 1 to 5
  defense: number;     // 1 to 5
  reach: number;       // 1 to 5
}

export interface MoveDescription {
  name: string;
  command: string;
  desc: string;
  type: 'Normal' | 'Especial' | 'Técnica de Energia';
}

export interface FighterDefinition {
  id: FighterId;
  name: string;
  title: string;
  origin: string;
  style: string;
  quote: string;
  bio: string;
  stats: FighterStats;
  moves: MoveDescription[];
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
    energy: string;
  };
  special1Name: string;
  special2Name: string;
  superName: string;
  special1Desc: string;
  special2Desc: string;
  superDesc: string;
}

export interface StageDefinition {
  id: StageId;
  name: string;
  subtitle: string;
  region: string;
  palette: {
    skyTop: string;
    skyBottom: string;
    ground: string;
    groundAccent: string;
    horizon: string;
  };
  description: string;
}

export interface PlayerControls {
  up: string;
  down: string;
  left: string;
  right: string;
  punch: string;
  kick: string;
  heavy: string;
  special: string;
  grab: string;
  block: string;
  super: string;
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  punch: boolean;
  kick: boolean;
  heavy: boolean;
  special: boolean;
  grab: boolean;
  block: boolean;
  super: boolean;
  // Just-pressed flags for single-frame triggers
  punchPressed: boolean;
  kickPressed: boolean;
  heavyPressed: boolean;
  specialPressed: boolean;
  grabPressed: boolean;
  blockPressed: boolean;
  superPressed: boolean;
}

export interface Projectile {
  id: number;
  ownerId: 1 | 2;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  damage: number;
  energyGain: number;
  hitstun: number;
  type: 'water' | 'note' | 'electricity' | 'thread' | 'earth';
  lifetime: number;
  active: boolean;
}

export interface ParticleEffect {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'square' | 'spark' | 'ring' | 'note' | 'drop';
}

export interface GameSettings {
  musicVolume: number;    // 0 to 1
  sfxVolume: number;      // 0 to 1
  roundsToWin: number;    // 1, 2 (best of 3), 3 (best of 5)
  roundTimer: number;     // 60, 99, 0 (infinite)
  aiDifficulty: AIDifficulty;
  showHitboxes: boolean;
  enableScanlines: boolean;
}

export interface MatchRoundState {
  currentRound: number;
  p1RoundsWon: number;
  p2RoundsWon: number;
  timer: number;
  phase: 'intro' | 'fight' | 'round_over' | 'match_over';
  winner: 1 | 2 | 'draw' | null;
  bannerText: string;
  bannerSubtext?: string;
  bannerTimer: number;
}
