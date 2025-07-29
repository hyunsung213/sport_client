// app/auth/google/callback/page.tsx
import { Suspense } from "react";
import GoogleCallbackPage from "./GoogleCallbackPage";

export default function Page() {
  return (
    <Suspense
      fallback={<p className="mt-10 text-center">구글 로그인 처리 중...</p>}
    >
      <GoogleCallbackPage />
    </Suspense>
  );
}
