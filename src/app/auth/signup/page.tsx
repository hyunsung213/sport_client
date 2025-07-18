"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signUp } from "@/utils/auth/auth";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { seoulDistricts } from "@/lib/seoul";
import { Switch } from "@/components/ui/switch";

export default function SignUpPage() {
  const [form, setForm] = useState({
    userName: "",
    password: "",
    email: "",
    city: "",
    phoneNum: "",
    isManager: false,
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
    // 전화번호 유효성 검사 (010-xxxx-xxxx)
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(form.phoneNum)) {
      setError("전화번호는 010-xxxx-xxxx 형식이어야 합니다.");
      setLoading(false);
      return;
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      await signUp(form);
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      setError("회원가입 실패. 입력값을 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, ""); // 숫자만 추출
    if (input.length >= 11) input = input.slice(0, 11); // 최대 11자리 제한

    const formatted = input.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");

    setForm({ ...form, phoneNum: formatted });
  };

  return (
    <Card className="p-6 mx-auto mt-20 space-y-4 w-2xl">
      <h2 className="text-xl font-bold text-center">회원가입</h2>
      <Input
        name="userName"
        placeholder="이름"
        value={form.userName}
        onChange={handleChange}
      />
      <Input
        name="email"
        placeholder="email (예: xxxx@gmail.com)"
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
      <Select onValueChange={(val) => setForm({ ...form, city: val })}>
        <SelectTrigger className="text-sm h-9">
          <SelectValue placeholder="지역구 선택" />
        </SelectTrigger>
        <SelectContent className="overflow-y-auto max-h-40">
          <SelectGroup>
            <SelectLabel>서울</SelectLabel>
            {seoulDistricts.map((district) => (
              <SelectItem key={district.name} value={district.address}>
                {district.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input
        name="phoneNum"
        placeholder="전화번호 (예: 010-1234-5678)"
        value={form.phoneNum}
        onChange={handlePhoneChange}
      />
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2">
          <Switch
            checked={form.isManager}
            onCheckedChange={(val) =>
              setForm((prev) => ({ ...prev, isManager: val }))
            }
          />
          장소 관리자
        </label>
      </div>
      <Button className="w-full" onClick={signUpCheck} disabled={loading}>
        {loading ? "가입 중..." : "회원가입"}
      </Button>
      {error && <p className="text-sm text-center text-red-500">{error}</p>}
    </Card>
  );
}
