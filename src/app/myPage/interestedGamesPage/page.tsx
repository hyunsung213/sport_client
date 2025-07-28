"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getInterestGame } from "@/utils/get";
import { deleteInterestGame } from "@/utils/delete";
import { InterestedGame } from "@/utils/interface/game";
import { FaHeart } from "react-icons/fa";
import { DateTime } from "luxon";
import { brandColors, fontColor } from "@/styles/color";

export default function InterestedGamesPage() {
  const [interestGames, setInterestGames] = useState<InterestedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchInterestGames = async () => {
    try {
      const res = await getInterestGame();
      setInterestGames(res || []);
    } catch (error) {
      console.error("관심 게임 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 날짜 기준으로 그룹화 함수
  const groupGamesByDate = (games: InterestedGame[]) => {
    const grouped: Record<string, InterestedGame[]> = {};
    console.log("games: ", games);

    games.forEach((g) => {
      const date = DateTime.fromISO(g.Game.date, { zone: "utc" }).setZone(
        "Asia/Seoul"
      );
      const dateStr = date.toFormat("yyyy-MM-dd");

      const isPast = date < DateTime.now().setZone("Asia/Seoul").startOf("day");
      if (isPast) return; // 과거는 제외

      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(g);
    });
    return grouped;
  };

  const toDistrictOnly = (address: string) => {
    if (!address) return "서울특별시";
    const match = address.match(/([가-힣]+구)/);
    return match ? match[0] : "서울특별시";
  };

  const goToGameDetail = (gameId: number) => {
    router.push(`/game/${gameId}`);
  };

  const toggleLike = async (gameId: number) => {
    await deleteInterestGame(gameId);
    await fetchInterestGames();
  };

  useEffect(() => {
    fetchInterestGames();
  }, []);

  return (
    <div className="w-full max-w-screen-lg min-h-screen p-4 mx-auto">
      <h1 className="mb-4 text-xl font-bold text-center sm:text-2xl">
        관심 게임 목록
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">불러오는 중...</p>
      ) : (
        (() => {
          const groupedGames = groupGamesByDate(interestGames);
          const dateKeys = Object.keys(groupedGames).sort(); // 날짜 오름차순

          if (dateKeys.length === 0) {
            return (
              <p className="text-center text-gray-500">관심 게임이 없습니다.</p>
            );
          }

          return (
            <div className="flex flex-col gap-4 mt-4">
              {dateKeys.map((dateStr) => (
                <div key={dateStr}>
                  {/* 날짜 구분선 (얇고 모바일에서도 잘 보이게) */}
                  <div className="flex items-center justify-center mx-10 my-2">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="px-2 text-xs font-medium text-gray-500 sm:text-sm whitespace-nowrap">
                      {dateStr}
                    </span>
                    <div className="flex-1 h-px bg-gray-300" />
                  </div>

                  {/* 해당 날짜 게임들 */}
                  <div className="flex flex-col gap-2">
                    {groupedGames[dateStr].map((game, idx) => {
                      const dateTime = DateTime.fromISO(game.Game.date, {
                        zone: "utc",
                      }).setZone("Asia/Seoul");

                      const isOdd = idx % 2 === 0;

                      return (
                        <div
                          key={game.gameId}
                          className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-1 px-3 sm:px-10 py-3 cursor-pointer rounded-xl hover:scale-102`}
                          style={{
                            backgroundColor: isOdd
                              ? brandColors.skyorange
                              : brandColors.skyblue,
                          }}
                          onClick={() => goToGameDetail(game.gameId)}
                        >
                          <div className="text-base font-bold text-left w-14 sm:w-16 sm:text-lg">
                            {dateTime.toFormat("HH:mm")}
                          </div>

                          <div className="flex items-center justify-between flex-1 gap-2 ml-5">
                            <div
                              className={`text-left ${fontColor.black}`}
                              style={{ maxWidth: "60%" }}
                            >
                              <div className="text-xs font-semibold truncate sm:text-sm">
                                {game.Game.Place?.placeName}
                              </div>
                              <div className="text-[10px] sm:text-xs text-gray-600 truncate">
                                {toDistrictOnly(game.Game.Place?.location)}
                              </div>
                            </div>
                          </div>

                          <div className="w-20 text-xs text-right text-gray-600 sm:text-sm">
                            {game.Game.Users?.length}명 /{" "}
                            {game.Game.numOfMember}명
                          </div>

                          <div
                            className="ml-2 cursor-pointer sm:ml-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(game.gameId);
                            }}
                          >
                            <FaHeart className="text-red-500" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()
      )}
    </div>
  );
}
