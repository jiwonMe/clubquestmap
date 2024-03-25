"use client"
import MapboxMapComponent from '@/components/mapbox';
import { useEffect, useState } from 'react';
import { getQuestData } from '@/utils/getQuestData';
import { QuestData } from '@/types/QuestData';
import { Marker } from 'mapbox-gl';
import Image from 'next/image';
import StairCrusherClubLogo from '@/assets/images/staircrusherclub-logo.png';

export default function Home() {

  const [questData, setQuestData] = useState<QuestData | null>(null);

  const [currentLocation, setCurrentLocation] = useState<[number, number]>([127, 38]);

  const loadQuestData = async () => {
    const questId = 'fb1ba922-9ec4-4906-866c-9eeef3a91ba2'
    const response = await getQuestData(questId);
    console.log(response);
    setQuestData(response);
  }

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.longitude, position.coords.latitude]);
    });
  };

  useEffect(() => {
    loadQuestData();
    setInterval(loadQuestData, 5000);
  }, [])

  useEffect(() => {
    getCurrentLocation();
    setInterval(getCurrentLocation, 5000);
  }
  , []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <h1 className='absolute top-4 left-4 z-10 font-sans font-semibold text-2xl text-gray-700'>
        {questData ? questData?.name : 'Loading...'}
      </h1>
      {
        questData && (
          <MapboxMapComponent
            centerPosition={{
              lng: questData?.buildings[0].location.lng || 127,
              lat: questData?.buildings[0].location.lat || 38,
            }}
            markerPositions={questData?.buildings.map(building => [building.location.lng, building.location.lat]) || []}
            questData={questData}
            currentLocation={currentLocation}
          />
        )
      }
      <Image
      className='absolute top-0 right-0 z-10'
      src={StairCrusherClubLogo} alt="Stair Crusher Club Logo" width={100} height={100} />
    </main>
  );
}
