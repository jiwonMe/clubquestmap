import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface UseNMapCurrentMarkerProps {
  map: naver.maps.Map | null;
  position: [number, number];  // [lng, lat]
}

export function useNMapCurrentMarker({ map, position }: UseNMapCurrentMarkerProps) {
  const markerRef = useRef<naver.maps.Marker | null>(null);

  useEffect(() => {
    if (!map || !position) return;

    console.log('position', position);

    // Create HTML element for marker
    const el = document.createElement('div');
    el.className = cn(
      /* Marker style */
      "size-5 rounded-full text-gray-100 text-center text-xs content-center flex justify-center items-center border font-medium"
    );
    el.id = 'current-marker';

    // Create Naver marker
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(position[1], position[0]),
      map: map,
      icon: {
        content: el,
        size: new naver.maps.Size(20, 20),
        anchor: new naver.maps.Point(10, 10),
      }
    });

    markerRef.current = marker;

    // Cleanup marker
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [map, position]);
} 