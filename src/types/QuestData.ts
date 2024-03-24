interface Location {
  lng: number;
  lat: number;
}

interface Place {
  placeId: string;
  buildingId: string;
  name: string;
  location: Location;
  isConquered: boolean;
  isClosed: boolean;
  isNotAccessible: boolean;
}

interface Building {
  buildingId: string;
  name: string;
  location: Location;
  places: Place[];
}

export interface QuestData {
  id: string;
  name: string;
  buildings: Building[];
}