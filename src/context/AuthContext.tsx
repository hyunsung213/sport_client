"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthUser } from "@/utils/interface/user";
import apiClient from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/auth/me");
      const userData = res.data;
      console.log(userData);
      setUser({ ...userData, id: userData.userId }); // 필요 시 매핑
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ 로그인 상태 확인 및 보호 라우팅
  useEffect(() => {
    const isAllowedWithoutLogin =
      pathname === "/" || pathname.startsWith("/game");

    if (!loading && !user && !isAllowedWithoutLogin) {
      router.replace("/auth/login"); // 로그인 페이지로 이동
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider
      value={{ user, loading, refetchUser: fetchUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
