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
import { DateTime } from "luxon";
import { bgColor, brandColors, fontColor } from "@/styles/color";

export default function GameList() {
  const today = new Date();
  const daysKor = ["일", "월", "화", "수", "목", "금", "토"];
  const router = useRouter();

  // 오늘 날짜 포맷: "YYYY-MM-DD"
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
      console.log("result:", resultGames);
      setInterestGames(resultInterestGames || []);
    } catch (err) {
      console.error(err);
      setError("게임 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 날짜 + 지역구 필터
  const filteredGames = games.filter((game) => {
    const dateTime = DateTime.fromISO(game.date, { zone: "utc" }).setZone(
      "Asia/Seoul"
    );

    const gameDateStr = dateTime.toFormat("yyyy-MM-dd");
    const matchesDate = gameDateStr === selectedDate;

    const matchesDistrict = selectDistrict
      ? game.Place?.location?.includes(selectDistrict)
      : true;

    return matchesDate && matchesDistrict;
  });

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

  // 주소 구까지만 나타내기
  // "구"까지만 추출하는 함수
  const toDistrictOnly = (address: string) => {
    if (!address) return "서울특별시";

    // "중구", "강남구", "마포구" 등 "구"로 끝나는 단어 추출
    const match = address.match(/([가-힣]+구)/);
    return match ? match[0] : "서울특별시";
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="flex flex-col max-w-5xl gap-4">
      {/* 날짜 선택 */}
      <div
        className={`flex items-center justify-center w-full gap-12 px-6 py-2 rounded-full ${bgColor.skyblue}`}
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
              <button
                className={`w-12 h-12 rounded-full flex flex-col items-center justify-center hover:scale-105
      ${isSelected ? `${bgColor.orange} text-white` : "bg-transparent"}
      ${
        isSaturday
          ? isSelected
            ? ""
            : "text-blue-500"
          : isSunday
          ? isSelected
            ? ""
            : "text-red-500"
          : isSelected
          ? ""
          : "text-black"
      }`}
                onClick={() => setSelectedDate(formattedDate)}
              >
                <span className="font-bold">{dateNum}</span>
                <span className="text-xs">{day}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* 지역구 선택 */}
      <div>
        <Select onValueChange={(val) => setSelectDistrict(val)}>
          <SelectTrigger
            className={`h-8 text-sm w-[180px] ${bgColor.skyblue} ${fontColor.olive} rounded-md`}
          >
            <SelectValue placeholder="지역구 선택" />
          </SelectTrigger>

          <SelectContent className="overflow-y-auto bg-white border rounded-md shadow-lg max-h-80">
            <SelectGroup>
              <SelectLabel
                className={`px-2 py-1 ${fontColor.olive} text-xs font-bold`}
              >
                서울
              </SelectLabel>

              {seoulDistricts.map((district) => (
                <SelectItem
                  key={district.name}
                  value={district.address}
                  className={`text-sm text-gray-700 px-2 py-1 cursor-pointer hover:scale-105`}
                >
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
            const dateTime = DateTime.fromISO(game.date, {
              zone: "utc",
            }).setZone("Asia/Seoul");
            const isLiked = isInterestedGame(game.gameId); // 관심 게임 여부 확인
            const isOdd = idx % 2 === 0; // 0부터 시작 → 0, 2, 4... 홀수 번째로 인식
            return (
              <div
                key={game.gameId}
                className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:scale-102`}
                style={{
                  backgroundColor: isOdd
                    ? brandColors.skyolive
                    : brandColors.skyblue,
                }}
                onClick={() => goToGameDetail(game.gameId)}
              >
                <div className="w-16 font-bold text-left">
                  {dateTime.toFormat("HH:mm")}
                </div>

                <div className={`flex-1 text-sm text-left  ${fontColor.black}`}>
                  {game.Place.placeName}
                </div>

                <div className="text-sm text-left text-gray-500 flex-4">
                  {toDistrictOnly(game.Place.location)}
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
