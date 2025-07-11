import ClientWrapper from "@/components/managePage/ClientWrapper";
import { ReactNode } from "react";

// RootLayout.tsx (서버 컴포넌트)
export default function ManageLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="ko">
      <div>
        <ClientWrapper>{children}</ClientWrapper>
      </div>
    </div>
  );
}
