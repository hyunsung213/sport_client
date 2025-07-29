// app/auth/kakao/callback/KakaoCallbackPage.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { kakaoLoginCallback } from "@/utils/auth/auth";

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { refetchUser } = useAuth();

  useEffect(() => {
    const login = async () => {
      if (!code) return;
      try {
        const result = await kakaoLoginCallback(code);
        if (result?.message === "카카오 로그인 성공") {
          if (result.isNewUser) router.push("/auth/signup/social");
          else {
            await refetchUser();
            router.push("/");
          }
        } else alert("카카오 로그인 실패");
      } catch {
        alert("카카오 로그인 실패");
      }
    };
    login();
  }, [code]);

  return null;
}
