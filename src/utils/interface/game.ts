import { PlaceDetail } from "./place";
import { User } from "./user";

export interface Game {
  gameId: number;
  placeId: number;
  date: string;
  numOfMember: number;
  createdAt: string;
  updatedAt: string;
}

export interface GameDetail {
  gameId: number;
  placeId: number;
  date: string;
  numOfMember: number;
  createdAt: string;
  updatedAt: string;
  Place: PlaceDetail;
  Users: User[];
}

export interface InterestedGame {
  gameId: number;
  userId: number;
  Game: GameDetail;
}
