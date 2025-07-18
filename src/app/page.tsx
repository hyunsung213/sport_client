"use client";

import GameCard from "@/components/mainPage/GameCard";
import GameList from "@/components/mainPage/GameList";
import { fontColor } from "@/styles/color";
import { useState } from "react";

export default function Home() {
  const [selectDate, setSelectDate] = useState<string>("");

  return (
    <div className="relative flex flex-col min-h-screen">
      <h1
        className={`pt-4 pl-15 my-2 text-2xl font-bold text-start ${fontColor.blue}`}
      >
        오늘의 매치
      </h1>
      <div className="relative z-20 flex items-center justify-center ">
        <GameCard />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center pb-20">
        <GameList />
      </div>
    </div>
  );
}
