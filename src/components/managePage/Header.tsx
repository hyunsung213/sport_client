"use client";

import { getPlaceDetail } from "@/utils/get";
import { PlaceDetailWithGames } from "@/utils/interface/place";
import clsx from "clsx";
import { BarChart2, Calendar, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LuImageUp } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import { usePlaces } from "@/context/PlaceContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MdAddLocation } from "react-icons/md";

const navItems = [
  {
    label: "Calendar",
    icon: <Calendar size={24} />,
    href: "/managePage/calendar",
  },
  {
    label: "Edit",
    icon: <FaRegEdit size={24} />,
    href: "/managePage/edit",
  },
  {
    label: "Images",
    icon: <LuImageUp size={24} />,
    href: "/managePage/updateImages",
  },
  {
    label: "Add",
    icon: <MdAddLocation size={24} />,
    href: "/managePage/addPlace",
  },
];

export default function Header() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { places, selectedPlaceId, setSelectedPlaceId } = usePlaces();
  const pathname = usePathname();

  const selectedPlace = places.find(
    (place) => place.placeId.toString() === selectedPlaceId
  );

  return (
    <div className="flex flex-row items-center w-full px-4 pt-5 pb-5 space-x-8">
      <h2 className="text-3xl font-extrabold text-start">
        {selectedPlace?.placeName || "장소 관리"}
      </h2>
      <Select
        value={selectedPlaceId}
        onValueChange={(value) => setSelectedPlaceId(value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="장소를 선택하세요" />
        </SelectTrigger>
        <SelectContent>
          {places.map((place) => (
            <SelectItem key={place.placeId} value={place.placeId.toString()}>
              {place.placeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* 네비게이션 메뉴는 오른쪽으로 밀어냄 */}
      <div className="flex items-center ml-auto space-x-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex items-center space-x-2 text-sm transition-colors duration-200",
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-500"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
