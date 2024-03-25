"use client"
import MapboxMapComponent from '@/components/mapbox';
import { useEffect, useState } from 'react';
import { getQuestData } from '@/utils/getQuestData';
import { QuestData } from '@/types/QuestData';
import { Marker } from 'mapbox-gl';

export default function Home() {

  const [questData, setQuestData] = useState<QuestData | null>(null);

  const loadQuestData = async () => {
    const questId = 'a6867979-b62a-4d5a-a183-d434d9025081'
    const response = await getQuestData(questId);
    console.log(response);
    setQuestData(response);
  }

  useEffect(() => {
    loadQuestData();
    setInterval(loadQuestData, 5000);
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {
        questData && (
          <MapboxMapComponent
            centerPosition={{
              lng: questData?.buildings[0].location.lng || 127,
              lat: questData?.buildings[0].location.lat || 38,
            }}
            markerPositions={questData?.buildings.map(building => [building.location.lng, building.location.lat]) || []}
          />
        )
      }
    </main>
  );
}
