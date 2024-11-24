'use client';

import React, { useEffect, Suspense, useState, useMemo } from 'react';
import { useQuestData } from '@/hooks/useQuestData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import BuggieIcon from '@/assets/images/buggie.png'
import Image from 'next/image';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function DashboardContent() {
  const searchParams = useSearchParams();
  
  // Memoize questIds
  const questIds = useMemo(() => {
    const questIdsParam = searchParams?.get('questIds') || '';
    return questIdsParam.split(';').filter(id => id.length > 0);
  }, [searchParams]);

  const { questData, isLoading, loadQuestData } = useQuestData(questIds);

  useEffect(() => {
    if (questIds.length > 0) {
      loadQuestData();
    }
  }, [questIds]);

  const sortedQuests = questIds
    .map(id => {
      const totalPlaces = questData[id]?.buildings.reduce((acc, building) => acc + building.places.length, 0) || 0;
      const completedPlaces = questData[id]?.buildings.reduce((acc, building) => acc + building.places.filter(place => place.isClosed || place.isNotAccessible || place.isConquered).length, 0) || 0;
      const progress = totalPlaces > 0 ? completedPlaces / totalPlaces : 0;
      return { id, progress };
    })
    // .sort((a, b) => b.progress - a.progress);

  if (questIds.length === 0) {
    return (
      <div className={cn(
        "container mx-auto p-4 min-h-screen bg-white",
        "flex items-center justify-center"
      )}>
        <p className="text-lg text-gray-600">
          URL에 questIds 파라미터가 없습니다. 예시: ?questIds=id1;id2;id3
        </p>
      </div>
    );
  }

  let currentRank = 1;
  let lastProgress = -1;
  const rankedQuests = sortedQuests.map((quest, index) => {
    if (quest.progress !== lastProgress) {
      currentRank = index + 1;
      lastProgress = quest.progress;
    }
    return { ...quest, rank: currentRank };
  });

  return (
    <div className="container mx-auto p-4 min-h-screen bg-white relative">
      
      <ScrollArea className="pr-4">
        <h1 className="text-2xl font-bold mb-4">
          {questData[questIds[0]]?.name.match(/([^-]*)/)?.[0] || 'N/A'}
        </h1>
          <div className="table w-full border-collapse border border-black">
            {rankedQuests.map(({ id, rank, progress }) => (
              <Card 
                key={id}
                className={cn(
                  "rounded-none table-row border-b border-black",
                  progress === 1 ? 'bg-blue-500 text-white' : ''
                )}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col justify-between">
                    <div className="flex items-center gap-2 justify-between">
                      <h3 className="text-lg font-semibold">
                        {questData[id]?.name.match(/[0-9A-Za-z]조/)?.[0] || 'N/A'}
                      </h3>
                      <Button 
                        variant="outline"
                        onClick={() => window.open(`/?questId=${id}`, '_blank')}
                        className={cn(
                          "text-sm px-2 py-1 rounded-md",
                          "border border-gray-300",
                          "hover:bg-gray-100 transition-colors",
                          progress === 1 ? 'border-white text-white hover:bg-blue-600' : 'text-gray-600'
                        )}
                      >
                        퀘스트 보기
                      </Button>
                    </div>
                    <div className="w-full bg-gray-200 h-3 relative border border-gray-800 mt-4 mb-8">
                      <div className="absolute bg-green-500 h-full" style={{ width: `${progress * 100}%` }}>
                        <div 
                          className={cn(
                            "absolute -bottom-10 text-gray-800 text-xs pr-2 bg-white rounded-full px-2 py-1 border-2 border-gray-800 font-medium",
                            progress > 0.1 ? 'right-0 rounded-tr-none' : 'left-2 rounded-tl-none'
                          )}
                        >
                          {`${(progress*100).toFixed(0)}%`}
                        </div>
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/4 w-8 h-8"
                        style={{
                          left: progress > 0.1 ? `${progress * 100}%` : 'auto'
                        }}
                      >
                        <Image src={BuggieIcon} alt="버기 아이콘" width={24} height={24} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
    </div>
  );
}

export default DashboardContent;
