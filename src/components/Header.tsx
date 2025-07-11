"use client";

import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "@/utils/get";
import { Session } from "@/utils/interface/user";
import { GrUserManager } from "react-icons/gr";
import { GiSuperMushroom } from "react-icons/gi";
import { Button } from "./ui/button";
import { logout } from "@/utils/auth/auth";

export default function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<Session>();

  const fetchSession = async () => {
    setLoading(true);
    try {
      const res = await getSession();
      console.log("세션 정보", res);
      setSession(res);
    } catch (err) {
      console.error(err);
      setError("세션 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogout = async () => {
    try {
      const res = await logout();
      router.push(`/`);
      alert("로그아웃을 성공적으로 진행했습니다!");
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃에 실패했습니다.");
    }
  };

  //Game 상세 페이지로 이동하는 함수
  const goToMyPage = () => {
    router.push(`/myPage/`);
  };

  //Manage 페이지로 이동하는 함수
  const goToManagePage = () => {
    router.push(`/managePage/calendar`);
  };

  //SuperManage 페이지로 이동하는 함수
  const goToSuperManagePage = () => {
    router.push(`/supermanagePage/makeGame`);
  };

  //Main 페이지로 이동하는 함수
  const goToMainPage = () => {
    router.push(`/`);
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchSession();
    };
    fetchAll();
  }, []);

  return (
    <header className="flex items-center justify-between w-full h-16 border-b shadow-sm">
      {/* 왼쪽 로고 */}
      <div className="flex items-center space-x-2">
        {/* <Image src="/logo.png" alt="로고" width={28} height={28} /> */}
        <span
          onClick={() => goToMainPage()}
          className="text-xl font-bold cursor-pointer"
        >
          MyApp
        </span>
      </div>

      {/* 우측 사용자 아이콘 */}
      <div className="flex items-center space-x-4">
        {session?.isManager && (
          <>
            <Button
              variant="outline"
              className="text-sm font-medium"
              onClick={goToManagePage}
            >
              내 장소관리
            </Button>

            {session?.isSuperManager && (
              <Button
                variant="default"
                className="text-sm font-medium"
                onClick={goToSuperManagePage}
              >
                게임 만들기
              </Button>
            )}
          </>
        )}
        <FaUserCircle
          size={28}
          className="text-gray-600 cursor-pointer"
          onClick={goToMyPage}
        />
        <Button onClick={fetchLogout} className="text-red-600">
          로그아웃
        </Button>
      </div>
    </header>
  );
}
