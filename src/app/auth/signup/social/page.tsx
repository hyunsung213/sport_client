"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpForSocial } from "@/utils/auth/auth";
import { Switch } from "@/components/ui/switch";
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
import { useSession } from "@/context/SessionContext";

export default function SocialSignupPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [city, setCity] = useState("");
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(false);
  const { session, refetchSession } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signUpForSocial({
        userName,
        phoneNum,
        city,
        isManager,
      });

      if (res?.message === "추가 정보 저장 완료") {
        await refetchSession();
        router.push("/");
      } else {
        alert("저장 실패: 서버 응답이 올바르지 않습니다.");
      }
    } catch (err) {
      console.error("추가 정보 저장 실패:", err);
      alert("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-12 space-y-4 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-semibold text-center">추가 정보 입력</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">이름</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">전화번호</label>
          <input
            type="tel"
            value={phoneNum}
            onChange={(e) => setPhoneNum(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">지역구 선택</label>
          <Select onValueChange={(val) => setCity(val)}>
            <SelectTrigger className="h-8 text-sm w-[180px]">
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
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <Switch
              checked={isManager}
              onCheckedChange={(val) => setIsManager(val)}
            />
            장소 관리자
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {loading ? "저장 중..." : "저장하고 시작하기"}
        </button>
      </form>
    </div>
  );
}
