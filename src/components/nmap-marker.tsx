"use client"

import React, { useEffect, useRef } from 'react';
import { Building, Place } from '@/types/QuestData';
import { getLeadingNumber } from '@/utils/getLeadingNumber';
import { cn } from '@/lib/utils';

interface NMapMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  map: naver.maps.Map;
  position: [number, number];  // [lng, lat]
  metadata?: {
    building?: Building;
    places?: Place[];
  };
  onClick?: () => void;
}

const NMapMarker: React.FC<NMapMarkerProps> = ({ 
  map, 
  position, 
  metadata, 
  onClick,
  className,
  ...props 
}) => {
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const htmlMarkerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!map) return;

    // HTML 엘리먼트 생성
    const el = document.createElement('div');
    el.className = getMarkerClass(metadata, className);
    
    if (metadata?.building) {
      el.textContent = getLeadingNumber(metadata.building.name || '');
    }
    
    htmlMarkerRef.current = el;

    // Naver 마커 생성
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(position[1], position[0]),
      map: map,
      icon: {
        content: el,
        size: new naver.maps.Size(20, 20),
        anchor: new naver.maps.Point(10, 10),
      }
    });

    // 클릭 이벤트 설정
    if (onClick) {
      naver.maps.Event.addListener(marker, 'click', onClick);
    }

    markerRef.current = marker;

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [map, position, metadata, onClick, className]);

  return null;
};

// 마커 스타일 결정 함수
function getMarkerClass(
  metadata?: { places?: Place[] },
  additionalClassName?: string
): string {
  const allPlacesConquered = metadata?.places?.every(
    place => place.isConquered || place.isClosed || place.isNotAccessible
  ) ?? false;

  const conditionClass = allPlacesConquered 
    ? cn("bg-gray-300 z-0 border-gray-600 text-gray-600") 
    : cn("bg-blue-600 z-10 border-gray-800");

  return cn(
    "size-5 rounded-full text-gray-100 text-center text-xs content-center flex justify-center items-center border font-medium",
    conditionClass,
    additionalClassName
  );
}

export default NMapMarker; 