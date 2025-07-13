import apiClient from "./api";
import { Game, IGame } from "./interface/game";
import { Note } from "./interface/note";
import { Option } from "./interface/option";
import { Place, PlaceDetail } from "./interface/place";

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

// 장소 생성하기
export async function postPlace(game: IGame) {
  try {
    const response = await apiClient.post(`/games/`, game);
    console.log("게임 등록 성공: ", response.data);
    return response.data;
  } catch (error) {
    console.log("게임을 등록하는데 실패했습니다!: ", error);
  }
}

// 장소 생성하기
export async function postPlaceDetail(postData: Partial<PlaceDetail>) {
  try {
    const { placeName, location, Option, Note } = postData;

    console.log(postData);
    // 1. 장소 등록 먼저 수행
    const placeRes = await apiClient.post<Place>("/places/", {
      placeName,
      location,
    });

    const placeId = placeRes.data.placeId; // 생성된 placeId
    console.log(placeId);
    // 2. Option 등록 (placeId 포함)
    await apiClient.post<Option>("/options/", {
      placeId,
      ...Option,
    });

    // 3. Note 등록 (placeId 포함)
    await apiClient.post<Note>("/notes/", {
      placeId,
      ...Note,
    });

    console.log("✅ 장소, 옵션, 노트 등록 완료");
  } catch (error) {
    console.error("장소 디테일을 생성하는 데 실패했습니다:", error);
    throw error;
  }
}
