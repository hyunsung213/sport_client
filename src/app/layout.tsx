import "./globals.css";
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ParticipationProvider } from "@/context/ParticipationContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "스포츠 플랫폼",
  description: "Next.js 프로젝트",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <AuthProvider>
        <ParticipationProvider>
          <body className="flex flex-col items-center w-full min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </body>
        </ParticipationProvider>
      </AuthProvider>
    </html>
  );
}
