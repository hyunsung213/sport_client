"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

declare global {
  interface Window {
    daum?: any;
  }
}

export default function AddressInput({
  initialValue = "",
  onCombinedAddressChange,
}: {
  initialValue?: string; // 기존 저장된 주소
  onCombinedAddressChange: (combined: string) => void;
}) {
  const [base, setBase] = useState("");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openPostcode = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert("주소 검색 스크립트가 아직 로드되지 않았습니다.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data: any) {
        const fullAddr = data.address;
        setBase(fullAddr);
        onCombinedAddressChange(`${fullAddr}/${detail}`);
      },
    }).open();
  };

  // 상세 주소가 바뀌면 전체 주소 갱신
  useEffect(() => {
    if (base) {
      onCombinedAddressChange(`${base}/${detail}`);
    }
  }, [detail]);

  useEffect(() => {
    if (initialValue) {
      const [basePart, detailPart] = initialValue.split("/");
      setBase(basePart || "");
      setDetail(detailPart || "");
    }
  }, [initialValue]);

  return (
    <div className="w-full">
      <Label htmlFor="location" className="font-semibold text-pastel-blue">
        주소
      </Label>
      <div className="flex flex-col gap-2">
        <Input id="location" value={base} readOnly className="bg-gray-100" />
        <Input
          id="detailAddress"
          placeholder="상세 주소"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
        <Button
          type="button"
          onClick={openPostcode}
          className="text-sm text-white min-w-[100px]"
        >
          주소 찾기
        </Button>
      </div>
    </div>
  );
}
