import { StringUnitLength } from "luxon";
import { Rate } from "./rate";

export interface User {
  userId: number;
  userName: string;
  email: string;
  phoneNum: string;
  isManager: boolean;
  isSuppoter: boolean;
  isSuperManager: boolean;
}

export interface UserDetail {
  userId: number;
  userName: string;
  email: string;
  phoneNum: string;
  isManager: boolean;
  isSupporter: boolean;
  isSupperManager: boolean;
  Rate?: Rate;
}

export interface Session {
  id: number;
  userName: string;
  email: string;
  isManager: boolean;
  isSupporter: boolean;
  isSuperManager: boolean;
  isSocial: boolean;
}
