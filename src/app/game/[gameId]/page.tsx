"use client";

import HotGameCard from "@/components/detailPage/HotGameCard";
import PlaceNoteCard from "@/components/detailPage/PlaceNoteCard";
import PlaceOptionCard from "@/components/detailPage/PlaceOptionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceBasicNote } from "@/lib/note";
import { PlaceBasicOption } from "@/lib/option";
import { getGameDetail, getInterestGame } from "@/utils/get";
import { GameDetail, InterestedGame } from "@/utils/interface/game";
import { Image } from "@radix-ui/react-avatar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiShare } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { deleteInterestGame } from "@/utils/delete";
import { postInterestGame, postPaticipation } from "@/utils/post";
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
import { bgColor, fontColor } from "@/styles/color";
import PayModal from "@/components/detailPage/PayModal";

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
  const [isPayOpen, setIsPayOpen] = useState(false);

  // GameList 불러오기
  const fetchGames = async () => {
    setLoading(true);
    try {
      const [resultGame, resultInterestGames] = await Promise.all([
        getGameDetail(gameId),
        getInterestGame(),
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

  // 신청하기 기능
  const handleApply = async (gameId?: number) => {
    // TODO: 실제 결제 연동 또는 결제 완료 API 호출
    if (gameId) {
      await postPaticipation(gameId);
    }
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
    <div className="max-w-screen-lg p-4 mx-auto space-y-6">
      <Dialog open={open} onOpenChange={setOpen}>
        {/* 상단 이미지 영역 */}
        {/* 상단 이미지 영역 (반응형) */}
        <div
          className={`w-full gap-4 sm:p-4 overflow-hidden ${bgColor.skyblue} border border-gray-200 shadow-sm cursor-pointer rounded-lg 
  flex flex-col sm:grid sm:grid-cols-4`}
          onClick={() => setOpen(true)}
        >
          {/* 메인 이미지 */}
          <div className="w-full sm:col-span-2">
            <img
              src={images[0] || fallback}
              alt={game?.Place?.placeName || "장소 이미지"}
              className="object-cover w-full h-full rounded-lg max-h-[240px] sm:max-h-none"
            />
          </div>

          {/* 서브 이미지 (PC만 보임) */}
          <div className="flex-col hidden gap-4 sm:flex">
            <div className="flex gap-4">
              <img
                src={images[1] || fallback}
                className="object-cover w-full h-full rounded-lg"
              />
              <img
                src={images[2] || fallback}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <div className="flex gap-4">
              <img
                src={images[3] || fallback}
                className="object-cover w-full h-full rounded-lg"
              />
              <img
                src={images[4] || fallback}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* 모달 안 전체 이미지 리스트 */}
        <DialogContent className="max-w-screen-lg sm:max-h-[90vh] sm:overflow-y-auto p-0">
          <DialogTitle className="p-4">전체 이미지 보기</DialogTitle>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 max-h-[70vh] overflow-y-auto">
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
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-col items-start justify-between w-full">
          {/* 장소 정보 */}
          <div className="flex items-start justify-between w-full">
            {/* 장소 정보 */}
            <div className="w-3/4 space-y-1">
              <div className="flex flex-row items-center gap-2">
                <h1 className="text-2xl font-semibold">
                  {game?.Place?.placeName}
                </h1>

                {/* ✅ 신청 인원 표시 */}
                {game?.Users && (
                  <span
                    className={`px-3 py-1 text-sm font-semibold ${fontColor.blue} ${bgColor.skyblue} rounded-full`}
                  >
                    <b className={`${fontColor.deepOrange}`}>
                      {game.Users.length}
                    </b>{" "}
                    / {game.numOfMember}명
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {game?.Place?.location?.split("/")?.[0]}
              </p>
            </div>
            {/* 아이콘 버튼 */}
            <div className="flex items-center justify-end w-1/4 gap-2">
              <Button
                variant="outline"
                size="icon"
                className="border-gray-300 cursor-pointer hover:bg-gray-100"
                onClick={() => handleCopyUrl()}
              >
                <FiShare className="text-gray-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-300 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleLike(gameId)}
              >
                {isLiked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-400" />
                )}
              </Button>
            </div>
          </div>
          <div className="w-full my-2 border-t border-blue-400" />{" "}
          {/* 구분선 */}
          {/* 왼쪽 메인 정보 */}
          <div className="w-full space-y-4 pointer-events-none lg:flex-2">
            {/* 편의시설 & 상세 정보 */}
            <PlaceOptionCard option={game?.Place?.Option || PlaceBasicOption} />
            <div className="my-2 border-t border-blue-400" /> {/* 구분선 */}
            {game?.Users && <RateCard users={game.Users} />}
            <div className="my-2 border-t border-blue-400" /> {/* 구분선 */}
            <PlaceNoteCard note={game?.Place?.Note || PlaceBasicNote} />
            <div className="my-2 border-t border-blue-400" /> {/* 구분선 */}
          </div>
        </div>

        <div className="w-full space-y-4 lg:sticky lg:top-24 lg:self-start lg:w-1/2">
          {/* 인기 게임 카드 */}
          <div className="hidden lg:block">
            <HotGameCard />
          </div>

          {/* 게임 정보 카드 - PC에서만 보임 */}
          <div className="hidden lg:block">
            <GameInfoCard game={game} />
          </div>

          {/* 모바일 하단 고정 버튼 */}
          <div className="fixed bottom-0 left-0 z-50 w-full px-4 py-3 bg-white sm:block lg:hidden">
            {game?.isProceed ? (
              <Button
                disabled
                className="w-full py-2 text-base text-white bg-gray-400 cursor-not-allowed"
              >
                마감되었습니다
              </Button>
            ) : (
              <Button
                className={`w-full pt-0 pb-0 text-base ${fontColor.white} ${bgColor.orange} hover:${bgColor.deepOrange}`}
                onClick={() => {
                  setIsPayOpen(true);
                  handleApply(game?.gameId);
                }}
              >
                신청하기
              </Button>
            )}
          </div>

          <PayModal
            open={isPayOpen}
            game={game}
            onClose={() => setIsPayOpen(false)}
          />
        </div>
      </div>

      {/* 지도 영역 */}
      <div>
        <LocationMap address={game?.Place?.location || ""} />
      </div>
    </div>
  );
}
