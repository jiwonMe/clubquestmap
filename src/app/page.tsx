"use client"
import MapboxMapComponent from '@/components/mapbox';
import dynamic from 'next/dynamic';
const NMapComponent = dynamic(() => import('@/components/nmap'), { ssr: false });
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import StairCrusherClubLogo from '@/assets/images/SCC_logo.png';
import BuggieIcon from '@/assets/images/buggie.png'
import CurrentMarker from '@/components/current-marker';
import { useAppStore } from '@/store/appStore';
import { useQuestData } from '@/hooks/useQuestData'; // Import the custom hook
import BuildingDrawer from '@/components/BuildingDrawer'; // Import the new component
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'next/navigation';
import { FaInfoCircle, FaCog } from 'react-icons/fa'; // Import FaCog for settings icon
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox'; // Import Checkbox component
import { Suspense } from 'react';
import { cn } from '@/lib/utils';

function HomeContent() {
  const searchParams = useSearchParams();

  const [currentLocation, setCurrentLocation] = useState<[number, number]>([127, 38]);
  const { selectedBuildingId, setSelectedBuildingId, questId, setQuestId, useNaverMap, setUseNaverMap } = useAppStore(); // Add useNaverMap and setUseNaverMap

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(true); // State for guide dialog
  const [isQuestIdDialogOpen, setIsQuestIdDialogOpen] = useState(searchParams?.get('questId') === null); // State for questId dialog
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State for settings dialog
  const [error, setError] = useState<string | null>(null); // State for error message

  const [inputValue, setInputValue] = useState(''); // Add this state

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.longitude, position.coords.latitude]);
    }, (error) => {
      console.error('Error getting current location:', error);
    },{
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  };

  // Always call the hook, but pass null if no questId
  const { questData: {
    [questId as string]: questData
  }, updatePlaceData, loadQuestData } = useQuestData(questId ?? null);

  useEffect(() => {
    const questIdFromUrl = searchParams?.get('questId') ?? null;
    setQuestId(questIdFromUrl);
  }, [searchParams, setQuestId]);

  useEffect(() => {
    if (questId) {
      getCurrentLocation();
      setInterval(getCurrentLocation, 1000);
    }
  }, [questId]);

  useEffect(() => {
    if (questId) {
      loadQuestData();
    }
  }, [questId, loadQuestData]);

  useEffect(() => {
    if (questId) {
      setIsDrawerOpen(selectedBuildingId !== null);
    }
  }, [selectedBuildingId, questId]);

  
  const totalPlaces = useMemo(() => questData?.buildings.reduce((acc, building) => acc + building.places.length, 0) || 0, [questData]);
  const completedPlaces = useMemo(() => questData?.buildings.reduce((acc, building) => acc + building.places.filter(place => place.isConquered || place.isClosed || place.isNotAccessible).length, 0) || 0, [questData]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => totalPlaces ? (completedPlaces / totalPlaces) * 100 : 0, [totalPlaces, completedPlaces]);

  const handleQuestIdSubmit = (id: string) => {
    // Extract UUID using regex
    const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
    const match = id.match(uuidRegex);
    const uuid = match ? match[0] : '';

    // Validate the questId
    if (uuid) {
      setQuestId(uuid);
      setIsQuestIdDialogOpen(false);
      setError(null);
      // set params
      window.history.replaceState({}, '', `/?questId=${uuid}`);
      window.location.reload(); // Refresh the page when the questId is changed
    } else {
      setIsQuestIdDialogOpen(true);
      setError("잘못된 퀘스트 ID입니다. 다시 입력해주세요.");
    }
  };

  const handleMapToggle = (checked: boolean) => {
    setUseNaverMap(checked);
    window.location.reload(); // Refresh the page when the map type is toggled
  };

  return (
    <main className="flex min-h-full flex-col items-center justify-between relative overflow-hidden bg-blue-600">
      {questId && (
        <>
          <div className="fixed top-0 left-0 right-0 z-30 w-full">
            <div className="h-12 bg-blue-600 flex items-center px-4 justify-between border-b border-gray-800">
              <h1 className='text-white font-medium text-sm'>
                {questData ? `${questData?.name} - ${completedPlaces}/${totalPlaces}` : 'Loading...'}
              </h1>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={() => setIsGuideOpen(true)} className='text-white hover:bg-blue-500 hover:text-white bg-transparent'>
                  <FaInfoCircle size={24} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)} className='text-white hover:bg-blue-500 hover:text-white bg-transparent'>
                  <FaCog size={24} />
                </Button>
              </div>
            </div>
            <div className="w-full bg-gray-200 h-2 relative border-b border-gray-800">
              <div className="bg-green-500 h-2 absolute border-b border-gray-800" style={{ width: `${progressPercentage}%` }}>
                <div className={cn(
                              "absolute -bottom-10 text-gray-800 text-xs pr-2 bg-white rounded-full px-2 py-1 border-2 border-gray-800 font-medium",
                              progressPercentage > 10 ? 'right-0 rounded-tr-none' : 'left-2 rounded-tl-none'
                            )}>
                  {`${progressPercentage.toFixed(1)}%`} {/* Display progress percentage */}
                </div>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/4 w-6 h-6"
                style={{
                  left: progressPercentage > 10 ? `${progressPercentage}%` : 'auto'
                }}
              >
                <Image src={BuggieIcon} alt="버기 아이콘" width={24} height={24} />
              </div>
            </div>
          </div>
          {
            questData && (
              useNaverMap ? (
                <NMapComponent
                  zoomLevel={15}
                  centerPosition={{
                    lng: questData?.buildings[0].location.lng || 127,
                    lat: questData?.buildings[0].location.lat || 38,
                  }}
                  questData={questData}
                  currentLocation={{
                    lng: currentLocation[0],
                    lat: currentLocation[1],
                  }}
                />
              ) : (
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
            )
          }

          <BuildingDrawer
            isOpen={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            selectedBuildingId={selectedBuildingId}
            setSelectedBuildingId={setSelectedBuildingId}
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

          {/* Settings Dialog */}
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>설정</DialogTitle>
                <DialogDescription>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={useNaverMap}
                      onCheckedChange={handleMapToggle}
                    />
                    <span>네이버 지도 사용</span>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Quest ID Input Section */}
      {isQuestIdDialogOpen && questId === null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">퀘스트 ID 혹은 기존 퀘스트 URL 입력</h2>
              <div>
                <Input
                  type="text"
                  placeholder="퀘스트 ID 입력"
                  className="border p-2 w-full text-black mt-2 text-xl"
                  onBlur={(e) => handleQuestIdSubmit(e.target.value)}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                />
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
              </div>
              <Button variant="default" className="w-full" onClick={() => handleQuestIdSubmit(inputValue)}>확인</Button>
            </div>
          </div>
        </div>
      )}

      {/* StairCrusherClub Logo at the bottom left */}
      <div className="absolute bottom-4 left-4">
        <Image src={StairCrusherClubLogo} alt="StairCrusherClub Logo" width={100} height={100} />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
