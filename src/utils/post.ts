import apiClient from "./api";

export async function postInterestGame(gameId: number) {
  try {
    const response = await apiClient.post(`/interests/`, { gameId });
    console.log("관심 게임 등록 성공: ", response.data);
    return response.data;
  } catch (error) {
    console.log("관심 게임을 등록하는데 실패했습니다!: ", error);
  }
}
