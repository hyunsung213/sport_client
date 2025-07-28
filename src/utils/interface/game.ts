import { MatchDetail } from "./match";
import { PlaceDetail } from "./place";
import { User, UserDetail } from "./user";

export interface Game {
  gameId: number;
  placeId: number;
  date: string;
  numOfMember: number;
  cost: number;
  supporterId: number;
  isProceed: boolean;
  isFinished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGame {
  placeId: number;
  date: string;
  numOfMember: number;
  cost: number;
  supporterId: number;
}

export interface GameDetail {
  gameId: number;
  placeId: number;
  date: string;
  numOfMember: number;
  cost: number;
  supporterId: number;
  isProceed: boolean;
  isFinished: boolean;
  createdAt: string;
  updatedAt: string;
  Place: PlaceDetail;
  Users: UserDetail[];
}

export interface GameDetailForSupporter {
  gameId: number;
  placeId: number;
  date: string;
  numOfMember: number;
  cost: number;
  isProceed: boolean;
  isFinished: boolean;
  Supporter: User;
  createdAt: string;
  updatedAt: string;
  Place: PlaceDetail;
  Matches: MatchDetail[];
}

export interface GameDetailForMy {
  gameId: number;
  placeId: number;
  date: string;
  numOfMember: number;
  cost: number;
  isProceed: boolean;
  isFinished: boolean;
  Supporter: User;
  createdAt: string;
  updatedAt: string;
  Place: PlaceDetail;
  Matches: MatchDetail[];
}

export interface InterestedGame {
  gameId: number;
  userId: number;
  Game: GameDetail;
}
