import { Option } from "./option";
import { Photo } from "./photo";
import { User } from "./user";

export interface Place {
  placeId: number;
  placeName: string;
  location: string;
  mangerId: string;
}

export interface PlaceDetail {
  placeId: number;
  placeName: string;
  location: string;
  mangerId: string;
  user: User;
  option: Option;
  Photos: Photo[];
}
