"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import AddressInput from "@/components/managePage/AddressInput";
import { Switch } from "@/components/ui/switch";
import { postPlaceDetail } from "@/utils/post"; // POST 요청 함수

import { PlaceDetail } from "@/utils/interface/place";
import { useRef } from "react";

const optionFields = [
  { id: "isShuttlecock", label: "셔틀콕", name: "Option.isShuttlecock" },
  { id: "isToilet", label: "화장실", name: "Option.isToilet" },
  { id: "isIndoor", label: "실내", name: "Option.isIndoor" },
  { id: "isParkingLot", label: "주차장", name: "Option.isParkingLot" },
  { id: "isShowerRoom", label: "샤워실", name: "Option.isShowerRoom" },
] as const;

export default function CreatePlacePage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isSubmitting },
  } = useForm<PlaceDetail>();

  const locationValue = useRef(watch("location"));

  const onSubmit = async (data: PlaceDetail) => {
    try {
      await postPlaceDetail(data);
      alert("장소가 등록되었습니다!");
      router.push("/managePage/calendar");
    } catch (err) {
      console.error("등록 실패:", err);
      alert("장소 등록에 실패했습니다.");
    }
  };

  return (
    <div className="p-10 mx-auto mt-12 bg-white border shadow-lg w-4xl border-pastel-border rounded-3xl">
      <h1 className="mb-10 text-3xl font-extrabold text-center text-pastel-blue">
        새로운 장소 등록
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label className="font-semibold text-pastel-blue">장소 이름</Label>
            <Input {...register("placeName")} required />
          </div>
          <AddressInput
            initialValue={locationValue.current || ""}
            onCombinedAddressChange={(addr) => setValue("location", addr)}
          />
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-700">편의시설</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {optionFields.map(({ id, label, name }) => (
              <div key={id} className="flex items-center space-x-2">
                <Controller
                  name={name}
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Switch
                      id={id}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-5"
                    />
                  )}
                />
                <Label htmlFor={id} className="text-sm text-gray-700">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label className="font-semibold text-pastel-blue">오시는 길</Label>
            <Input {...register("Note.direction")} />
          </div>
          <div>
            <Label className="font-semibold text-pastel-blue">주차 방식</Label>
            <Input {...register("Note.parking")} />
          </div>
          <div>
            <Label className="font-semibold text-pastel-blue">흡연</Label>
            <Input {...register("Note.smoking")} />
          </div>
          <div>
            <Label className="font-semibold text-pastel-blue">기타</Label>
            <Input {...register("Note.etc")} />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 mt-4 text-lg font-bold rounded-xl"
        >
          등록하기
        </Button>
      </form>
    </div>
  );
}
