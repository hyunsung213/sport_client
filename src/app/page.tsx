"use client";

import DateSelector from "@/components/mainPage/DateSeletor";
import GameCard from "@/components/mainPage/GameCard";
import GameList from "@/components/mainPage/GameList";
import { useState } from "react";

export default function Home() {
  const [selectDate, setSelectDate] = useState<string>("");

  return (
    <div className="relative h-screen">
      <div className="relative z-20 flex items-center justify-center ">
        <GameCard />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-1/2">
        <GameList />
      </div>
    </div>
  );
}
