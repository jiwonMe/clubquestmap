'use client';

import React, { useEffect, useRef } from 'react';
import { useNMapMarkers } from '@/hooks/useNMapMarkers';
import { Building, Place, QuestData } from '@/types/QuestData';
import { getLeadingNumber } from '@/utils/getLeadingNumber';
import { useAppStore } from '@/store/appStore';
import { useNMapCurrentMarker } from '@/hooks/useNMapCurrentMarker';

interface MapComponentProps {
  zoomLevel: number;
  centerPosition: {
    lat: number;
    lng: number;
  };
  questData?: QuestData;
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  zoomLevel, 
  centerPosition, 
  questData, 
  currentLocation 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<naver.maps.Map | null>(null);

  const { selectedBuildingId, setSelectedBuildingId } = useAppStore();

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const customMapType = new naver.maps.MapTypeRegistry({
      'normal': naver.maps.NaverStyleMapTypeOptions.getNormalMap()
    });

    mapInstance.current = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(centerPosition.lat, centerPosition.lng),
      zoom: zoomLevel,
      zoomControl: false,
      zoomControlOptions: {
        position: naver.maps.Position.LEFT_BOTTOM
      },
      mapTypeId: naver.maps.MapTypeId.NORMAL,
      mapTypes: customMapType,
      logoControl: false,
      scaleControl: false,
    });
  }, []);

  // Use custom hook to manage markers
  useNMapMarkers({ map: mapInstance.current, questData: questData ? {
    ...questData,
    buildings: [...questData.buildings, {
      buildingId: 'current',
      name: '현재 위치',
      places: [],
      location: {
        lat: currentLocation?.lat ?? 0,
        lng: currentLocation?.lng ?? 0
      }
    }]
  } : null, markerTemplate: (metadata) => {
    const buildingName = metadata.building?.name || '';
    const leadingNumber = getLeadingNumber(buildingName);

    const onClick = () => {
      if (metadata.building?.buildingId === 'current') return;
      setSelectedBuildingId(metadata.building?.buildingId || '');
    }

    return {
      innerHTML: `<div>${leadingNumber}</div>`,
      onClick: onClick
    };
  } });

  useNMapCurrentMarker({ 
    map: mapInstance.current, 
    position: currentLocation 
      ? [currentLocation.lat, currentLocation.lng] 
      : [0, 0] 
  });

  return (
    <div 
      ref={mapRef} 
      className="w-full flex-grow"
      style={{ width: '100%', height: '100%', minHeight: '400px',
        // filter: 'grayscale(1) sepia(20%) hue-rotate(155deg) saturate(150%)'
      }}
    />
  );
};

export default MapComponent;