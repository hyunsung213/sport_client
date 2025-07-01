import "./globals.css";
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "스포츠 플랫폼",
  description: "Next.js 프로젝트",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex flex-col items-center justify-center min-h-screen">
        <Header />
        <main className="flex items-center justify-center w-full p-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
