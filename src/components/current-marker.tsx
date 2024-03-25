"use client"
// src/components/Marker.tsx
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface MarkerProps {
  map: mapboxgl.Map;
  position: [number, number];
}

const CurrentMarker: React.FC<MarkerProps> = ({ map, position }) => {
  const markerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!markerRef.current) return;
    const el = markerRef.current

    // Add marker to map
    const marker = new mapboxgl.Marker(el)
      .setLngLat(position)
      .addTo(map);

    return () => {
      marker.remove();
    };
  }, [map, position, markerRef]);

  return (
    <div className="bg-red-600 size-3 rounded-full z-10"
    ref={markerRef}></div>
  )
};

export default CurrentMarker;