"use client";

import { useSession } from "@/context/SessionContext";
import { googleLoginCallback } from "@/utils/auth/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { session, loading, refetchSession } = useSession();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        const result = await googleLoginCallback(code!);

        if (result?.message === "구글 로그인 성공") {
          if (result.isNewUser) {
            router.push("/auth/signup/social");
          } else {
            console.log("✅ 구글 로그인 성공. 홈으로 이동");
            await refetchSession();
            router.push("/");
          }
        } else {
          console.error("❌ 응답 실패 또는 세션 없음");
          alert("구글 로그인 실패: 세션 없음");
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
