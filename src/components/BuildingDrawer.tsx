import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { FiCopy } from "react-icons/fi";
import { useQuestData } from "@/hooks/useQuestData";
import { useAppStore } from "@/store/appStore";
import naverMapIcon from "@/assets/images/nmap_logo.webp";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface BuildingDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBuildingId: string | null;
  setSelectedBuildingId: (buildingId: string | null) => void;
}

export default function BuildingDrawer({
  isOpen,
  onOpenChange,
  selectedBuildingId,
  setSelectedBuildingId,
}: BuildingDrawerProps) {
  
  const { questId } = useAppStore();
  
  const { updatePlaceData, questData } = useQuestData(questId ?? null);

  const handleStatusChange = (placeId: string, status: 'isClosed' | 'isNotAccessible') => {
    if (selectedBuildingId) {
      setSelectedBuildingId(selectedBuildingId);
      updatePlaceData(selectedBuildingId, placeId, status, !questData?.buildings.find(building => building.buildingId === selectedBuildingId)?.places.find(place => place.placeId === placeId)?.[status]);
    }
  };

  const completedCount = questData?.buildings.find(building => building.buildingId === selectedBuildingId)?.places.filter(
    (place) => place.isClosed || place.isNotAccessible || place.isConquered
  ).length || 0;
  const totalCount = questData?.buildings.find(building => building.buildingId === selectedBuildingId)?.places.length || 0;

  const openNaverMap = (lat: number, lng: number) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const url = `nmap://place?lat=${lat}&lng=${lng}&name=Place&appname=${window.location.hostname}`;
      const clickedAt = +new Date();

      window.location.href = url;

      setTimeout(() => {
        if (+new Date() - clickedAt < 2000) {
          window.location.href = 'http://itunes.apple.com/app/id311867728?mt=8';
        }
      }, 1500);
    } else {
      const url = `https://map.naver.com/v5/search/${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const copyToClipboard = (placeId: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowTooltip(placeId);
      setTimeout(() => setShowTooltip(null), 1500);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) setSelectedBuildingId(null);
    }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex justify-center items-center w-full text-center">
            {questData?.buildings.find(building => building.buildingId === selectedBuildingId)?.name}
            <Button
              variant="link"
              className="ml-2 p-0 size-8"
              onClick={() => {
                if (selectedBuildingId && questData) {
                  const { lat, lng } = questData?.buildings.find(building => building.buildingId === selectedBuildingId)?.places[0].location ?? { lat: 0, lng: 0 };
                  openNaverMap(lat, lng);
                }
              }}
            >
              <img src={naverMapIcon.src} alt="네이버 지도" width={20} height={20} className="p-0 m-0 border border-gray-300 rounded-md" tabIndex={0}/>
            </Button>
          </DrawerTitle>
          <DrawerDescription>
            장소 수: {totalCount}개
          </DrawerDescription>
          <DrawerDescription>
            정복 상태: ({completedCount}/{totalCount})
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {questData?.buildings.find(building => building.buildingId === selectedBuildingId)?.places
            // .sort((a, b) => {
            //   // Sort places: incomplete first, completed last
            //   const aCompleted = a.isConquered || a.isClosed || a.isNotAccessible;
            //   const bCompleted = b.isConquered || b.isClosed || b.isNotAccessible;
            //   return aCompleted === bCompleted ? 0 : aCompleted ? 1 : -1;
            // })
            .map((place) => {
              const isCompleted = place.isConquered || place.isClosed || place.isNotAccessible;
              return (
                <div
                  key={place.placeId}
                  className={`p-3 border rounded-lg ${isCompleted ? 'opacity-50' : ''}`}
                >
                  <h3 className="font-medium flex items-center">
                    <TooltipProvider>
                      <Tooltip open={showTooltip === place.placeId}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className="bg-gray-100"
                            onClick={() => copyToClipboard(place.placeId, place.name)}
                          >
                            {place.name}
                            <FiCopy className="ml-2" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>복사되었습니다</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      variant="link"
                      className="ml-2 p-0"
                      onClick={() => {
                        if (selectedBuildingId && questData) {
                          const { lat, lng } = place.location ?? { lat: 0, lng: 0 };
                          openNaverMap(lat, lng);
                        }
                      }}
                    >
                      <img src={naverMapIcon.src} alt="네이버 지도" width={20} height={20} className="p-0 m-0 border border-gray-300 rounded-md" tabIndex={0}/>
                    </Button>
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between gap-2">
                      <Button
                        className="w-1/2"
                        variant={place.isClosed ? "default" : "outline"}
                        onClick={() => handleStatusChange(place.placeId, 'isClosed')}
                      >
                        폐업 🏚️
                      </Button>
                      <Button
                        className="w-1/2"
                        variant={place.isNotAccessible ? "default" : "outline"}
                        onClick={() => handleStatusChange(place.placeId, 'isNotAccessible')}
                      >
                        접근 불가 🚫
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">닫기</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}