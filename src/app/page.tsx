"use client";

import DateSelector from "@/components/mainPage/DateSeletor";
import GameCard from "@/components/mainPage/GameCard";
import GameList from "@/components/mainPage/GameList";
import { useState } from "react";

export default function Home() {
  const [selectDate, setSelectDate] = useState<string>("");

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <GameCard />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <DateSelector setSelectDate={setSelectDate} />
        <GameList selectDate={selectDate} />
      </div>
    </div>
  );
}
