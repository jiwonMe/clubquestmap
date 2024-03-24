"use client"
import MapboxMapComponent from '@/components/mapbox';
import { useEffect, useState } from 'react';
import { getQuestData } from '@/utils/getQuestData';
import { QuestData } from '@/types/QuestData';

export default function Home() {

  const [questData, setQuestData] = useState<QuestData | null>(null);

  useEffect(() => {
    (async () => {
      const questId = 'a6867979-b62a-4d5a-a183-d434d9025081'
      const response = await getQuestData(questId);
      console.log(response);
      setQuestData(response);
    })()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MapboxMapComponent
        movingObjects={[]}
        centerPosition={{
          lng: questData?.buildings[0].location.lng || 0,
          lat: questData?.buildings[0].location.lat || 0
        }}
      />
    </main>
  );
}
