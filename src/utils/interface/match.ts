import { Game } from "./game";
import { TeamDetail } from "./team";
import { User } from "./user";

export interface Match {
  matchId: number;
  gameId: number;
  isDouble: boolean;
  teamA: number;
  teamB: number;
  winnerTeam: "TeamA" | "TeamB";
  teamAScore: number;
  teamBScore: number;
  playerOfMatch: number;
}

export interface MatchDetail {
  matchId: number;
  isDouble: boolean;
  TeamA: TeamDetail;
  TeamB: TeamDetail;
  winnerTeam: "TeamA" | "TeamB";
  teamAScore: number | null;
  teamBScore: number | null;
  playerOfMatch: User | null;
}

export interface IMatchScore {
  matchId: number;
  teamAScore: number;
  teamBScore: number;
  playerOfMatch?: number;
  winnerTeam: "TeamA" | "TeamB";
}
