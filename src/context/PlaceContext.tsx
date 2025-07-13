"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getPlaceDetail } from "@/utils/get";
import { PlaceDetailWithGames } from "@/utils/interface/place";

interface PlaceContextType {
  places: PlaceDetailWithGames[];
  loading: boolean;
  error: string;
  selectedPlaceId: string;
  setSelectedPlaceId: (id: string) => void;
}

const PlaceContext = createContext<PlaceContextType | undefined>(undefined);

export const PlaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [places, setPlaces] = useState<PlaceDetailWithGames[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const res = await getPlaceDetail();
        setPlaces(res || []);
        console.log("장소 정보:", res);
      } catch {
        setError("장소를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // ✅ places가 바뀌면 selectedPlaceId 자동 설정
  useEffect(() => {
    if (places.length > 0 && !selectedPlaceId) {
      setSelectedPlaceId(places[0].placeId.toString());
    }
  }, [places, selectedPlaceId]);

  if (!mounted) return null;

  return (
    <PlaceContext.Provider
      value={{ places, loading, error, selectedPlaceId, setSelectedPlaceId }}
    >
      {children}
    </PlaceContext.Provider>
  );
};

export const usePlaces = () => {
  const ctx = useContext(PlaceContext);
  if (!ctx) throw new Error("usePlaces must be used inside PlaceProvider");
  return ctx;
};
