"use client"
// src/components/Marker.tsx
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Place } from '@/types/QuestData';

interface MarkerProps {
  map: mapboxgl.Map;
  position: [number, number];
  metadata?: {
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
    el.className = allPlacesConquered ? "bg-white size-3 rounded-full z-0 border border-blue-600" : "bg-blue-600 size-3 rounded-full z-10";

    // Add marker to map
    const marker = new mapboxgl.Marker(el)
      .setLngLat(position)
      .addTo(map);

    return () => {
      marker.remove();
    };
  }, [map, position, metadata, markerRef]);

  return (
    <div ref={markerRef}></div>
  )
};

export default Marker;