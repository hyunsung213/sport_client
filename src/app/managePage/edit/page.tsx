"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlaces } from "@/context/PlaceContext";
import { useEffect } from "react";
import { PlaceDetail } from "@/utils/interface/place";
import { updatePlaceDetail } from "@/utils/update";
import AddressInput from "@/components/managePage/AddressInput";
import { Switch } from "@/components/ui/switch";

export default function EditPlacePage() {
  const { places, selectedPlaceId, setSelectedPlaceId } = usePlaces();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting, isDirty },
  } = useForm<PlaceDetail>();

  const locationValue = watch("location");

  const selectedPlace = places.find(
    (place) => place.placeId.toString() === selectedPlaceId
  );

  useEffect(() => {
    if (selectedPlace) {
      reset(selectedPlace);
    }
  }, [selectedPlace, reset]);

  const onSubmit = async (data: PlaceDetail) => {
    console.log("data:", data);
    try {
      await updatePlaceDetail(data);
      alert("수정이 완료되었습니다.");
    } catch (err) {
      alert("수정에 실패했습니다.");
      console.error(err);
    }
  };

  if (!selectedPlace)
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-lg text-pastel-blue">
          장소 데이터를 불러오는 중입니다...
        </span>
      </div>
    );

  return (
    <div className="p-10 mx-auto mt-12 bg-white border shadow-lg w-4xl border-pastel-border rounded-3xl">
      <h1 className="mb-10 text-3xl font-extrabold text-center text-pastel-blue">
        장소 정보 수정
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label
              htmlFor="placeName"
              className="font-semibold text-pastel-blue"
            >
              장소 이름
            </Label>
            <Input
              id="placeName"
              {...register("placeName")}
              className="mt-2 bg-white border border-gray-300 focus:ring-pastel-blue focus:border-pastel-blue"
            />
          </div>

          <AddressInput
            initialValue={watch("location") || ""}
            onCombinedAddressChange={(combinedAddress) =>
              setValue("location", combinedAddress)
            }
          />
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-700">편의시설</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {(
              [
                {
                  id: "isShuttlecock",
                  label: "셔틀콕",
                  name: "Option.isShuttlecock",
                },
                { id: "isToilet", label: "화장실", name: "Option.isToilet" },
                { id: "isIndoor", label: "실내", name: "Option.isIndoor" },
                {
                  id: "isParkingLot",
                  label: "주차장",
                  name: "Option.isParkingLot",
                },
                {
                  id: "isShowerRoom",
                  label: "샤워실",
                  name: "Option.isShowerRoom",
                },
              ] as {
                id: string;
                label: string;
                name:
                  | "Option.isShuttlecock"
                  | "Option.isToilet"
                  | "Option.isIndoor"
                  | "Option.isParkingLot"
                  | "Option.isShowerRoom";
              }[]
            ).map(({ id, label, name }) => (
              <div key={id} className="flex items-center space-x-2">
                <Switch id={id} {...register(name)} className="h-5 " />
                <Label htmlFor={id} className="text-sm text-gray-700">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label
              htmlFor="direction"
              className="font-semibold text-pastel-blue"
            >
              오시는 길
            </Label>
            <Input
              id="direction"
              {...register("Note.direction")}
              className="mt-2 bg-white border border-gray-300 focus:ring-pastel-blue focus:border-pastel-blue"
            />
          </div>

          <div>
            <Label htmlFor="parking" className="font-semibold text-pastel-blue">
              주차 방식
            </Label>
            <Input
              id="parking"
              {...register("Note.parking")}
              className="mt-2 bg-white border border-gray-300 focus:ring-pastel-blue focus:border-pastel-blue"
            />
          </div>

          <div>
            <Label htmlFor="smoking" className="font-semibold text-pastel-blue">
              흡연
            </Label>
            <Input
              id="smoking"
              {...register("Note.smoking")}
              className="mt-2 bg-white border border-gray-300 focus:ring-pastel-blue focus:border-pastel-blue"
            />
          </div>

          <div>
            <Label htmlFor="etc" className="font-semibold text-pastel-blue">
              그 외
            </Label>
            <Input
              id="etc"
              {...register("Note.etc")}
              className="mt-2 bg-white border border-gray-300 focus:ring-pastel-blue focus:border-pastel-blue"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-full py-3 mt-4 text-lg font-bold rounded-xl"
        >
          저장하기
        </Button>
      </form>
    </div>
  );
}
