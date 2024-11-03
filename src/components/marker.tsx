"use client"
// src/components/Marker.tsx
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Building, Place } from '@/types/QuestData';
import { getLeadingNumber } from '@/utils/getLeadingNumber';
import { cn } from '@/lib/utils';

interface MarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  map: mapboxgl.Map;
  position: [number, number];
  metadata?: {
    building: Building;
    places: Place[];
  }
}

const Marker: React.FC<MarkerProps> = ({ map, position, metadata, ...props }) => {
  const markerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!markerRef.current) return;
    const el = markerRef.current;

    // Determine marker class based on conquest status
    const markerClass = getMarkerClass(metadata);
    el.className = markerClass;

    // Add marker to map
    const marker = createMapboxMarker(el, position, map);

    return () => {
      marker.remove();
    };
  }, [map, position, metadata, markerRef]);

  return (
    <div ref={markerRef} {...props}>
      {getLeadingNumber(metadata?.building.name || '')}
    </div>
  );
};

// Function to determine marker class based on conquest status
function getMarkerClass(metadata?: { places: Place[] }): string {
  const allPlacesConquered = metadata?.places?.every(place => place.isConquered || place.isClosed || place.isNotAccessible) ?? false;
  const conditionClass = allPlacesConquered ? cn("bg-gray-300 z-0 border-gray-600 text-gray-600") : cn("bg-blue-600 z-10 border-gray-800");
  return cn("size-5 rounded-full text-gray-100 text-center text-xs content-center flex justify-center items-center border font-medium", conditionClass);
}

// Function to create a Mapbox marker
function createMapboxMarker(el: HTMLDivElement, position: [number, number], map: mapboxgl.Map) {
  return new mapboxgl.Marker(el)
    .setLngLat(position)
    .addTo(map);
}

export default Marker;