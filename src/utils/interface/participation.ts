import { Game } from "./game";

export interface Participation {
  gameId: number;
  userId: number;
  isConfirmed: boolean;
}

export interface ParticipationWithGame {
  gameId: number;
  userId: number;
  isConfirmed: boolean;
  Game: Game;
}
