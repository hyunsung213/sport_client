import { LiaRestroomSolid } from "react-icons/lia";
import { FaShower } from "react-icons/fa6";
import { GiShuttlecock } from "react-icons/gi";
import { FaParking } from "react-icons/fa";
import { FaHouseUser } from "react-icons/fa";

export const optionList = [
  { icon: LiaRestroomSolid, ename: "isToilet", label: "화장실" },
  { icon: FaShower, ename: "isShowerRoom", label: "샤워실" },
  { icon: GiShuttlecock, ename: "isShuttlecock", label: "셔틀콕" },
  { icon: FaParking, ename: "isParkingLot", label: "주차장" },
  { icon: FaHouseUser, ename: "isIndoor", label: "실내" },
];

export const PlaceBasicOption = {
  isIndoor: false,
  isParkingLot: false,
  isShowerRoom: false,
  isShuttlecock: false,
  isToilet: false,
  optionId: 0,
  placeId: 0,
};
