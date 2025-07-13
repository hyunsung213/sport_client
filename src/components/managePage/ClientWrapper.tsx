// components/managePage/ClientWrapper.tsx
"use client";

import Header from "@/components/managePage/Header";
import { PlaceProvider } from "@/context/PlaceContext";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlaceProvider>
      <div>
        <Header />
        <div>{children}</div>
      </div>
    </PlaceProvider>
  );
}
