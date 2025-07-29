"use client";

import { useAuth } from "@/context/AuthContext";
import { kakaoLoginCallback } from "@/utils/auth/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const { user, loading, refetchUser } = useAuth();

  useEffect(() => {
    const handleKakaoLogin = async () => {
      try {
        const result = await kakaoLoginCallback(code!); // code는 항상 있다고 가정

        if (result?.message === "카카오 로그인 성공") {
          if (result.isNewUser) {
            router.push("/auth/signup/social");
          } else {
            console.log("✅ 카카오톡 로그인 성공. 홈으로 이동");
            await refetchUser(); // ✅ 사용자 정보 재요청
            router.push("/");
          }
        } else {
          console.error("❌ 응답 실패 또는 사용자 없음");
          alert("카카오 로그인 실패: 사용자 정보 없음");
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

  return (
    <Suspense>
      <p className="mt-10 text-center">카카오 로그인 처리 중...</p>
    </Suspense>
  );
}
