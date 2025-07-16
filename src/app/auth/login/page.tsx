"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getGoogleLoginUrl, getKakaoLoginUrl, login } from "@/utils/auth/auth";
import { useSession } from "@/context/SessionContext";
import Image from "next/image";

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
    <div className="justify-center p-6 mx-auto mt-10 space-y-6 bg-white shadow w-xl rounded-xl">
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
          <Button
            className="w-full text-white bg-black hover:bg-gray-800"
            onClick={handleLogin}
          >
            로그인하기
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

      <div className="flex justify-center w-full gap-4">
        <a href={getKakaoLoginUrl()}>
          <Button
            variant="ghost"
            className="flex items-center justify-center w-10 h-10 p-0 bg-yellow-300 rounded-full hover:bg-yellow-400"
          >
            <Image
              src="/images/KakaoTalk_logo.png"
              alt="Kakao Logo"
              width={24}
              height={24}
            />
          </Button>
        </a>

        <a href={getGoogleLoginUrl()}>
          <Button
            variant="ghost"
            className="flex items-center justify-center w-10 h-10 p-0 bg-white border border-gray-300 rounded-full hover:bg-gray-100"
          >
            <Image
              src="/images/Google_logo.png"
              alt="Google Logo"
              width={24}
              height={24}
            />
          </Button>
        </a>
      </div>

      <Button
        variant="link"
        className="w-full text-sm text-gray-600 hover:text-black"
        onClick={() => goToSignup()}
      >
        회원가입하기
      </Button>
    </div>
  );
}
