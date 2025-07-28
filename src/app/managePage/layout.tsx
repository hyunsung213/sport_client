import ClientWrapper from "@/components/managePage/ClientWrapper";
import { ReactNode } from "react";

// RootLayout.tsx (서버 컴포넌트)
export default function ManageLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="ko">
      <div className="max-w-screen-lg min-h-screen pt-10 mx-auto">
        <ClientWrapper>{children}</ClientWrapper>
      </div>
    </div>
  );
}
