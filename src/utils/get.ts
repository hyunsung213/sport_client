import apiClient from "./api";
import { GameDetail } from "./interface/game";

export interface DateFilter {
  startDate: string;
  endDate: string;
}

export async function getAllGameDetail() {
  try {
    const response = await apiClient.get<GameDetail[]>(`/games`);
    return response.data;
  } catch (error) {
    console.log("모든 GameDetail을 가져오는데 실패했습니다!: ", error);
  }
}

export async function getGameDetail(gameId: number) {
  try {
    const response = await apiClient.get<GameDetail>(`/games/:id/${gameId}`);
    return response.data;
  } catch (error) {
    console.log("GameDetail을 가져오는데 실패했습니다!: ", error);
  }
}

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
