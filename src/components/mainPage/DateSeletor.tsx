"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DateSelector({
  setSelectDate,
}: {
  setSelectDate: (date: string) => void;
}) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string>("");

  const daysKor = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div
      className="flex items-center justify-center w-full gap-10 px-4 py-2 rounded-full"
      style={{ backgroundColor: "#e5f3fb" }}
    >
      {Array.from({ length: 9 }, (_, i) => {
        const newDate = new Date(today);
        newDate.setDate(today.getDate() + i);

        const day = daysKor[newDate.getDay()];
        const dateNum = newDate.getDate();
        const formattedDate = `${newDate.getFullYear()}-${String(
          newDate.getMonth() + 1
        ).padStart(2, "0")}-${String(dateNum).padStart(2, "0")}`;

        const isSelected = selectedDate === formattedDate;
        const isSaturday = newDate.getDay() === 6;
        const isSunday = newDate.getDay() === 0;

        return (
          <div key={i} className="flex flex-col items-center w-12">
            <Button
              variant={isSelected ? "default" : "ghost"}
              className={`w-12 h-12 rounded-full flex flex-col items-center justify-center ${
                isSaturday ? "text-blue-500" : isSunday ? "text-red-500" : ""
              }`}
              style={
                isSelected ? { backgroundColor: "#b6e9f9", color: "#000" } : {}
              }
              onClick={() => {
                setSelectedDate(formattedDate); // 내부 상태 업데이트
                setSelectDate(formattedDate); // 상위로 값 전달
              }}
            >
              <span className="font-bold">{dateNum}</span>
              <span className="text-xs">{day}</span>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
