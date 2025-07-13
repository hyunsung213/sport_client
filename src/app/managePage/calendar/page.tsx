"use client";

import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  addDays,
  format,
  getWeek,
  isSameDay,
  parseISO,
  startOfWeek,
} from "date-fns";
import { ko } from "date-fns/locale";
import { usePlaces } from "@/context/PlaceContext";
import { PlaceDetailWithGames } from "@/utils/interface/place";

const categories = [
  { name: "Product Design", color: "bg-green-200", time: "5h00" },
  { name: "Software Engineering", color: "bg-blue-200", time: "3h00" },
  { name: "User Research", color: "bg-purple-200", time: "1h00" },
  { name: "Marketing", color: "bg-red-200", time: "0h00" },
];

export default function ManagePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const daysKor = ["일", "월", "화", "수", "목", "금", "토"];
  const { places, selectedPlaceId } = usePlaces();

  const HOURS = Array.from({ length: 17 }, (_, i) => 8 + i); // 08:00 ~ 24:00
  const selectedPlace: PlaceDetailWithGames | undefined = places.find(
    (place) => place.placeId.toString() === selectedPlaceId
  );

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  }, [selectedDate]);

  if (!selectedDate) return null;

  const startOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }).map((_, i) =>
    addDays(startOfSelectedWeek, i)
  );

  if (!selectedPlace)
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-lg text-pastel-blue">
          장소를 선택해주시기 바랍니다
        </span>
      </div>
    );

  return (
    <div className="flex flex-col h-screen px-4 pt-5 pb-5 w-6xl">
      <div className="flex flex-1 space-x-6">
        {/* Sidebar */}
        <div className="w-1/4 p-4 space-y-6 overflow-y-auto bg-white border shadow-xl rounded-xl border-pastel-border">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="border shadow rounded-xl"
          />

          <div>
            <h2 className="mb-3 text-lg font-semibold">카테고리</h2>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between"
                >
                  <Badge
                    className={`${cat.color} px-3 py-1 text-sm font-medium border border-pastel-border`}
                  >
                    {cat.name}
                  </Badge>
                  <span className="text-sm text-gray-400">{cat.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-pastel-blue">
              우선순위
            </h2>
            <ul className="space-y-1 text-sm text-gray-400 list-disc list-inside">
              <li>Eisenhower Matrix</li>
              <li>Eat The Frog First</li>
            </ul>
          </div>
        </div>

        {/* Main Schedule */}
        <div className="flex-1 p-4 overflow-auto bg-white border shadow-xl rounded-xl">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-6 space-x-5">
              <h1 className="text-xl font-bold text-gray-800">
                {format(weekDates[0], "MMMM d")} -{" "}
                {format(weekDates[6], "d, yyyy")}
              </h1>
              <span className="px-3 py-1 font-bold text-gray-800 bg-gray-100 rounded-full shadow-sm text-l">
                Week {getWeek(weekDates[0])}
              </span>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)] rounded-lg border bg-white">
              <div className="relative grid grid-cols-8">
                {/* 시간 컬럼 */}
                <div className="flex flex-col items-end pr-2 text-xs text-gray-400 mt-[40px] bg-white">
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="relative w-full h-[60px] border-t border-gray-200"
                    >
                      <span className="absolute left-0 top-1 text-[11px] text-gray-500">
                        {String(hour).padStart(2, "0")}:00
                      </span>
                    </div>
                  ))}
                </div>

                {/* 요일별 컬럼 */}
                {weekDates.map((date, colIndex) => {
                  const isSelected = isSameDay(date, selectedDate);

                  return (
                    <div
                      key={colIndex}
                      className={`relative border-r ${
                        isSelected ? "bg-blue-50" : "bg-white"
                      }`}
                    >
                      {/* 요일 헤더 */}
                      <div
                        onClick={() => setSelectedDate(date)}
                        className={`h-[40px] sticky top-0 z-10 flex flex-col items-center justify-center cursor-pointer
                        ${
                          isSelected
                            ? "bg-blue-100 text-blue-800 font-bold"
                            : date.getDay() === 0
                            ? "bg-gray-100 text-red-500"
                            : date.getDay() === 6
                            ? "bg-gray-100 text-blue-500"
                            : "bg-gray-100 text-gray-600"
                        }
                      `}
                      >
                        <h3 className="text-sm">
                          {format(date, "d", { locale: ko })}
                        </h3>
                        <span className="text-xs">
                          {daysKor[date.getDay()]}
                        </span>
                      </div>

                      {/* 시간선 */}
                      {HOURS.map((_, i) => (
                        <div
                          key={i}
                          className="absolute left-0 right-0 border-t border-gray-100"
                          style={{ top: `${i * 60}px` }}
                        />
                      ))}

                      {/* 게임 카드 */}
                      {selectedPlace?.Games?.filter((game) =>
                        isSameDay(parseISO(game.date), date)
                      ).map((game) => {
                        const gameDate = parseISO(game.date);
                        const startHour = gameDate.getHours();
                        const startMin = gameDate.getMinutes();
                        const topOffset = (startHour - 9) * 60 + startMin;

                        return (
                          <div
                            key={game.gameId}
                            className="absolute left-[5%] w-[90%] rounded-lg bg-blue-50 border border-blue-300 shadow-sm overflow-hidden"
                            style={{ top: `${topOffset}px`, height: "90px" }}
                          >
                            <div className="flex h-full border-l-4 border-blue-600">
                              <CardContent className="flex flex-col justify-center p-2 text-xs text-left text-gray-700">
                                <span className="text-sm font-semibold text-blue-900">
                                  Game #{game.gameId}
                                </span>
                                <span>인원: {game.numOfMember}명</span>
                                <span>시간: {format(gameDate, "HH:mm")}</span>
                              </CardContent>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
