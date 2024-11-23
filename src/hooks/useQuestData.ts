// src/hooks/useQuestData.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { QuestData } from '@/types/QuestData';
import { debounce } from '@/lib/utils';

// src/utils/getQuestData.ts
export const fetchQuestData = async (questId: string) => {
  const response = await fetch(`/api/getQuestData?questId=${questId}`);
  const data = await response.json();
  return data;
};

export const fetchUpdatePlaceData = async (questId: string, buildingId: string, placeId: string, kind: string, value: boolean) => {
  // PUT /api/updatePlaceData
  const response = await fetch(`/api/updatePlaceData`, {
    method: 'PUT',
    body: JSON.stringify({ questId, buildingId, placeId, [kind]: value }),
  });
  const data = await response.json();
  return data;
};

export const useQuestData = (questId: string | string[] | null) => {
  const [questData, setQuestData] = useState<Record<string, QuestData | null>>({});
  const isFirstLoad = useRef(true);
  
  // 즉시 실행되는 기본 함수
  const loadQuestData = async () => {
    if (questId) {
      const questIds = Array.isArray(questId) ? questId : [questId];
      const dataPromises = questIds.map(id => fetchQuestData(id));
      const dataResults = await Promise.all(dataPromises);

      const dataMap = questIds.reduce((acc, id, index) => {
        acc[id] = dataResults[index];
        return acc;
      }, {} as Record<string, QuestData | null>);
      setQuestData(dataMap);
    }
  };

  // debounced 버전의 함수들
  const debouncedLoadQuestData = useRef(
    debounce(async () => {
      await loadQuestData();
    }, 2000)
  ).current;

  // 조건부로 즉시 실행 또는 debounce된 함수를 호출하는 래퍼 함수
  const handleLoadQuestData = async () => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      await loadQuestData();
    } else {
      await debouncedLoadQuestData();
    }
  };

  const updatePlaceData = async (buildingId: string, placeId: string, status: string, value: boolean) => {
    if (questId) {
      const questIds = Array.isArray(questId) ? questId : [questId];
      await Promise.all(questIds.map(id => 
        fetchUpdatePlaceData(id, buildingId, placeId, status, value)
      ));
      await handleLoadQuestData();
    }
  };

  const debouncedUpdatePlaceData = useRef(
    debounce(updatePlaceData, 2000)
  ).current;

  // useEffect(() => {
  //   handleLoadQuestData();
  //   const interval = setInterval(handleLoadQuestData, 5000);
  //   return () => clearInterval(interval);
  // }, [questId]);

  useEffect(() => {
    loadQuestData();
  }, [questId]);

  return { 
    questData, 
    updatePlaceData: isFirstLoad.current ? updatePlaceData : debouncedUpdatePlaceData,
    loadQuestData: handleLoadQuestData,
    isLoading: questId !== null && questData[questId as string] === null 
  };
};
