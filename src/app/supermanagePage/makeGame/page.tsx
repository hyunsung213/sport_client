// app/manage/game/create/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { usePlaces } from "@/context/PlaceContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { getAllPlaceDetail, getSupporters } from "@/utils/get";
import { PlaceDetail, PlaceDetailWithGames } from "@/utils/interface/place";
import { Card } from "@/components/ui/card";
import LocationMap from "@/components/detailPage/LocationMap";
import HourMinutePicker from "@/components/supermanagePage/HourMinutePicker";
import { IGame } from "@/utils/interface/game";
import { postGame } from "@/utils/post";
import { Slider } from "@/components/ui/slider";
import { User } from "@/utils/interface/user";
import { useAuth } from "@/context/AuthContext";

export default function CreateGamePage() {
  const router = useRouter();

  const [places, setPlaces] = useState<PlaceDetailWithGames[]>([]);
  const [selectPlace, setSelectPlace] = useState<PlaceDetailWithGames>();
  const [supporters, setSupporters] = useState<User[]>([]);
  const [selectSupporter, setSelectSupporter] = useState<User>();
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [numOfMember, setNumOfMember] = useState<number>(4);
  const [cost, setCost] = useState<number>(0);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const res = await getAllPlaceDetail();
      setPlaces(res || []);
      console.log("장소 정보:", res);
    } catch {
      setError("장소를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSupporters = async () => {
    setLoading(true);
    try {
      const res = await getSupporters();
      setSupporters(res || []);
      console.log("서포터 정보:", res);
    } catch {
      setError("서포터 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectPlace = async (selectPlaceId: number) => {
    setLoading(true);
    try {
      // places에서 해당 ID를 가진 장소 찾기
      const selectedPlace: PlaceDetailWithGames | undefined = places.find(
        (place) => place.placeId === selectPlaceId
      );

      // 선택된 장소 상태로 저장
      setSelectPlace(selectedPlace); // null로 fallback
    } catch (error) {
      console.error("장소 선택 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectSupporter = async (selectUserId: number) => {
    setLoading(true);
    try {
      // places에서 해당 ID를 가진 장소 찾기
      const selectedSupporter: User | undefined = supporters.find(
        (supporter) => supporter.userId === selectUserId
      );

      // 선택된 장소 상태로 저장
      setSelectSupporter(selectedSupporter); // null로 fallback
    } catch (error) {
      console.error("서포터 선택 중 오류", error);
    } finally {
      setLoading(false);
    }
  };

  const combineDateAndTime = (
    date: Date | undefined,
    time: string
  ): string | undefined => {
    if (!date || !time) return undefined;

    const [hourStr, minuteStr] = time.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (isNaN(hour) || isNaN(minute)) return undefined;

    const kstDate = new Date(date);
    kstDate.setHours(hour);
    kstDate.setMinutes(minute);
    kstDate.setSeconds(0);
    kstDate.setMilliseconds(0);
    const utcDate = new Date(kstDate);

    return utcDate.toISOString(); //ktc로 넘겨줌
  };

  const handleSubmit = async () => {
    if (!selectPlace?.placeId || !date || !time || !numOfMember || !cost) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const gameDate = combineDateAndTime(date, time);
    const placeId = Number(selectPlace.placeId);
    const supporterId = Number(selectSupporter?.userId);

    const newGame: IGame = {
      placeId,
      date: gameDate ?? "",
      numOfMember,
      cost,
      supporterId,
    };

    try {
      console.log(newGame);
      const res = await postGame(newGame);

      if (res) {
        alert("게임이 생성되었습니다!");
        router.push("/supermanagePage/makeGame"); // 목록 페이지로 이동
      } else {
        alert("게임 생성에 실패했습니다.");
      }
    } catch (err) {
      console.error("게임 생성 오류:", err);
    }
  };

  // ✅ 슈퍼 매니저가 아닐 경우 홈으로 리다이렉트
  useEffect(() => {
    if (!loading && (!user || !user.isSuperManager)) {
      alert("접근 권한이 없습니다.");
      router.replace("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchPlaces();
    fetchSupporters();
  }, []);

  return (
    <div className="p-6 mx-auto mt-6 mb-6 space-y-8 bg-white border shadow-md w-5xl rounded-2xl">
      {/* 상단: 타이틀 + 셀렉터 */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h2 className="w-full text-2xl font-bold">게임 만들기</h2>
        <div className="flex flex-row justify-end w-full gap-4">
          {/* 장소 선택 */}
          <div className="flex flex-col w-auto">
            <Label className="block mb-1 text-xl font-bold">장소 선택</Label>
            <Select onValueChange={(value) => fetchSelectPlace(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="장소를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {places.map((p) => (
                  <SelectItem key={p.placeId} value={p.placeId.toString()}>
                    {p.placeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 서포터 선택 */}
          <div className="flex flex-col w-auto">
            <Label className="block mb-1 text-xl font-bold">서포터 선택</Label>
            <Select
              onValueChange={(value) => fetchSelectSupporter(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="서포터를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {supporters.map((s) => (
                  <SelectItem key={s.userId} value={s.userId.toString()}>
                    {s.userName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 중간: 장소 정보 + 게임 목록 (왼쪽) / 지도 (오른쪽) */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* 왼쪽: 장소 정보 + 게임 리스트 */}
        <div className="flex flex-col w-full space-y-4 md:w-1/2">
          <Card className="p-4 border shadow-sm rounded-xl min-h-[120px]">
            {selectPlace ? (
              <>
                <h3 className="text-lg font-semibold">
                  {selectPlace.placeName}
                </h3>
                {selectPlace.User?.userName && (
                  <p className="text-sm text-gray-500">
                    담당자: {selectPlace.User.userName}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  연락처: {selectPlace.User?.phoneNum ?? "010-2655-6262"}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">
                장소를 선택하면 정보가 표시됩니다.
              </p>
            )}
          </Card>

          <Card className="p-4 border shadow-sm rounded-xl min-h-[120px]">
            {selectPlace ? (
              <>
                <h4 className="mb-2 text-xl font-bold text-gray-700">
                  📅 해당 장소의 게임 목록
                </h4>
                {selectPlace.Games?.length > 0 ? (
                  <ul className="space-y-2">
                    {selectPlace.Games.map((game) => (
                      <li
                        key={game.gameId}
                        className="flex items-center justify-between px-4 py-2 text-sm border rounded-md bg-gray-50"
                      >
                        <span>
                          🕒{" "}
                          {new Intl.DateTimeFormat("ko-KR", {
                            dateStyle: "short",
                            timeStyle: "short",
                            timeZone: "Asia/Seoul", // 👈 명시적으로 한국 시간대 지정
                          }).format(new Date(game.date))}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">
                    등록된 게임이 없습니다.
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-400">
                장소를 선택하면 게임 목록이 표시됩니다.
              </p>
            )}
          </Card>
        </div>

        {/* 오른쪽: 지도 */}
        <Card className="w-full md:w-1/2 h-[400px] p-3 border shadow-sm rounded-xl">
          {selectPlace ? (
            <div className="w-full h-full overflow-hidden rounded-md">
              <LocationMap address={selectPlace.location} />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-sm text-gray-400">
              장소를 선택하면 지도가 표시됩니다.
            </div>
          )}
        </Card>
      </div>

      {/* 하단: 날짜, 시간, 인원 수, 가격 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-4 border shadow-sm rounded-xl min-h-[120px] items-center">
          <Label className="block text-xl font-bold text-gray-700">
            날짜 선택
          </Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => setDate(d)} // 그냥 바로 setDate(d)
          />
        </Card>

        <Card className="p-4 border shadow-sm rounded-xl min-h-[120px] items-center">
          <Label className="block text-xl font-bold text-gray-700">
            시간 선택
          </Label>
          <HourMinutePicker onTimeChange={(val) => setTime(val)} />
        </Card>

        <Card className="p-6 space-y-6 border shadow-sm rounded-2xl">
          {/* 인원 수 입력 */}
          <div className="flex flex-col space-y-2">
            <Label className="text-base font-semibold text-gray-700">
              인원 수: {numOfMember}명
            </Label>
            <Slider
              min={2}
              max={10}
              step={1}
              value={[numOfMember]}
              onValueChange={([val]) => setNumOfMember(val)}
              className="w-full"
            />
          </div>

          {/* 가격 입력 */}
          <div className="flex flex-col space-y-2">
            <Label className="text-base font-semibold text-gray-700">
              가격 (원): {cost}원
            </Label>
            <Slider
              min={0}
              max={50000}
              step={500}
              value={[cost]}
              onValueChange={([val]) => setCost(val)}
              className="w-full"
            />
          </div>
        </Card>
      </div>

      <Button className="w-full mt-6" onClick={() => handleSubmit()}>
        게임 만들기
      </Button>
    </div>
  );
}
