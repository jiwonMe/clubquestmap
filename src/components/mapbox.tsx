// src/components/MapComponent.tsx
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapBoxLanguage from '@mapbox/mapbox-gl-language';
import Marker from "./marker";

import 'mapbox-gl/dist/mapbox-gl.css'

let singletonMapInstance: mapboxgl.Map | null = null;

interface MapComponentProps {
  centerPosition: { lng: number; lat: number };
  zoomLevel?: number;
  markerPositions?: [number, number][]; // Optional marker position prop
}

const MapComponent: React.FC<MapComponentProps> = ({ zoomLevel, centerPosition, markerPositions }) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN || "";

    if (mapContainer.current && !singletonMapInstance) {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [centerPosition.lng, centerPosition.lat],
        zoom: zoomLevel || 15,
        maxZoom: 20,
      });

      const language = new MapBoxLanguage();
      newMap.addControl(language);

      singletonMapInstance = newMap;
    } else if (mapContainer.current && singletonMapInstance) {
      // Update the existing map instance's center and zoom if needed
      singletonMapInstance.setCenter([centerPosition.lng, centerPosition.lat]);
      singletonMapInstance.setZoom(zoomLevel || 15);
    }

    // Clean up on unmount
    return () => {
      // Do not remove the map instance as it is a singleton
    };
  }, []);

  return (
    <div
      className="w-full flex-grow"
      ref={mapContainer}
      style={{ width: "100%" }}
    >
      {markerPositions && singletonMapInstance && (
        markerPositions.map((position, index) => (
          <Marker key={index}
            map={singletonMapInstance as mapboxgl.Map}
            position={position}
          />
        ))
      )}
    </div>
  );
};

export default MapComponent;