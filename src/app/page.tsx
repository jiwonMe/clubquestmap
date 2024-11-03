"use client"
import MapboxMapComponent from '@/components/mapbox';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import StairCrusherClubLogo from '@/assets/images/staircrusherclub-logo.png';
import BuggieIcon from '@/assets/images/buggie.png'
import CurrentMarker from '@/components/current-marker';
import { useAppStore } from '@/store/appStore';
import { useQuestData } from '@/hooks/useQuestData'; // Import the custom hook
import BuildingDrawer from '@/components/BuildingDrawer'; // Import the new component
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'; // Import Dialog components
import { Button } from '@/components/ui/button'; // Import Button component
import { FaInfoCircle } from 'react-icons/fa'; // Import an icon from react-icons
import { useSearchParams } from 'next/navigation'; // Import useSearchParams


export default function Home() {
  const searchParams = useSearchParams(); // Initialize useSearchParams
  const questId = searchParams?.get('questId') ?? '26752f98-1b22-4380-8121-a1b594acdb53'; // Extract questId from URL parameters

  const questData = useQuestData(questId); // Use the custom hook with questId

  const [currentLocation, setCurrentLocation] = useState<[number, number]>([127, 38]);
  const { selectedBuilding, setSelectedBuilding } = useAppStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false); // State for guide dialog

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.longitude, position.coords.latitude]);
    });
  };

  useEffect(() => {
    getCurrentLocation();
    setInterval(getCurrentLocation, 5000);
  }, []);

  useEffect(() => {
    setIsDrawerOpen(selectedBuilding !== null);
  }, [selectedBuilding]);

  // Calculate the number of places and their statuses
  const totalPlaces = questData?.buildings.reduce((acc, building) => acc + building.places.length, 0) || 0;
  const completedPlaces = questData?.buildings.reduce((acc, building) => acc + building.places.filter(place => place.isConquered).length, 0) || 0;
  const closedPlaces = questData?.buildings.reduce((acc, building) => acc + building.places.filter(place => place.isClosed).length, 0) || 0;
  const inaccessiblePlaces = questData?.buildings.reduce((acc, building) => acc + building.places.filter(place => place.isNotAccessible).length, 0) || 0;

  // Calculate progress percentage
  const progressPercentage = totalPlaces ? (completedPlaces / totalPlaces) * 100 : 0;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="absolute top-0 left-0 right-0 z-30 w-full">
        <div className="h-12 bg-blue-600 flex items-center px-4 justify-between border-b border-gray-800">
          <h1 className='text-white font-medium text-sm'>
            {questData ? `${questData?.name} - ${completedPlaces}/${totalPlaces}` : 'Loading...'}
          </h1>
          <Button variant="ghost" size="icon" onClick={() => setIsGuideOpen(true)} className='text-white hover:bg-blue-500 hover:text-white bg-transparent'>
            <FaInfoCircle size={24} />
          </Button>
        </div>
        <div className="w-full bg-gray-200 h-2 relative border-b border-gray-800">
          <div className="bg-green-500 h-2 relative border-b border-gray-800" style={{ width: `${progressPercentage}%` }}>
            <div className="absolute -right-0 -bottom-10 text-gray-800 text-xs pr-2 bg-white rounded-full px-2 py-1 border-2 border-gray-800 font-medium rounded-tr-none">
              {`${progressPercentage.toFixed(1)}%`} {/* Display progress percentage */}
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2">
              <Image src={BuggieIcon} alt="버기 아이콘" width={24} height={24} />
            </div>
          </div>
        </div>
      </div>
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


      <BuildingDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedBuilding={selectedBuilding}
        setSelectedBuilding={setSelectedBuilding}
      />

      {/* Guide Dialog using shadcn/ui */}
      <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이용 안내</DialogTitle>
            <DialogDescription>
              <ul className="list-disc pl-5 text-left">
                <li>건물 마커를 클릭해 남은 장소를 확인하세요.</li>
                <li>앱에서 정복 완료시, 정복란이 자동으로 체크됩니다.</li>
                <li>정복이 완료된 건물은 회색으로 표시됩니다.</li>
                <li>폐업여부는 네이버지도로 확인하면 더 정확합니다.</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
