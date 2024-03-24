"use client"
// src/components/MapComponent.tsx
import React, { useEffect, useRef } from "react";
import mapboxgl, { GeoJSONSourceRaw } from "mapbox-gl";
import MapBoxLanguage from '@mapbox/mapbox-gl-language';

interface MovingObject {
  id: number;
  name: string;
  coordinates: number[];
}

interface MapComponentProps {
  movingObjects: MovingObject[];
  centerPosition: { lng: number; lat: number };
  zoomLevel?: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ movingObjects, zoomLevel, centerPosition }) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN || "";

    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [centerPosition.lng, centerPosition.lat],
        zoom: zoomLevel || 15,
        maxZoom: 20,
      });

      // setTimeout(() => {
        // map language
        // }, 1000);

      // Add zoom controls
      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      const language = new MapBoxLanguage();
      map.addControl(language);

      // Add your custom markers and lines here

      // Clean up on unmount
      return () => map.remove();
    }
  }, [centerPosition]);

  return (
    <div
      ref={mapContainer}
      style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
    />
  );
};

export default MapComponent;
