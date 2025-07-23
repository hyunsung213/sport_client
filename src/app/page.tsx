"use client";

import GameCard from "@/components/mainPage/GameCard";
import GameList from "@/components/mainPage/GameList";
import { fontColor } from "@/styles/color";
import { useState } from "react";

export default function Home() {
  const [selectDate, setSelectDate] = useState<string>("");

  return (
    <div className="relative flex flex-col w-full min-h-screen px-4 overflow-x-hidden">
      <div className="relative z-20 flex items-center justify-center w-full">
        <GameCard />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full pb-20 ">
        <GameList />
      </div>
    </div>
  );
}
