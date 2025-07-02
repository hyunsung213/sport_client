"use client";

import { GameDetail } from "@/utils/interface/game";
import { Card, CardContent } from "../ui/card";
import { useEffect, useState } from "react";
import { getAllGameDetail } from "@/utils/get";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"; // ✅ shadcn/ui Select 제대로 import
import { seoulDistricts } from "@/lib/seoul";

export default function GameList({ selectDate }: { selectDate: string }) {
  const [games, setGames] = useState<GameDetail[]>([]);
  const [selectDistrict, setSelectDistrict] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGames = async () => {
    setLoading(true);
    try {
      const result = await getAllGameDetail();
      console.log(result);
      setGames(result || []);
    } catch (err) {
      console.error(err);
      setError("게임 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const filteredGames = games.filter((game) => game.date === selectDate);

  return (
    <div>
      <div>
        <Select onValueChange={(val) => setSelectDistrict(val)}>
          <SelectTrigger className="h-8 text-sm w-180px">
            <SelectValue placeholder="지역구 선택" />
          </SelectTrigger>
          <SelectContent className="overflow-y-auto max-h-40">
            <SelectGroup>
              <SelectLabel>서울</SelectLabel>
              {seoulDistricts.map((district) => (
                <SelectItem key={district.name} value={district.address}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 게임 카드 */}
      {filteredGames.length > 0 ? (
        <Card className="mt-4">
          <CardContent className="flex items-center justify-between p-2 rounded bg-green-50">
            <span className="text-sm font-semibold">
              {filteredGames[0].date}
            </span>
            <span className="text-sm text-gray-700">
              {filteredGames[0].Place.placeName}
            </span>
            <span className="text-sm text-gray-600">
              {filteredGames[0].Users.length} / {filteredGames[0].numOfMember}
            </span>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-4 text-center text-gray-500">
          해당 날짜에 게임이 없습니다.
        </div>
      )}
    </div>
  );
}
