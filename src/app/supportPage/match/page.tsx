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
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function MatchPage() {
  const router = useRouter();
  const [games, setGames] = useState<GameDetailForSupporter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const selectedGame = games[selectedGameIndex];

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await getGameDetailForSupporter();
      console.log("ㄷㄹㅇㅎ: ", res);
      setGames(res || []);
    } catch (e) {
      setError("게임 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 서포터가 아닐 경우 홈으로 리다이렉트
  useEffect(() => {
    if (!loading && (!user || !user.isSupporter)) {
      alert("접근 권한이 없습니다.");
      router.replace("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (games.length === 0) return <p>게임 데이터가 없습니다.</p>;

  return (
    <div className="max-w-screen-lg p-6 pb-10 mx-auto space-y-6">
      {/* 장소/날짜 & 이전/다음 버튼 */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {/* ◀ 왼쪽 화살표 */}
        <Button
          onClick={() => setSelectedGameIndex((prev) => Math.max(0, prev - 1))}
          disabled={selectedGameIndex === 0}
          className="px-2 py-1 text-base text-black bg-white border rounded-full sm:text-xl hover:bg-gray-100 disabled:opacity-50"
        >
          ◀
        </Button>

        {/* 장소 + 날짜 */}
        <div className="text-sm sm:text-lg font-semibold text-center min-w-[150px] sm:min-w-[200px] truncate">
          📍 {games[selectedGameIndex].Place.placeName}{" "}
          <br className="sm:hidden" />
          📅{" "}
          {new Date(games[selectedGameIndex].date).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </div>

        {/* ▶ 오른쪽 화살표 */}
        <Button
          onClick={() =>
            setSelectedGameIndex((prev) => Math.min(games.length - 1, prev + 1))
          }
          disabled={selectedGameIndex === games.length - 1}
          className="px-2 py-1 text-base text-black bg-white border rounded-full sm:text-xl hover:bg-gray-100 disabled:opacity-50"
        >
          ▶
        </Button>

        {/* 종료 버튼 - 항상 맨 아래 */}
        <div className="justify-center hidden pt-4 sm:flex sm:pt-0">
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
            className="w-full px-4 py-2 text-sm text-white bg-red-600 sm:w-auto sm:text-base rounded-xl hover:bg-red-700 disabled:opacity-50"
          >
            게임 종료하기
          </Button>
        </div>
      </div>

      {/* Match 리스트 */}
      <div className="px-2 space-y-4 sm:space-y-6 sm:px-0">
        {selectedGame?.Matches?.length > 0 ? (
          selectedGame.Matches.map((match) => (
            <MatchCard
              key={match.matchId}
              match={match}
              isFinished={selectedGame.isFinished}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">경기 정보 없음</p>
        )}
      </div>

      {/* 종료 버튼 - 항상 맨 아래 */}
      <div className="flex justify-center pb-4 sm:pt-0">
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
          className="w-full px-4 py-2 text-sm text-white bg-red-600 sm:w-auto sm:text-base rounded-xl hover:bg-red-700 disabled:opacity-50"
        >
          게임 종료하기
        </Button>
      </div>
    </div>
  );
}
