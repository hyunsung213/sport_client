"use client";

import { useEffect, useState } from "react";
import { ParticipationWithGame } from "@/utils/interface/participation";
import { getMyParticipation } from "@/utils/get";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar"; // ✅ shadcn/calendar
import { ko } from "date-fns/locale";
import MatchCard from "@/components/supportPage/MatchCard";

export default function FinishedGamesPage() {
  const [games, setGames] = useState<ParticipationWithGame[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await getMyParticipation();
        console.log(res);
        setGames(res);
      } catch (error) {
        console.error("지난 경기 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // 날짜 필터 적용
  const filteredGames = selectedDate
    ? games.filter((game) => {
        const gameDate = new Date(game.Game.date);
        return (
          format(gameDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
        );
      })
    : games;

  return (
    <div className="max-w-screen-lg min-h-screen p-4 mx-auto">
      <h1 className="mb-4 text-xl font-bold text-center sm:text-2xl">
        🏸 지난 게임 결과
      </h1>

      <div className="block mb-4 sm:hidden">
        {/* ✅ 모바일용 날짜 선택 버튼 */}
        <button
          className="w-full"
          onClick={() => setShowMobileCalendar((prev) => !prev)}
        >
          {selectedDate
            ? `📅 ${format(selectedDate, "yyyy-MM-dd")}`
            : "📅 날짜 선택"}
        </button>

        {/* ✅ 모바일용 달력 토글 */}
        {showMobileCalendar && (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              hasGame: games.map((g) => new Date(g.Game.date)),
            }}
            modifiersClassNames={{
              hasGame: "underline-indicator",
            }}
            className="w-full text-sm border rounded-lg shadow-sm"
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-4">
        {/* 📅 PC용 달력 고정 */}
        <div className="hidden sm:block w-full max-w-[240px]">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              hasGame: games.map((g) => new Date(g.Game.date)),
            }}
            modifiersClassNames={{
              hasGame: "underline-indicator",
            }}
            className="w-full text-sm border rounded-lg shadow-sm"
          />
        </div>

        {/* 🏸 경기 결과 */}
        <div className="flex flex-col justify-start space-y-3">
          {/* 선택된 날짜 & 장소 */}
          {selectedDate && filteredGames.length > 0 && (
            <div className="p-3 text-sm font-medium bg-gray-100 border rounded">
              <p>📅 날짜: {format(selectedDate, "yyyy-MM-dd")}</p>
              <p>
                ⏰ 시간: {format(new Date(filteredGames[0].Game.date), "HH:mm")}
              </p>
              <p>
                📍 장소:{" "}
                {filteredGames[0].Game.Place?.placeName || "알 수 없음"}
              </p>
            </div>
          )}

          {/* MatchCard들 */}
          {loading ? (
            <p className="text-center text-gray-500">불러오는 중...</p>
          ) : filteredGames.length === 0 ? (
            <p className="text-center text-gray-500">
              해당 날짜에 경기가 없습니다.
            </p>
          ) : (
            filteredGames.map((participation) =>
              participation.Game.Matches.map((match) => (
                <MatchCard
                  key={match.matchId}
                  match={match}
                  isFinished={true}
                />
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}
