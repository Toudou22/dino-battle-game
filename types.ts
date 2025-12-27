export type DinoElement = 'Earth' | 'Water' | 'Sky';

export interface Dinosaur {
  common: string;
  scientific: string;
  short_desc: string;
  detailed_info: string;
  size: number;
  speed: number;
  attack: number;
  imagePrompt: string;
  soundKey: string;
  element: DinoElement;
  tier?: 'common' | 'legendary';
  affiliateLink?: string;
  aliases?: string[];
}

export enum GameState {
  START = 'START',
  BATTLE = 'BATTLE',
  RESULT = 'RESULT',
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats, currentBattle?: BattleContext) => boolean;
}

export interface BattleHistoryItem {
  timestamp: number;
  winnerName: string;
  loserName: string;
  isPlayerCorrect: boolean;
  environment: string;
}

export interface UserStats {
  wins: number;
  losses: number;
  currentStreak: number;
  highestStreak: number;
  dinosDiscovered: string[]; // List of common names
  recentMatches: BattleHistoryItem[];
}

export interface BattleContext {
  winner: Dinosaur;
  loser: Dinosaur;
  playerChoice: Dinosaur;
  isCorrect: boolean;
}

export type BattleEnvironment = string;

export interface User {
  username: string;
  isPremium: boolean;
  isGodMode: boolean;
}

export type AppView = 'login' | 'dashboard' | 'game' | 'pricing' | 'biomes' | 'education';