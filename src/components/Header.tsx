"use client";

import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/utils/auth/auth";
import { Button } from "./ui/button";
import { useSession } from "@/context/SessionContext";

export default function Header() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { session, loading, refetchSession } = useSession();

  const fetchLogout = async () => {
    try {
      await logout();
      await refetchSession();
      router.push(`/`);
      alert("로그아웃을 성공적으로 진행했습니다!");
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃에 실패했습니다.");
    }
  };

  return (
    <header className="w-full border-b shadow-sm">
      <div className="flex items-center justify-between h-16 px-6 mx-auto w-5xl">
        {/* 왼쪽 로고 */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/images/sport_web_logo.png"
            alt="로고"
            width={60}
            height={60}
          />
          <span className="text-2xl font-bold tracking-tight text-white">
            SportWeb
          </span>
        </div>

        {/* 오른쪽 유저 관련 메뉴 */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              {session.isManager && (
                <Button
                  variant="outline"
                  className="border-[#407AAC] text-[#407AAC] hover:bg-[#407AAC] hover:text-white"
                  onClick={() => router.push("/managePage/calendar")}
                >
                  내 장소관리
                </Button>
              )}

              {session.isSuperManager && (
                <Button
                  className="bg-[#407AAC] text-white hover:bg-[#305d88]"
                  onClick={() => router.push("/supermanagePage/makeGame")}
                >
                  게임 만들기
                </Button>
              )}

              {session.isSupporter && (
                <Button
                  variant="outline"
                  className="border-[#407AAC] text-[#407AAC] hover:bg-[#407AAC] hover:text-white"
                  onClick={() => router.push("/supportPage/match")}
                >
                  서포터
                </Button>
              )}

              <FaUserCircle
                size={26}
                className="text-white cursor-pointer"
                onClick={() => router.push("/myPage")}
              />

              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#C14C21]"
                onClick={fetchLogout}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <Button
              className="bg-white text-[#C14C21] hover:bg-[#407AAC] hover:text-white"
              onClick={() => router.push("/auth/login")}
            >
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
