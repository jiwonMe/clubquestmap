// src/hooks/useQuestData.ts
import { useState, useEffect, useCallback } from 'react';
import { QuestData } from '@/types/QuestData';

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

export const useQuestData = (questId: string | null) => {
  const [questData, setQuestData] = useState<QuestData | null>(null);

  const loadQuestData = useCallback(async () => {
    if (questId) {
      const data = await fetchQuestData(questId);
      setQuestData(data);
    }
  }, [questId]);

  const updatePlaceData = useCallback(async (buildingId: string, placeId: string, status: string, value: boolean) => {
    if (questId) {
      await fetchUpdatePlaceData(questId, buildingId, placeId, status, value);
      await forceReloadQuestData();
    }
  }, [questId]);

  const forceReloadQuestData = useCallback(async () => {
    if (questId) {
      loadQuestData();
    }
  }, [questId, loadQuestData]);

  useEffect(() => {
    loadQuestData();
    const interval = setInterval(loadQuestData, 5000);
    return () => clearInterval(interval); // Clean up interval on unmount
  }, [questId, loadQuestData]);

  return { questData, updatePlaceData, forceReloadQuestData };
};