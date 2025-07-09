import { StringUnitLength } from "luxon";
import { Rate } from "./rate";

export interface User {
  userId: number;
  userName: string;
  nickName: string;
  email: string;
  phoneNum: string;
  isManager: boolean;
}

export interface UserDetail {
  userId: number;
  userName: string;
  nickName: string;
  email: string;
  phoneNum: string;
  isManager: boolean;
  Rate: Rate;
}

export interface Session {
  id: number;
  email: string;
  isManager: boolean;
  isSuperManager: boolean;
}
