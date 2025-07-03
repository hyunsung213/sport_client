import apiClient from "./api";

export async function deleteInterestGame(gameId: number) {
  try {
    const response = await apiClient.delete(`/interests/${gameId}`);
    console.log("관심 게임 해제 성공: ", response.data);
    return response.data;
  } catch (error) {
    console.log("관심 게임을 해제 실패했습니다!: ", error);
  }
}
