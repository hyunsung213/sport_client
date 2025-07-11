"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KakaoCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      fetch("http://localhost:3001/auth/kakao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 세션 유지
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("로그인 완료:", data);
          router.push("/"); // 홈으로 이동
        })
        .catch((err) => {
          console.error("로그인 실패", err);
        });
    }
  }, [router]);

  return <p>로그인 중입니다...</p>;
}
