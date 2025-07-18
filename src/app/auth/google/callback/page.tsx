"use client";

import { useAuth } from "@/context/AuthContext";
import { googleLoginCallback } from "@/utils/auth/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const { user, loading, refetchUser } = useAuth();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        const result = await googleLoginCallback(code!);

        if (result?.message === "구글 로그인 성공") {
          if (result.isNewUser) {
            router.push("/auth/signup/social");
          } else {
            console.log("✅ 구글 로그인 성공. 홈으로 이동");
            await refetchUser(); // ✅ JWT 기반 사용자 정보 갱신
            router.push("/");
          }
        } else {
          console.error("❌ 응답 실패 또는 사용자 없음");
          alert("구글 로그인 실패: 사용자 없음");
        }
      } catch (err) {
        console.error("❌ 구글 로그인 실패:", err);
        alert("구글 로그인 실패");
      }
    };

    if (code) {
      handleGoogleLogin();
    }
  }, [code, router]);

  return <p className="mt-10 text-center">구글 로그인 처리 중...</p>;
}
