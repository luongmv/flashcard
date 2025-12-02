export enum GameState {
  MENU = 'MENU',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  ERROR = 'ERROR'
}

export interface QuizItem {
  word: string;
  options: string[];
  correctOptionIndex: number; // 0-3
  definition: string;
  imageBase64: string | null;
}

export interface GameSession {
  score: number;
  totalRounds: number;
  currentRound: number;
  history: {
    word: string;
    correct: boolean;
  }[];
}