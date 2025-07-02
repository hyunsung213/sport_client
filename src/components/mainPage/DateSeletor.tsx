"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";

export default function DateSelector({
  setSelectDate,
}: {
  setSelectDate: (date: string) => void;
}) {
  const today = new Date();
  const [date, setDate] = useState(today);

  return (
    <Tabs defaultValue="" className="w-400px">
      <TabsList>
        {[...Array(9)].map((_, i) => {
          const newDate = new Date(date);
          newDate.setDate(date.getDate() + i);
          const days = ["일", "월", "화", "수", "목", "금", "토"];
          const dayOfWeek = days[newDate.getDay()];
          const formattedDate = `${String(newDate.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(newDate.getDate()).padStart(2, "0")} (${dayOfWeek})`;

          return (
            <TabsTrigger
              key={formattedDate}
              value={formattedDate}
              onClick={() => setSelectDate(formattedDate)}
            >
              {formattedDate}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {[...Array(9)].map((_, i) => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + i);
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        const dayOfWeek = days[newDate.getDay()];
        const formattedDate = `${String(newDate.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(newDate.getDate()).padStart(2, "0")} (${dayOfWeek})`;

        return (
          <TabsContent key={formattedDate} value={formattedDate}>
            {/* 필요한 콘텐츠 넣기 */}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
