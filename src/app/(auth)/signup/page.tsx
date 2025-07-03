"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signUp } from "@/utils/auth/auth";

export default function SignUpPage() {
  const [form, setForm] = useState({
    userName: "",
    password: "",
    email: "",
    city: "",
    phoneNum: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signUpCheck = async () => {
    setLoading(true);
    setError("");

    try {
      await signUp(form);
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("회원가입 실패. 입력값을 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-sm p-6 mx-auto mt-20 space-y-4">
      <h2 className="text-xl font-bold text-center">회원가입</h2>
      <Input
        name="userName"
        placeholder="이름"
        value={form.userName}
        onChange={handleChange}
      />
      <Input
        name="email"
        placeholder="이메일"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        name="password"
        type="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={handleChange}
      />
      <Input
        name="city"
        placeholder="거주 도시"
        value={form.city}
        onChange={handleChange}
      />
      <Input
        name="phoneNum"
        placeholder="전화번호"
        value={form.phoneNum}
        onChange={handleChange}
      />
      <Button className="w-full" onClick={signUpCheck} disabled={loading}>
        {loading ? "가입 중..." : "회원가입"}
      </Button>
      {error && <p className="text-sm text-center text-red-500">{error}</p>}
    </Card>
  );
}
