"use client";

import { useEffect, useState } from "react";
import { getGameDetailForSupporter } from "@/utils/get";
import { GameDetailForSupporter } from "@/utils/interface/game";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MatchDetail } from "@/utils/interface/match";
import MatchCard from "@/components/supportPage/MatchCard";
import { Button } from "@/components/ui/button";
import { updateGameIsFinished } from "@/utils/update";

export default function MatchPage() {
  const [games, setGames] = useState<GameDetailForSupporter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const selectedGame = games[selectedGameIndex];

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await getGameDetailForSupporter();
      setGames(res || []);
    } catch (e) {
      setError("게임 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (games.length === 0) return <p>게임 데이터가 없습니다.</p>;

  return (
    <div className="pb-10 space-y-6 w-2xl">
      <div className="flex items-center justify-between w-full my-4">
        {/* 왼쪽: 화살표 + 장소/날짜 + 화살표 */}
        <div className="absolute flex items-center gap-4 transform -translate-x-1/2 left-1/2">
          {/* ◀ 왼쪽 화살표 */}
          <Button
            onClick={() =>
              setSelectedGameIndex((prev) => Math.max(0, prev - 1))
            }
            disabled={selectedGameIndex === 0}
            className="px-3 py-1 text-xl text-black bg-white border rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            ◀
          </Button>

          {/* 📍 장소 + 📅 날짜 */}
          <div className="text-lg font-semibold text-center min-w-[200px]">
            📍 {games[selectedGameIndex].Place.placeName} <br />
            📅 {new Date(games[selectedGameIndex].date).toLocaleDateString()}
          </div>

          {/* ▶ 오른쪽 화살표 */}
          <Button
            onClick={() =>
              setSelectedGameIndex((prev) =>
                Math.min(games.length - 1, prev + 1)
              )
            }
            disabled={selectedGameIndex === games.length - 1}
            className="px-3 py-1 text-xl text-black bg-white border rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            ▶
          </Button>
        </div>

        {/* 오른쪽: 게임 종료 버튼 */}
        <div className="ml-auto">
          <Button
            onClick={async () => {
              const gameId = games[selectedGameIndex].gameId;
              const confirmed = window.confirm(
                "정말로 이 게임을 종료하시겠습니까?"
              );
              if (!confirmed) return;

              try {
                await updateGameIsFinished(gameId);
                alert("게임이 종료되었습니다.");
                setSelectedGameIndex((prev) =>
                  Math.min(games.length - 1, prev + 1)
                );
              } catch (err) {
                alert("게임 종료에 실패했습니다.");
              }
            }}
            disabled={games[selectedGameIndex].isFinished}
            className="px-4 py-2 text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50"
          >
            게임 종료하기
          </Button>
        </div>
      </div>

      {/* 🏟️ Match 리스트 */}
      <div className="space-y-6">
        {selectedGame?.Matches?.length > 0 ? (
          selectedGame.Matches.map((match) => (
            <MatchCard
              key={match.matchId}
              match={match}
              isFinished={selectedGame.isFinished}
            />
          ))
        ) : (
          <p>경기 정보 없음</p>
        )}
      </div>
    </div>
  );
}
