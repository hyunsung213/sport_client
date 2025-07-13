"use client";

import { useEffect, useState } from "react";
import { PlaceDetail } from "@/utils/interface/place";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePlaces } from "@/context/PlaceContext";
import apiClient from "@/utils/api";
import { Photo } from "@/utils/interface/photo";
import { deletePhoto } from "@/utils/delete";
import { postPhoto } from "@/utils/post";

export default function updateImages() {
  const { places, selectedPlaceId, setSelectedPlaceId } = usePlaces();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  // 사진 URL로 사진 불러오기
  const getPhotoByURL = (photoUrl: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}${photoUrl}`;
  };

  const selectedPlace = places.find(
    (place) => place.placeId.toString() === selectedPlaceId
  );

  useEffect(() => {
    if (selectedPlace?.Photos) {
      setPhotos(selectedPlace.Photos);
    }
  }, [selectedPlace]);

  const handleDelete = (photoId: number) => {
    setPhotos((prev) => prev.filter((photo) => photo.photoId !== photoId));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedPlace?.placeId) {
        alert("장소 정보가 올바르지 않습니다.");
        return;
      }

      const deleteIds =
        selectedPlace?.Photos?.filter(
          (photo) => !photos.find((p) => p.photoId === photo.photoId)
        ).map((p) => p.photoId) || [];

      // 삭제 요청
      await Promise.all(deleteIds.map((id) => deletePhoto(id)));

      // 업로드 요청
      if (newFiles.length > 0) {
        await Promise.all(
          newFiles.map((file) => postPhoto(selectedPlace.placeId, file))
        );
      }

      alert("이미지 변경이 완료되었습니다!");

      // ✅ 새로고침
      window.location.reload(); // 또는 router.refresh() if using Next.js App Router
    } catch (err) {
      console.error("이미지 변경 실패:", err);
      alert("이미지 변경에 실패했습니다.");
    }
  };

  if (!selectedPlace)
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-lg text-pastel-blue">
          장소를 선택해주시기 바랍니다
        </span>
      </div>
    );

  return (
    <div className="p-10 mx-auto mt-12 bg-white border shadow-lg w-4xl border-pastel-border rounded-3xl">
      <h1 className="mb-8 text-2xl font-bold text-center text-pastel-blue">
        장소 이미지 관리
      </h1>

      <div className="mb-6 space-y-4">
        <Label className="block font-semibold text-pastel-blue">
          기존 이미지
        </Label>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {photos.map((photo) => (
            <div key={photo.photoId} className="relative">
              <img
                src={getPhotoByURL(photo.photoUrl)}
                alt={`photo-${photo.photoId}`}
                className="object-cover w-full h-32 border rounded-lg"
              />
              <Button
                type="button"
                onClick={() => handleDelete(photo.photoId)}
                className="absolute px-2 py-1 text-xs text-white bg-red-500 rounded top-1 right-1"
              >
                삭제
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <Label className="block mb-2 font-semibold text-pastel-blue">
          새 이미지 추가
        </Label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full px-3 py-2 text-sm border rounded-lg cursor-pointer border-pastel-border focus:outline-none focus:ring-2 focus:ring-pastel-blue"
          />
          {newFiles.length > 0 && (
            <span className="px-3 py-1 text-xs font-medium rounded-full text-pastel-blue bg-pastel-blue/10">
              {newFiles.length}개 파일 선택됨
            </span>
          )}
        </div>
        {newFiles.length > 0 && (
          <ul className="mt-2 ml-1 text-xs text-gray-500 list-disc list-inside">
            {newFiles.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        className="w-full py-3 mt-4 text-lg font-bold text-white rounded-xl"
      >
        변경 사항 저장
      </Button>
    </div>
  );
}
