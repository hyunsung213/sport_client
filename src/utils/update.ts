import apiClient from "./api";
import { Match, MatchDetail } from "./interface/match";
import { Note } from "./interface/note";
import { Option } from "./interface/option";
import { Place, PlaceDetail } from "./interface/place";

/////////////////////// 장소 관련 ///////////////////////

// 장소 디테일 수정
export async function updatePlaceDetail(updateData: Partial<PlaceDetail>) {
  try {
    const { placeId, placeName, location, managerId, User, Option, Note } =
      updateData;

    // 필수 ID 체크
    if (!placeId) throw new Error("placeId가 없습니다.");
    if (!Option?.optionId) throw new Error("optionId가 없습니다.");
    if (!Note?.noteId) throw new Error("noteId가 없습니다.");

    console.log("optionId:", Option.optionId);

    // 장소 데이터 구성
    const updatePlace = {
      ...(placeName && { placeName }),
      ...(location && { location }),
      ...(managerId && { managerId }),
      ...(User && { User }),
    };

    const results = await Promise.allSettled([
      apiClient.put<Place>(`/places/${placeId}`, updatePlace),
      apiClient.put<Option>(`/options/${Option.optionId}`, Option),
      apiClient.put<Note>(`/notes/${Note.noteId}`, Note),
    ]);

    // 실패가 아니라면 전부 성공 처리 (백엔드에서 변화 없음으로 인해 실패 안 띄우도록)
    const isError = results.some((r) => r.status === "rejected");

    if (isError) {
      console.warn("일부 항목 업데이트 실패 (변경 없음으로 간주).");
    }

    return {
      place: results[0].status === "fulfilled" ? results[0].value.data : null,
      option: results[1].status === "fulfilled" ? results[1].value.data : null,
      note: results[2].status === "fulfilled" ? results[2].value.data : null,
    };
  } catch (error) {
    console.error("장소 디테일을 업데이트하는 데 실패했습니다.", error);
    throw error;
  }
}

///////////////////// 게임 관련 ////////////////////////////

// 결제 후 참가 확정하기
export async function updateIsConfirm(gameId: number) {
  try {
    const response = await apiClient.put(`/participations/confirm/`, {
      gameId,
    });
    return response.data;
  } catch (error) {
    console.log("참가 확정하는데 실패했습니다.", error);
  }
}

///////////// 서포터 게임 관리하기 /////////////////

// Match 점수 기록하기
export async function updateMatch(updateData: Partial<Match>) {
  try {
    const { matchId, teamAScore, teamBScore, playerOfMatch, winnerTeam } =
      updateData;

    const payload = {
      teamAScore,
      teamBScore,
      winnerTeam,
      playerOfMatch,
    };

    const response = await apiClient.put(`/matches/${matchId}`, payload);
    return response.data;
  } catch (error) {
    console.log("Match 점수를 기록하는데 실패했습니다.", error);
  }
}

// 게임 종료하기
export async function updateGameIsFinished(gameId: number) {
  try {
    const isFinished = true;
    const response = await apiClient.put(`/games/end/${gameId}`, {
      isFinished,
    });
    return response.data;
  } catch (error) {
    console.log("게임을 종료하는데 실패했습니다.", error);
  }
}
