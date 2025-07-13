"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getGoogleLoginUrl, getKakaoLoginUrl, login } from "@/utils/auth/auth";
import { useSession } from "@/context/SessionContext";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { session, loading, refetchSession } = useSession();

  const handleLogin = async () => {
    const result = await login({ email, password });

    if (result?.message === "로그인 성공") {
      await refetchSession();
      router.push("/"); // 로그인 성공 후 이동할 페이지
    } else {
      setErrorMsg(result?.message || "로그인에 실패했습니다.");
    }
  };

  //SignUp 페이지로 이동하는 함수
  const goToSignup = () => {
    router.push(`/auth/signup`);
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-10 space-y-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold text-center">로그인</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full" onClick={handleLogin}>
            이메일로 로그인하기
          </Button>

          {errorMsg && (
            <p className="text-sm text-center text-red-500">{errorMsg}</p>
          )}
        </div>
      </form>

      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-sm text-gray-500">또는</span>
        <Separator className="flex-1" />
      </div>

      <Button
        variant="outline"
        className="w-full text-fuchsia-900 bg-fuchsia-300 hover:bg-fuchsia-400"
        onClick={() => goToSignup()}
      >
        회원가입하기
      </Button>

      <a href={getKakaoLoginUrl()}>
        <Button
          variant="outline"
          className="w-full text-yellow-900 bg-yellow-300 hover:bg-yellow-400"
        >
          🟡 카카오로 로그인하기
        </Button>
      </a>
      <a href={getGoogleLoginUrl()}>
        <Button
          variant="outline"
          className="w-full text-white bg-red-500 hover:bg-red-600"
        >
          🔴 구글로 로그인하기
        </Button>
      </a>
    </div>
  );
}
