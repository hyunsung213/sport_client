"use client";

import { getMyParticipation } from "@/utils/get";
import { ParticipationWithGame } from "@/utils/interface/participation";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "./SessionContext"; // ✅ 경로 주의!

const ParticipationContext = createContext<ParticipationWithGame[]>([]);

export const ParticipationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session, loading } = useSession(); // ✅ 현재 로그인 상태 확인
  const [participationGames, setParticipationGames] = useState<
    ParticipationWithGame[]
  >([]);

  useEffect(() => {
    const fetchConfirmedGames = async () => {
      if (!loading && session) {
        const res = await getMyParticipation();
        setParticipationGames(res ?? []);
      }
    };

    fetchConfirmedGames();
  }, [session, loading]); // ✅ session 준비될 때까지 기다림

  return (
    <ParticipationContext.Provider value={participationGames}>
      {children}
    </ParticipationContext.Provider>
  );
};

export const useParticipatedGames = () => useContext(ParticipationContext);
