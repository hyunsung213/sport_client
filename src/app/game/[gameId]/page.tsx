"use client";

import HotGameCard from "@/components/detailPage/HotGameCard";
import PlaceNoteCard from "@/components/detailPage/PlaceNoteCard";
import PlaceOptionCard from "@/components/detailPage/PlaceOptionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceBasicNote } from "@/lib/note";
import { PlaceBasicOption } from "@/lib/option";
import { getGameDetail, getInterestGameDetail } from "@/utils/get";
import { GameDetail, InterestedGame } from "@/utils/interface/game";
import { Image } from "@radix-ui/react-avatar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiShare } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { deleteInterestGame } from "@/utils/delete";
import { postInterestGame } from "@/utils/post";
import { set } from "date-fns";
import { is } from "date-fns/locale";
import GameInfoCard from "@/components/detailPage/GameInfoCard";

interface Props {
  params: Promise<{ gameId: string }>;
}

export default function GameDetailPage() {
  const params = useParams();
  const gameId = Number(params?.gameId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [game, setGame] = useState<GameDetail>();
  const [interestGames, setInterestGames] = useState<InterestedGame[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  // GameList 불러오기
  const fetchGames = async () => {
    setLoading(true);
    try {
      const [resultGame, resultInterestGames] = await Promise.all([
        getGameDetail(gameId),
        getInterestGameDetail(),
      ]);
      console.log("게임 상세 정보:", resultGame);
      setGame(resultGame);
      setInterestGames(resultInterestGames || []);
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

  // 관심 게임 여부 확인
  const isInterestedGame = (gameId: number) => {
    interestGames.some((game) => game.gameId === gameId)
      ? setIsLiked(true)
      : setIsLiked(false);
  };

  // 관심 게임 토글 함수 - 관심 게임 등록/해제
  const toggleLike = async (gameId: number) => {
    if (isLiked) {
      setIsLiked(false);
      await deleteInterestGame(gameId); // 서버 요청
      await fetchGames(); // 관심 게임 목록 새로고침
    } else {
      setIsLiked(true);
      await postInterestGame(gameId); // 서버 요청
      await fetchGames(); // 관심 게임 목록 새로고침
    }
  };

  // URL 복사 기능
  const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("현재 페이지 URL이 복사되었습니다!");
      })
      .catch(() => {
        alert("복사에 실패했습니다. 브라우저 설정을 확인하세요.");
      });
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchGames();
    };
    fetchAll();
  }, []);

  useEffect(() => {
    isInterestedGame(gameId);
  }, [interestGames]);

  return (
    <div className="max-w-6xl p-4 space-y-6">
      {/* 상단 이미지 영역 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <img
            src={
              game?.Place?.Photos?.length
                ? getPhotoByURL(game.Place.Photos[0].photoUrl)
                : "https://via.placeholder.com/300x200?text=No+Image"
            }
            alt={game?.Place?.placeName || "장소 이미지"}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <img
              src={
                game?.Place?.Photos?.length
                  ? getPhotoByURL(game.Place.Photos[0].photoUrl)
                  : "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={game?.Place?.placeName || "장소 이미지"}
              className="object-cover w-full h-full"
            />
            <img
              src={
                game?.Place?.Photos?.length
                  ? getPhotoByURL(game.Place.Photos[0].photoUrl)
                  : "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={game?.Place?.placeName || "장소 이미지"}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-row gap-4">
            <img
              src={
                game?.Place?.Photos?.length
                  ? getPhotoByURL(game.Place.Photos[0].photoUrl)
                  : "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={game?.Place?.placeName || "장소 이미지"}
              className="object-cover w-full h-full"
            />
            <img
              src={
                game?.Place?.Photos?.length
                  ? getPhotoByURL(game.Place.Photos[0].photoUrl)
                  : "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={game?.Place?.placeName || "장소 이미지"}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* 장소 및 정보 */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{game?.Place?.placeName}</h1>
          <p className="text-gray-500">{game?.Place?.location}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleCopyUrl()}>
            {<FiShare />}
          </Button>
          <Button variant="outline" onClick={() => toggleLike(gameId)}>
            {isLiked ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-gray-400" />
            )}
          </Button>
        </div>
      </div>

      {/* 게임 정보 카드 */}
      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          <div className="my-2 border-t border-blue-400" /> {/* 구분선 */}
          {/* 편의시설 & 상세 정보 */}
          <PlaceOptionCard option={game?.Place?.Option || PlaceBasicOption} />
          <div className="my-2 border-t border-blue-400" /> {/* 구분선 */}
          <PlaceNoteCard note={game?.Place?.Note || PlaceBasicNote} />
          <div className="my-2 border-t border-blue-400" /> {/* 구분선 */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">주소</h2>
            <p>서울시 마포구 도림동 50-1</p>
          </div>
        </div>

        <div className="space-y-4">
          <HotGameCard />
          {/* 우측 정보 카드 */}
          <GameInfoCard game={game} />
        </div>
      </div>

      {/* 지도 영역 */}
      <div>
        <h2 className="mb-2 text-lg font-semibold">위치</h2>
        <div className="flex items-center justify-center w-full text-gray-500 bg-gray-200 h-80 rounded-xl">
          지도 영역 (지도 연동 예정)
        </div>
      </div>
    </div>
  );
}
