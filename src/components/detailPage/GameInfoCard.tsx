"use client";

import { Game, GameDetail } from "@/utils/interface/game";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { DateTime } from "luxon";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import PayModal from "./PayModal";
import { useEffect, useState } from "react";
import { postPaticipation } from "@/utils/post";
import { useParticipatedGames } from "@/context/ParticipationContext";
import { ParticipationWithGame } from "@/utils/interface/participation";

export default function GameInfoCard({ game }: { game?: GameDetail }) {
  const router = useRouter();
  const dateTime = DateTime.fromISO(game?.date ?? "");
  const today = DateTime.local().startOf("day");
  const gameDate = DateTime.fromISO(game?.date ?? "").startOf("day");
  const diff = Math.floor(gameDate.diff(today, "days").days);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const participatedGames = useParticipatedGames();
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);

  const formatCost = (cost: number) => {
    const num = typeof cost === "string" ? parseInt(cost, 10) : cost;
    return num.toLocaleString("ko-KR") + "원";
  };

  const handleApply = async (gameId?: number) => {
    // TODO: 실제 결제 연동 또는 결제 완료 API 호출
    if (gameId) {
      await postPaticipation(gameId);
    }
  };

  const isGameConfirmed = (
    participations: ParticipationWithGame[],
    gameId: number
  ) => {
    const found = participations.find((p) => p.gameId === gameId);
    return found?.isConfirmed ?? false;
  };

  useEffect(() => {
    if (participatedGames && game?.gameId) {
      const result = isGameConfirmed(participatedGames, game.gameId);
      setAlreadyConfirmed(result);
    }
  }, [participatedGames, game?.gameId]);

  return (
    <div className="w-full">
      <Card
        className="w-full p-4 space-y-4 border border-gray-200 rounded-xl"
        style={{ borderColor: "#ffc3c1" }}
      >
        <CardContent className="space-y-4">
          {/* 날짜 & 시간 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500">경기 날짜</span>
            <span className="font-semibold">
              {dateTime.toFormat("yyyy.MM.dd")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">경기 시간</span>
            <span className="font-semibold">{dateTime.toFormat("HH:mm")}</span>
          </div>

          {/* 인원 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500">참여 인원</span>
            <span className="font-semibold">
              <span className="text-red-500">{game?.Users.length}</span> /{" "}
              {game?.numOfMember}명
            </span>
          </div>

          {/* D-Day */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500">D-Day</span>
            <span
              className={`font-semibold ${
                diff === 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {diff === 0 ? "D-DAY" : `D${diff}`}
            </span>
          </div>

          {/* 가격 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500">이용료</span>
            <span className="font-semibold">{formatCost(game?.cost ?? 0)}</span>
          </div>

          {/* 신청 버튼 */}
          <Button
            className="w-full py-2 mt-2 text-base text-black transition-colors duration-200 bg-white border border-black hover:bg-black hover:text-white"
            onClick={() => {
              setIsPayOpen(true);
              handleApply(game?.gameId);
            }}
            disabled={alreadyConfirmed}
          >
            신청하기
          </Button>
          <PayModal
            open={isPayOpen}
            game={game}
            onClose={() => setIsPayOpen(false)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
