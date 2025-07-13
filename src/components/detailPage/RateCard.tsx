"use client";

import { LevelRanges, Rate } from "@/utils/interface/rate";
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
  const getLevelFromRate = (rate: number | null) => {
    const safeRate = rate ?? 0;
    const found = LevelRanges.find(
      (range) => safeRate >= range.min && safeRate <= range.max
    );
    return found ? found.level : "알 수 없음";
  };

  const countUsersByLevel = (users: UserDetail[]) => {
    const counts: Record<string, number> = {};

    for (const user of users) {
      const level = getLevelFromRate(user.Rate?.rateValue ?? 0);
      counts[level] = (counts[level] || 0) + 1;
    }

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
