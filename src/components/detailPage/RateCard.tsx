"use client";

import { getLevelFromRate, LevelRanges, Rate } from "@/utils/interface/rate";
import { User, UserDetail } from "@/utils/interface/user";
import { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function RateCard({ users }: { users: UserDetail[] }) {
  const countUsersByLevel = (users: UserDetail[]) => {
    const counts: Record<string, number> = {};

    for (const user of users) {
      const level = getLevelFromRate(user.Rate?.rateValue ?? 0);
      counts[level] = (counts[level] || 0) + 1;
    }
    console.log(counts);
    return counts;
  };

  const generateRadarDataFromUsers = (users: UserDetail[]) => {
    const levelCounts = countUsersByLevel(users);

    return LevelRanges.map(({ level }) => ({
      level,
      count: levelCounts[level] || 0,
    }));
  };

  const radarData = generateRadarDataFromUsers(users);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="level" />
          <PolarRadiusAxis allowDecimals={false} />
          <Radar
            name="조별 인원 수"
            dataKey="count"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.5}
          />
          <Tooltip formatter={(value: number) => `${value}명`} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
