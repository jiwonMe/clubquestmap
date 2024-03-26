"use client"
// src/components/Marker.tsx
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Building, Place } from '@/types/QuestData';

interface MarkerProps {
  map: mapboxgl.Map;
  position: [number, number];
  metadata?: {
    building: Building;
    places: Place[];
  }
}

const Marker: React.FC<MarkerProps> = ({ map, position, metadata }) => {
  const markerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!markerRef.current) return;
    const el = markerRef.current

    // Set marker color based on conquest status
    // Check if all places are conquered and set the marker color accordingly
    const allPlacesConquered = metadata?.places?.every(place => place.isConquered) ?? false;
    el.className = allPlacesConquered ? "bg-gray-400 size-4 rounded-full z-0" : "bg-blue-600 size-4 rounded-full z-10";

    el.className = el.className + " text-gray-100 text-center text-xs content-center flex justify-center items-center";

    // const size = (metadata?.places?.length ?? 0) * 10;

    // el.style.width = `${size}px`;
    // el.style.height = `${size}px`;

    // Add marker to map
    const marker = new mapboxgl.Marker(el)
      .setLngLat(position)
      .addTo(map);

    return () => {
      marker.remove();
    };
  }, [map, position, metadata, markerRef]);

  const getLeadingNumber = (str: string) => {
    const match = str.match(/\d+/);
    return match ? match[0] : '';
  }

  return (
    <div ref={markerRef}
      onClick={() => {
        console.log(metadata);
      }}
    >
      {getLeadingNumber(metadata?.building.name || '')}
    </div>
  )
};

export default Marker;