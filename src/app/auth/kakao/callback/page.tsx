// app/auth/kakao/callback/page.tsx
import { Suspense } from "react";
import KakaoCallbackPage from "./KakaoCallbackPage";

export default function Page() {
  return (
    <Suspense
      fallback={<p className="mt-10 text-center">카카오 로그인 처리 중...</p>}
    >
      <KakaoCallbackPage />
    </Suspense>
  );
}
