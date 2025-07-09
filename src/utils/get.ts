import apiClient from "./api";
import { GameDetail, InterestedGame } from "./interface/game";
import { Session, UserDetail } from "./interface/user";

export interface DateFilter {
  startDate: string;
  endDate: string;
}

// 모든 게임 디테일 정보 가져오기
export async function getAllGameDetail() {
  try {
    const response = await apiClient.get<GameDetail[]>(`/games`);
    return response.data;
  } catch (error) {
    console.log("모든 GameDetail을 가져오는데 실패했습니다!: ", error);
  }
}

// 게임 디테일 정보 가져오기
export async function getGameDetail(gameId: number) {
  try {
    const response = await apiClient.get<GameDetail>(`/games/${gameId}`);
    return response.data;
  } catch (error) {
    console.log("GameDetail을 가져오는데 실패했습니다!: ", error);
  }
}

// 날짜별 게임 디테일 정보 가져오기
export async function getGameDetailByDate(data: DateFilter) {
  try {
    const response = await apiClient.get<GameDetail[]>(`/games/date`, {
      params: data,
    });
    return response.data;
  } catch (error) {
    console.log("날짜별로 GameDetail을 가져오는데 실패했습니다!: ", error);
  }
}

// 관심 게임 디테일 정보 가져오기
export async function getInterestGameDetail() {
  try {
    const response = await apiClient.get<InterestedGame[]>(`/interests/my`);
    return response.data;
  } catch (error) {
    console.log("관심 게임을 가져오는데 실패했습니다!: ", error);
  }
}

// 유저 디테일 정보 가져오기
export async function getUserDetail() {
  try {
    const response = await apiClient.get<UserDetail>(`/users/my`);
    return response.data;
  } catch (error) {
    console.log("유저 정보를 가져오는데 실패했습니다!: ", error);
  }
}

// 세션 정보 가져오기
export async function getSession() {
  try {
    const response = await apiClient.get<Session>(`/session/`);
    return response.data;
  } catch (error) {
    console.log("세션 정보를 가져오는데 실패했습니다!: ", error);
  }
}
