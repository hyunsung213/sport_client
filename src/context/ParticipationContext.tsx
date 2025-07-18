"use client";

import { getMyParticipation } from "@/utils/get";
import { ParticipationWithGame } from "@/utils/interface/participation";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ParticipationContext = createContext<ParticipationWithGame[]>([]);

export const ParticipationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, loading, refetchUser } = useAuth();
  const [participationGames, setParticipationGames] = useState<
    ParticipationWithGame[]
  >([]);

  useEffect(() => {
    const fetchConfirmedGames = async () => {
      if (!loading && user) {
        const res = await getMyParticipation();
        setParticipationGames(res ?? []);
      }
    };

    fetchConfirmedGames();
  }, [user, loading]);

  return (
    <ParticipationContext.Provider value={participationGames}>
      {children}
    </ParticipationContext.Provider>
  );
};

export const useParticipatedGames = () => useContext(ParticipationContext);
