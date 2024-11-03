interface Location {
  lng: number; // 경도
  lat: number; // 위도
}

export interface Place {
  placeId: string; // 장소 ID
  buildingId: string; // 건물 ID
  name: string; // 장소 이름
  location: Location; // 장소 위치
  isConquered: boolean; // 퀘스트 완료 여부
  isClosed: boolean; // 폐업 여부
  isNotAccessible: boolean; // 접근 불가 여부
}

export interface Building {
  buildingId: string; // 건물 ID
  name: string; // 건물 이름
  location: Location; // 건물 위치
  places: Place[]; // 장소 목록
}

export interface QuestData {
  id: string;
  name: string; // 퀘스트 이름
  buildings: Building[]; // 건물 목록
}