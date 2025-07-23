"use client";

import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/utils/auth/auth";
import { Button } from "./ui/button";
import { bgColor, brandColors, fontColor } from "@/styles/color";
import { useAuth } from "@/context/AuthContext";
import { MdOutlineScoreboard } from "react-icons/md";

export default function Header() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { user, loading, refetchUser } = useAuth();

  const fetchLogout = async () => {
    try {
      await logout();
      await refetchUser();
      router.push(`/`);
      alert("로그아웃을 성공적으로 진행했습니다!");
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃에 실패했습니다.");
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white border-b shadow-sm sm:static">
      <div className="w-full px-4 sm:px-6">
        {/* ✅ 이 부분을 감싸는 div에 max-width 적용 */}
        <div className="flex items-center justify-between w-full h-16 max-w-screen-lg mx-auto">
          {/* 왼쪽 로고 */}
          <div
            className="flex items-center space-x-2 cursor-pointer sm:space-x-3"
            onClick={() => router.push("/")}
          >
            <Image
              src="/images/sport_web_logo.png"
              alt="로고"
              width={40}
              height={40}
              className="sm:w-[60px] sm:h-[60px]"
            />
            <span
              className={`text-lg sm:text-2xl font-bold tracking-tight ${fontColor.orange}`}
            >
              SportWeb
            </span>
          </div>

          {/* 오른쪽 유저 관련 메뉴 */}
          <div className="flex items-center gap-5 sm:gap-10">
            {user ? (
              <>
                {user.isManager && (
                  <div className="hidden sm:block">
                    <button
                      className={`${fontColor.olive} text-xs font-bold sm:text-sm hover:scale-105`}
                      onClick={() => router.push("/managePage/calendar")}
                    >
                      내 장소관리
                    </button>
                  </div>
                )}

                {user.isSuperManager && (
                  <div className="hidden sm:block">
                    <button
                      className={`${fontColor.olive} font-bold text-xs sm:text-sm hover:scale-105`}
                      onClick={() => router.push("/supermanagePage/makeGame")}
                    >
                      게임 만들기
                    </button>
                  </div>
                )}

                {user.isSupporter && (
                  <button
                    className="flex items-center justify-center p-0 text-xs bg-transparent border-none sm:text-sm hover:scale-105"
                    onClick={() => router.push("/supportPage/match")}
                  >
                    {/* 모바일: 아이콘만 */}
                    <span className="block sm:hidden">
                      <MdOutlineScoreboard
                        size={25}
                        className={`${fontColor.orange}`}
                      />
                    </span>
                    {/* PC: 텍스트만 */}
                    <span
                      className={`hidden sm:block font-bold ${fontColor.olive}`}
                    >
                      서포터
                    </span>
                  </button>
                )}

                <button
                  className="flex items-center justify-center p-0 text-xs bg-transparent border-none sm:text-sm hover:scale-105"
                  onClick={() => router.push("/myPage")}
                >
                  <FaUserCircle
                    size={25}
                    className={`${fontColor.orange} sm:${fontColor.olive} cursor-pointer sm:size-[33px]`}
                  />
                </button>

                <button
                  className={`${fontColor.deepOrange} text-xs sm:text-sm font-bold hover:scale-105 hidden sm:block`}
                  onClick={fetchLogout}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <button
                className={`${bgColor.white} ${fontColor.blue} text-xs sm:text-sm font-bold hover:scale-105`}
                onClick={() => router.push("/auth/login")}
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
