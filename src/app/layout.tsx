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
    <html lang="ko" className="overflow-x-hidden">
      <AuthProvider>
        <ParticipationProvider>
          <body className="flex flex-col w-full min-h-screen overflow-x-hidden max-w-screen">
            <Header />
            <main className="w-full pt-16 overflow-x-hidden sm:pt-0">
              {children}
            </main>
            <div className="hidden sm:block">
              <Footer />
            </div>
          </body>
        </ParticipationProvider>
      </AuthProvider>
    </html>
  );
}
