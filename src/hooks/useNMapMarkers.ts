import { useEffect, useRef } from 'react';
import { Building, Place, QuestData } from '@/types/QuestData';
import { getLeadingNumber } from '@/utils/getLeadingNumber';
import { cn } from '@/lib/utils';

interface MarkerMetadata {
  building?: Building;
  places?: Place[];
}

interface UseNMapMarkersProps {
  map: naver.maps.Map | null;
  questData: QuestData | null;
  markerTemplate: (metadata: MarkerMetadata) => {
    innerHTML: string;
    onClick: () => void;
  };
}

export function useNMapMarkers({ map, questData, markerTemplate }: UseNMapMarkersProps) {

  const markersRef = useRef<naver.maps.Marker[]>([]);

  useEffect(() => {
    if (!map || !questData) return;

    console.log(questData);

    // Create markers
    questData.buildings.forEach(building => {
      const el = document.createElement('div');


      el.innerHTML = markerTemplate({ building }).innerHTML;
      el.className = cn(getMarkerClass(building), `building-marker`);
      el.id = `building-${building.buildingId}`;

      if (!building.location.lng || !building.location.lat) return;

      const marker = createNaverMarker(el, [
        building.location.lng,
        building.location.lat
      ], map);

      naver.maps.Event.addListener(marker, 'click', () => {
        markerTemplate({ building }).onClick();
      });

      markersRef.current.push(marker);
    });

    // Cleanup markers
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [map, questData]);
}

// Function to determine marker class based on conquest status
function getMarkerClass(building: Building): string {
  if (!building.places || building.places.length === 0 ) return cn("size-3 rounded-full text-gray-100 text-center text-xs content-center flex justify-center items-center border font-medium bg-red-600 z-10 ring-2 ring-red-600 ring-offset-2");

  const allPlacesConquered = building.places?.every(place => place.isConquered || place.isClosed || place.isNotAccessible) ?? false;
  const conditionClass = allPlacesConquered ? cn("bg-gray-300 z-0 border-gray-600 text-gray-600") : cn("bg-blue-600 z-10 border-gray-800");
  return cn("size-5 rounded-full text-gray-100 text-center text-xs content-center flex justify-center items-center border font-medium", conditionClass);
}

// Function to create a Naver marker
function createNaverMarker(el: HTMLDivElement, position: [number, number], map: naver.maps.Map) {
  return new naver.maps.Marker({
    position: new naver.maps.LatLng(position[1], position[0]),
    map: map,
    icon: {
      content: el,
      size: new naver.maps.Size(20, 20),
      anchor: new naver.maps.Point(10, 10),
    }
  });
} 