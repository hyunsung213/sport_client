"use client";

import { Button } from "@/components/ui/button";
import { getUserDetail } from "@/utils/get";
import { LevelRanges } from "@/utils/interface/rate";
import { User, UserDetail } from "@/utils/interface/user";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaCoins,
  FaUserFriends,
  FaCog,
  FaBullhorn,
  FaCommentDots,
} from "react-icons/fa";
import { IoGameController } from "react-icons/io5";
import { BiSolidLogOut } from "react-icons/bi";
import { logout } from "@/utils/auth/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // 경로는 실제 프로젝트 기준으로 조정
import { FaHeart } from "react-icons/fa6";

export default function MyPage() {
  const [userData, setUserData] = useState<UserDetail>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    }
  }, [user, router]);

  const getLevelFromRate = (rate: number | 0) => {
    const safeRate = rate ?? 0;
    const found = LevelRanges.find(
      (range) => safeRate >= range.min && safeRate <= range.max
    );
    return found ? found.level : "알 수 없음";
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await getUserDetail();
      console.log("게임 상세 정보:", res);
      setUserData(res);
    } catch (err) {
      console.error(err);
      setError("유저 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogout = async () => {
    try {
      await logout(); // 로그아웃 API 호출
      alert("로그아웃에 성공했습니다!"); // 성공 알림
      router.push("/"); // 홈으로 이동
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchUser();
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="grid max-w-screen-lg grid-cols-1 gap-6 px-4 py-8 mx-auto md:grid-cols-3 ">
        {/* 프로필 카드 */}
        <div className="flex flex-col col-span-1 gap-4 p-6 bg-white border shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">{user?.userName}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              className="h-auto px-2 py-1 text-xs"
              onClick={() => router.push("/myPage/editProfilePage")}
            >
              프로필 수정
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 border rounded-md">
              <p className="text-sm text-gray-500">Rate</p>
              <p className="text-base font-bold">
                {userData?.Rate?.rateValue || 0}
              </p>
            </div>
            <div className="p-2 border rounded-md">
              <p className="text-sm text-gray-500">조</p>
              <p className="text-base font-bold text-blue-500">
                {getLevelFromRate(userData?.Rate?.rateValue || 0)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm text-gray-500">나의 캐시</p>
              <p className="text-lg font-semibold">1억 원</p>
            </div>
            <Button className="px-4 text-white bg-blue-500 hover:bg-blue-600">
              충전하기
            </Button>
          </div>
        </div>

        {/* 메뉴 목록 */}
        <div className="flex flex-col col-span-1 gap-6">
          <div className="p-4 bg-white border shadow-sm rounded-xl">
            <h3 className="mb-2 font-semibold">목록</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li
                className="flex items-center gap-2 cursor-pointer hover:scale-102"
                onClick={() => router.push("/myPage/finishedGamesPage")}
              >
                <IoGameController />
                지난 게임
              </li>
              <li
                className="flex items-center gap-2 cursor-pointer hover:scale-102"
                onClick={() => router.push("/myPage/interestedGamesPage")}
              >
                <FaHeart /> 관심 게임
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:scale-102">
                <FaCoins /> 캐시 사용 내역
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:scale-102">
                <FaUserFriends /> 친구
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:scale-102">
                <FaCog /> 설정
              </li>
              <li
                className="flex items-center gap-2 cursor-pointer hover:scale-102"
                onClick={() => fetchLogout()}
              >
                <BiSolidLogOut /> 로그아웃
              </li>
            </ul>
          </div>

          {/* 고객센터 */}
          <div className="p-4 bg-white border shadow-sm rounded-xl">
            <h3 className="mb-2 font-semibold">고객센터</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <FaCommentDots /> 자주 묻는 내용
              </li>
              <li className="flex items-center gap-2">
                <FaBullhorn /> 공지 사항
              </li>
            </ul>
          </div>
        </div>

        {/* 여백 또는 추후 영역 (예: 활동 내역, 추천 게임 등) */}
        <div className="hidden md:block col-span-1 bg-white rounded-xl shadow-sm border min-h-[300px]" />
      </div>
    </div>
  );
}
