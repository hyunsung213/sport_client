import apiClient from "./api";
import {
  GameDetail,
  GameDetailForSupporter,
  InterestedGame,
} from "./interface/game";
import { ParticipationWithGame } from "./interface/participation";
import { PlaceDetail, PlaceDetailWithGames } from "./interface/place";
import { User, UserDetail } from "./interface/user";

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

// 서포터 관리 게임 디테일 정보 가져오기
export async function getGameDetailForSupporter() {
  try {
    const response = await apiClient.get<GameDetailForSupporter[]>(
      `/games/supporter/`
    );
    console.log("support: ", response);
    return response.data;
  } catch (error) {
    console.log("서포터를 위한 GameDetail을 가져오는데 실패했습니다!: ", error);
  }
}

// 날짜별 게임 디테일 정보 가져오기
export async function getGameDetailByDate(data: DateFilter) {
  try {
    console.log(data);
    const response = await apiClient.get<GameDetail[]>(`/games/date`, {
      params: data,
    });
    return response.data;
  } catch (error) {
    console.log("날짜별로 GameDetail을 가져오는데 실패했습니다!: ", error);
  }
}

// 관심 게임 디테일 정보 가져오기
export async function getInterestGame() {
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

// 유저 디테일 정보 가져오기
export async function getSupporters() {
  try {
    const response = await apiClient.get<User[]>(`/users/supporters/`);
    return response.data;
  } catch (error) {
    console.log("서포터 정보를 가져오는데 실패했습니다!: ", error);
  }
}

// manage 장소 세부 정보 가져오기
export async function getPlaceDetail() {
  try {
    const response = await apiClient.get<PlaceDetailWithGames[]>(`/Places/my`);
    return response.data;
  } catch (error) {
    console.log("장소 세부 정보를 가져오는데 실패했습니다!: ", error);
  }
}

// supermanage 장소 세부 정보 가져오기
export async function getAllPlaceDetail() {
  try {
    const response = await apiClient.get<PlaceDetailWithGames[]>(`/Places/`);
    return response.data;
  } catch (error) {
    console.log("장소 세부 정보를 가져오는데 실패했습니다!: ", error);
  }
}

// 참가한 게임의 세부 정보 가져오기
export async function getMyParticipation() {
  try {
    const response = await apiClient.get<ParticipationWithGame[]>(
      `/participations/my/`
    );
    return response.data ?? [];
  } catch (error) {
    console.log("참가한 게임 정보를 가져오는데 실패했습니다!: ", error);
    return [];
  }
}
