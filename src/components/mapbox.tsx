"use client"
// src/components/MapComponent.tsx
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapBoxLanguage from '@mapbox/mapbox-gl-language';
import Marker from "./marker";

import 'mapbox-gl/dist/mapbox-gl.css'
import { Building, QuestData } from "@/types/QuestData";
import CurrentMarker from "./current-marker";
import { getLeadingNumber } from "@/utils/getLeadingNumber";
import { useAppStore } from "@/store/appStore";

let singletonMapInstance: mapboxgl.Map | null = null;

interface MapComponentProps {
  centerPosition: { lng: number; lat: number };
  zoomLevel?: number;
  markerPositions?: [number, number][];
  questData: QuestData;
  currentLocation: [number, number];
}

const MapComponent: React.FC<MapComponentProps> = ({ zoomLevel, centerPosition, questData, currentLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  const { setSelectedBuildingId } = useAppStore();

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
      {
        singletonMapInstance && (questData && 
        questData.buildings.map((building, index) => (
          <Marker
            key={index}
            map={singletonMapInstance as mapboxgl.Map}
            position={[building.location.lng, building.location.lat]}
            metadata={{
              building: building,
              places: building.places
            }}
            onClick={() => {
              setSelectedBuildingId(building.buildingId);
            }}
          />
        )))
      }
      {
        singletonMapInstance && (
          <CurrentMarker
            map={singletonMapInstance as mapboxgl.Map}
            position={currentLocation}
          />
        )
      }
    </div>
  );
};

export default MapComponent;