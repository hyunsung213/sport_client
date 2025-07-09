"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { seoulDistricts } from "@/lib/seoul";
import { getAllGameDetail, getInterestGameDetail } from "@/utils/get";
import { GameDetail, InterestedGame } from "@/utils/interface/game";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { is } from "date-fns/locale";
import { deleteInterestGame } from "@/utils/delete";
import { postInterestGame } from "@/utils/post";
import { useRouter } from "next/navigation";

export default function GameList() {
  const today = new Date();
  const daysKor = ["일", "월", "화", "수", "목", "금", "토"];
  const router = useRouter();

  // ✅ 오늘 날짜 포맷 함수
  const getFormattedToday = () => {
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  };

  // ✅ 오늘 날짜로 초기화
  const [selectedDate, setSelectedDate] = useState<string>(getFormattedToday());
  const [games, setGames] = useState<GameDetail[]>([]);
  const [selectDistrict, setSelectDistrict] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [interestGames, setInterestGames] = useState<InterestedGame[]>([]);

  //Game 상세 페이지로 이동하는 함수
  const goToGameDetail = (gameId: number) => {
    router.push(`/game/${gameId}`);
  };

  // GameList 불러오기
  const fetchGames = async () => {
    setLoading(true);
    try {
      const [resultGames, resultInterestGames] = await Promise.all([
        getAllGameDetail(),
        getInterestGameDetail(),
      ]);
      setGames(resultGames || []);
      setInterestGames(resultInterestGames || []);
    } catch (err) {
      console.error(err);
      setError("게임 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 날짜, 지역구 기준으로 Game 필터링
  const filteredGames = games.filter(
    (game) =>
      game.date.slice(0, 10) === selectedDate && // 앞 10자리만 비교
      (selectDistrict ? game.Place.location.includes(selectDistrict) : true)
  );

  // 관심 게임 여부 확인
  const isInterestedGame = (gameId: number) => {
    return interestGames.some((game) => game.gameId === gameId);
  };

  // 관심 게임 토글 함수 - 관심 게임 등록/해제
  const toggleLike = async (gameId: number) => {
    if (isInterestedGame(gameId)) {
      await deleteInterestGame(gameId); // 서버 요청
      await fetchGames(); // 관심 게임 목록 새로고침
    } else {
      await postInterestGame(gameId); // 서버 요청
      await fetchGames(); // 관심 게임 목록 새로고침
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="flex flex-col max-w-5xl gap-4">
      {/* 날짜 선택 */}
      <div
        className="flex items-center justify-center w-full gap-12 px-6 py-2 rounded-full"
        style={{ backgroundColor: "#e5f3fb" }}
      >
        {Array.from({ length: 10 }, (_, i) => {
          const newDate = new Date(today);
          newDate.setDate(today.getDate() + i);

          const day = daysKor[newDate.getDay()];
          const dateNum = newDate.getDate();
          const formattedDate = `${newDate.getFullYear()}-${String(
            newDate.getMonth() + 1
          ).padStart(2, "0")}-${String(dateNum).padStart(2, "0")}`;

          const isSelected = selectedDate === formattedDate;
          const isSaturday = newDate.getDay() === 6;
          const isSunday = newDate.getDay() === 0;

          return (
            <div key={i} className="flex flex-col items-center w-12">
              <Button
                variant={isSelected ? "default" : "ghost"}
                className={`w-12 h-12 rounded-full flex flex-col items-center justify-center ${
                  isSaturday ? "text-blue-500" : isSunday ? "text-red-500" : ""
                }`}
                style={
                  isSelected
                    ? { backgroundColor: "#b6e9f9", color: "#000" }
                    : {}
                }
                onClick={() => setSelectedDate(formattedDate)}
              >
                <span className="font-bold">{dateNum}</span>
                <span className="text-xs">{day}</span>
              </Button>
            </div>
          );
        })}
      </div>

      {/* 지역구 선택 */}
      <div>
        <Select onValueChange={(val) => setSelectDistrict(val)}>
          <SelectTrigger className="h-8 text-sm w-[180px]">
            <SelectValue placeholder="지역구 선택" />
          </SelectTrigger>
          <SelectContent className="overflow-y-auto max-h-40">
            <SelectGroup>
              <SelectLabel>서울</SelectLabel>
              {seoulDistricts.map((district) => (
                <SelectItem key={district.name} value={district.address}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 게임 리스트 */}
      {filteredGames.length > 0 ? (
        <div className="flex flex-col gap-2 mt-4">
          {filteredGames.map((game, idx) => {
            const gameTime = game.date.slice(11, 16); // 시간만 추출 (HH:mm)
            const isLiked = isInterestedGame(game.gameId); // 관심 게임 여부 확인
            const isOdd = idx % 2 === 0; // 0부터 시작 → 0, 2, 4... 홀수 번째로 인식
            return (
              <div
                key={game.gameId}
                className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:scale-102`}
                style={{
                  backgroundColor: isOdd ? "#e5f3fb" : "#ffffff",
                }}
                onClick={() => goToGameDetail(game.gameId)}
              >
                <div className="w-16 font-bold text-left">{gameTime}</div>

                <div className="flex-1 text-sm text-left text-gray-700">
                  {game.Place.placeName}
                </div>

                <div className="w-20 text-sm text-right text-gray-600">
                  {game.Users.length}명 / {game.numOfMember}명
                </div>

                <div
                  className="ml-4 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // 부모 선택 방지
                    toggleLike(game.gameId);
                  }}
                >
                  {isLiked ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-500">
          해당 날짜에 게임이 없습니다.
        </div>
      )}
    </div>
  );
}
