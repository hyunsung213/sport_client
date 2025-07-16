import { User, UserDetail } from "./user";

export interface Team {
  teamId: number;
  playerA: number;
  playerB: number;
}

export interface TeamDetail {
  teamId: number;
  PlayerA: UserDetail;
  PlayerB: UserDetail;
}
