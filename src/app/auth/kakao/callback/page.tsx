"use client";

import { useSession } from "@/context/SessionContext";
import { kakaoLoginCallback } from "@/utils/auth/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { session, loading, refetchSession } = useSession();

  useEffect(() => {
    const handleKakaoLogin = async () => {
      try {
        const result = await kakaoLoginCallback(code!); // code는 항상 존재한다고 가정

        if (result?.message === "카카오 로그인 성공") {
          if (result.isNewUser) {
            router.push("/auth/signup/social");
          } else {
            console.log("✅ 카카오톡 로그인 성공. 홈으로 이동");
            await refetchSession();
            router.push("/");
          }
        } else {
          console.error("❌ 응답 실패 또는 세션 없음");
          alert("카카오 로그인 실패: 세션 없음");
        }
      } catch (err) {
        console.error("❌ 카카오 로그인 실패:", err);
        alert("카카오 로그인 실패");
      }
    };

    if (code) {
      handleKakaoLogin();
    }
  }, [code, router]);

  return <p className="mt-10 text-center">카카오 로그인 처리 중...</p>;
}
