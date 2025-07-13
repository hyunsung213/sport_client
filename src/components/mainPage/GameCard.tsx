"use client";

import { getGameDetail, getGameDetailByDate } from "@/utils/get";
import { GameDetail } from "@/utils/interface/game";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

export interface DateFilter {
  startDate: string;
  endDate: string;
}

export default function GameCard() {
  const router = useRouter();
  const [games, setGames] = useState<GameDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const now = new Date();
  const pad = (n: any) => n.toString().padStart(2, "0");

  const formattedNow = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  //Game 상세 페이지로 이동하는 함수
  const goToGameDetail = (gameId: number) => {
    router.push(`/game/${gameId}`);
  };

  // const [startDate, setStartDate] = useState(formattedNow);
  const [startDate, setStartDate] = useState("2025-07-02T00:00");

  // const [endDate, setEndDate] = useState(formattedNow);
  const [endDate, setEndDate] = useState("2025-07-03T23:59");

  // 날짜 필터를 적용하기 위한 함수
  const getDateFilter = (): DateFilter => {
    return { startDate: startDate, endDate: endDate };
  };

  // 게임 데이터를 불러오는 함수
  const fetchGames = async () => {
    setLoading(true);
    try {
      const dateFilter = getDateFilter();
      const result = await getGameDetailByDate(dateFilter);
      console.log("Games: ", result);
      setGames(result || []);
    } catch (err) {
      console.error(err);
      setError("게임 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 사진 URL로 사진 불러오기
  const getPhotoByURL = (photoUrl: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}${photoUrl}`;
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="flex items-center justify-center max-w-5xl">
      <Carousel className="w-full">
        <CarouselContent className="">
          {games.map((game) => (
            <CarouselItem key={game.gameId} className="p-2 basis-1/3">
              <Card
                className="flex flex-col w-full p-0 m-0 mx-auto overflow-hidden transition-transform shadow-lg cursor-pointer hover:scale-105"
                onClick={() => {
                  goToGameDetail(game.gameId);
                }}
              >
                <div className="w-full h-50">
                  <img
                    src={
                      game.Place?.Photos?.length
                        ? getPhotoByURL(game.Place.Photos[0].photoUrl)
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={game.Place?.placeName || "장소 이미지"}
                    className="object-cover w-full h-full"
                  />
                </div>

                <CardContent className="flex flex-col p-4 space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{game.Place.location}</span>
                  </div>
                  <h3 className="text-xl font-bold">{game.Place?.placeName}</h3>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      {new Date(game.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-red-500">
                      {game.Users?.length || 0}
                    </span>
                    <span className="text-gray-500">
                      / {game.numOfMember} 명
                    </span>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
