// app/auth/google/callback/GoogleCallbackPage.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { googleLoginCallback } from "@/utils/auth/auth";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { refetchUser } = useAuth();

  useEffect(() => {
    const login = async () => {
      if (!code) return;
      try {
        const result = await googleLoginCallback(code);
        if (result?.message === "구글 로그인 성공") {
          if (result.isNewUser) router.push("/auth/signup/social");
          else {
            await refetchUser();
            router.push("/");
          }
        } else alert("구글 로그인 실패");
      } catch {
        alert("구글 로그인 실패");
      }
    };
    login();
  }, [code]);

  return null;
}
