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
import { FaRegCopy } from "react-icons/fa";
import LocationMap from "@/components/detailPage/LocationMap";
import RateCard from "@/components/detailPage/RateCard";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [open, setOpen] = useState(false);

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

  const images =
    game?.Place?.Photos?.map((photo) => getPhotoByURL(photo.photoUrl)) ?? [];
  const fallback = "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="max-w-5xl p-4 space-y-6">
      <Dialog open={open} onOpenChange={setOpen}>
        {/* 상단 이미지 영역 */}
        <div
          className="grid grid-cols-4 gap-4 p-4 overflow-hidden bg-white border border-gray-200 shadow-sm cursor-pointer rounded-xl"
          onClick={() => setOpen(true)}
        >
          <div className="col-span-2">
            <img
              src={images[0] || fallback}
              alt={game?.Place?.placeName || "장소 이미지"}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <img
                src={images[0] || fallback}
                className="object-cover w-full h-full rounded-lg"
              />
              <img
                src={images[0] || fallback}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <div className="flex flex-row gap-4">
              <img
                src={images[0] || fallback}
                className="object-cover w-full h-full rounded-lg"
              />
              <img
                src={images[0] || fallback}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* 모달 안 전체 이미지 리스트 */}
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>전체 이미지 보기</DialogTitle>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            {images.length > 0 ? (
              images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`gallery-${i}`}
                  className="object-contain w-full rounded-lg"
                />
              ))
            ) : (
              <p className="text-gray-400">이미지가 없습니다.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 게임 정보 카드 */}
      <div className="flex gap-6">
        <div className="space-y-4 flex-2">
          {/* 장소 정보 */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{game?.Place?.placeName}</h1>
            <p className="text-sm text-gray-500">{game?.Place?.location}</p>
          </div>
          <div className="my-2 border-t border-blue-400" /> {/* 구분선 */}
          {/* 편의시설 & 상세 정보 */}
          <PlaceOptionCard option={game?.Place?.Option || PlaceBasicOption} />
          <div className="my-2 border-t border-blue-400" /> {/* 구분선 */}
          <RateCard users={game?.Users || []} />
          <div className="my-2 border-t border-blue-400" /> {/* 구분선 */}
          <PlaceNoteCard note={game?.Place?.Note || PlaceBasicNote} />
          <div className="my-2 border-t border-blue-400" /> {/* 구분선 */}
        </div>

        <div className="sticky self-start flex-1 space-y-4 top-24">
          {/* 우측 아이콘 버튼 */}
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              className="border-gray-300 hover:bg-gray-100"
              onClick={() => handleCopyUrl()}
            >
              <FiShare className="text-gray-600" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="border-gray-300 hover:bg-gray-100"
              onClick={() => toggleLike(gameId)}
            >
              {isLiked ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-400" />
              )}
            </Button>
          </div>
          {/* 인기 게임 카드 */}
          <HotGameCard />
          {/* 우측 정보 카드 */}
          <GameInfoCard game={game} />
        </div>
      </div>

      {/* 지도 영역 */}
      <div>
        <LocationMap address={game?.Place?.location || ""} />
      </div>
    </div>
  );
}
