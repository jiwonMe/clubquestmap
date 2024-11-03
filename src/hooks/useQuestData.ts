// src/hooks/useQuestData.ts
import { useState, useEffect, useCallback } from 'react';
import { QuestData } from '@/types/QuestData';

// src/utils/getQuestData.ts
export const fetchQuestData = async (questId: string) => {
  const response = await fetch(`/api/getQuestData?questId=${questId}`);
  const data = await response.json();
  console.log(data);
  return data;
};

export const useQuestData = (questId: string) => {
  const [questData, setQuestData] = useState<QuestData | null>(null);

  const loadQuestData = useCallback(async () => {
    const data = await fetchQuestData(questId);
    setQuestData(data);
  }, [questId]);

  useEffect(() => {
    loadQuestData();
    const interval = setInterval(loadQuestData, 5000);
    return () => clearInterval(interval); // Clean up interval on unmount
  }, [questId, loadQuestData]);

  return questData;
};