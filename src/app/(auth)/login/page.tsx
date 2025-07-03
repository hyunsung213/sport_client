"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { login } from "@/utils/auth/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const loginCheck = async () => {
    setLoading(true);
    setError("");

    try {
      await login({ email, password });
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("로그인 실패. 아이디 또는 비밀번호를 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-sm p-6 mx-auto mt-20 space-y-4">
      <h2 className="text-xl font-bold text-center">로그인</h2>
      <Input
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
      <Button className="w-full" onClick={loginCheck} disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </Button>
      {error && <p className="text-sm text-center text-red-500">{error}</p>}
    </Card>
  );
}
