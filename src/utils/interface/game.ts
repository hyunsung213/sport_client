import { PlaceDetail } from "./place";
import { User, UserDetail } from "./user";

export interface Game {
  gameId: number;
  placeId: number;
  date: string;
  numOfMember: number;
  cost: number;
  createdAt: string;
  updatedAt: string;
}

export interface GameDetail {
  gameId: number;
  placeId: number;
  date: string;
  numOfMember: number;
  cost: number;
  createdAt: string;
  updatedAt: string;
  Place: PlaceDetail;
  Users: UserDetail[];
}

export interface InterestedGame {
  gameId: number;
  userId: number;
  Game: GameDetail;
}
