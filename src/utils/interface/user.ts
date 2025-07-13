import { StringUnitLength } from "luxon";
import { Rate } from "./rate";

export interface User {
  userId: number;
  userName: string;
  email: string;
  phoneNum: string;
  isManager: boolean;
}

export interface UserDetail {
  userId: number;
  userName: string;
  email: string;
  phoneNum: string;
  isManager: boolean;
  Rate: Rate;
}

export interface Session {
  id: number;
  userName: string;
  email: string;
  isManager: boolean;
  isSuperManager: boolean;
  isSocial: boolean;
}
