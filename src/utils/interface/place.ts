import { Game } from "./game";
import { Note } from "./note";
import { Option } from "./option";
import { Photo } from "./photo";
import { UserDetail } from "./user";

export interface Place {
  placeId: number;
  placeName: string;
  location: string;
  managerId: string;
}

export interface PlaceDetail {
  placeId: number;
  placeName: string;
  location: string;
  managerId: string;
  User: UserDetail;
  Option: Option;
  Note: Note;
  Photos: Photo[];
}

export interface PlaceDetailWithGames {
  placeId: number;
  placeName: string;
  location: string;
  managerId: string;
  User: UserDetail;
  Option: Option;
  Note: Note;
  Photos: Photo[];
  Games: Game[];
}
