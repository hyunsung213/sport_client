import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function HourMinutePicker({
  onTimeChange,
}: {
  onTimeChange: (time: string) => void;
}) {
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");

  const handleTimeChange = (newHour: string, newMinute: string) => {
    setHour(newHour);
    setMinute(newMinute);
    if (newHour && newMinute) {
      onTimeChange(`${newHour}:${newMinute}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10">
      {/* 시간 선택 */}
      <div className="space-y-1">
        <Label>시간 (Hour)</Label>
        <Select
          onValueChange={(val) => handleTimeChange(val, minute)}
          value={hour}
        >
          <SelectTrigger>
            <SelectValue placeholder="시간 선택" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }, (_, i) => (
              <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                {i.toString().padStart(2, "0")}시
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 분 선택 */}
      <div className="space-y-1">
        <Label>분 (Minute)</Label>
        <Select
          onValueChange={(val) => handleTimeChange(hour, val)}
          value={minute}
        >
          <SelectTrigger>
            <SelectValue placeholder="분 선택" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 6 }, (_, i) => {
              const val = (i * 10).toString().padStart(2, "0");
              return (
                <SelectItem key={val} value={val}>
                  {val}분
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* 선택된 시간 항상 표시 */}
      <div className="flex items-center justify-center mt-2">
        <span className="px-4 py-2 text-base font-semibold">
          선택된 시간: {hour || "00"}:{minute || "00"}
        </span>
      </div>
    </div>
  );
}
