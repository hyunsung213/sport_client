// context/SessionContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "@/utils/get";
import { Session } from "@/utils/interface/user";

interface SessionContextType {
  session: Session | null;
  loading: boolean;
  refetchSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    setLoading(true);
    try {
      const res = await getSession();
      setSession(res || null);
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{ session, loading, refetchSession: fetchSession }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
