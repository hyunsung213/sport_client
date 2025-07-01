import { StringUnitLength } from "luxon";

export interface User {
  userId: number;
  userName: string;
  nickName: string;
  email: string;
  phoneNum: string;
  isManager: boolean;
  grade: number;
}
