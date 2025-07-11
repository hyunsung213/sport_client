import apiClient from "./api";
import { Game, IGame } from "./interface/game";

// 게임 즐겨찾기
export async function postInterestGame(gameId: number) {
  try {
    const response = await apiClient.post(`/interests/`, { gameId });
    console.log("관심 게임 등록 성공: ", response.data);
    return response.data;
  } catch (error) {
    console.log("관심 게임을 등록하는데 실패했습니다!: ", error);
  }
}

// 사진 업로드
export async function postPhoto(placeId: number, file: File) {
  try {
    const formData = new FormData();
    formData.append("photo", file); // ✅ 여기가 핵심

    const response = await apiClient.post(
      `photos/places/${placeId}`, // ✅ URL도 수정
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("사진 업로드 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("사진 업로드 실패:", error);
    throw error;
  }
}

// 게임 생성하기
export async function postGame(game: IGame) {
  try {
    const response = await apiClient.post(`/games/`, game);
    console.log("게임 등록 성공: ", response.data);
    return response.data;
  } catch (error) {
    console.log("게임을 등록하는데 실패했습니다!: ", error);
  }
}
