"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { useAuth } from "@/context/AuthContext";
import { getUserDetail } from "@/utils/get";
import { updateMyProfile } from "@/utils/auth/auth";

interface EditForm {
  userName: string;
  password: string;
  confirmPassword: string;
  email: string;
  city: string;
  phoneNum: string;
}

export default function EditProfilePage() {
  const [form, setForm] = useState<EditForm>({
    userName: "",
    password: "",
    confirmPassword: "",
    email: "",
    city: "",
    phoneNum: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.length >= 11) input = input.slice(0, 11);
    const formatted = input.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    setForm({ ...form, phoneNum: formatted });
  };

  const fetchUserInfo = async () => {
    try {
      const res = await getUserDetail();
      if (res) {
        setForm((prev) => ({
          ...prev,
          userName: res.userName || "",
          email: res.email || "",
          city: res.city || "",
          phoneNum: res.phoneNum || "",
        }));
      }
    } catch (err) {
      console.error(err);
      setError("회원 정보를 불러오는데 실패했습니다.");
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    setError("");

    // 비밀번호 일치 검사
    if (form.password && form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...updateData } = form;
      await updateMyProfile(updateData); // confirmPassword는 제거하고 전달
      alert("정보가 수정되었습니다.");
      router.push("/myPage");
    } catch (err) {
      console.error(err);
      setError("수정 실패. 입력 값을 다시 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="max-w-screen-lg min-h-screen p-6 pt-10 sm:pt-20 sm:w-[400px] mx-auto">
      <Card className="p-6 space-y-3 shadow-2xl">
        <h2 className="text-xl font-bold text-center">회원 정보 수정</h2>

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
          name="confirmPassword"
          type="password"
          placeholder="비밀번호 확인"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <Select
          value={form.city}
          onValueChange={(val) => setForm({ ...form, city: val })}
        >
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

        <Button className="w-full" onClick={updateProfile} disabled={loading}>
          {loading ? "저장 중..." : "정보 수정"}
        </Button>

        {error && <p className="text-sm text-center text-red-500">{error}</p>}
      </Card>
    </div>
  );
}
