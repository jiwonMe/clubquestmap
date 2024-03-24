"use server"

import { QuestData } from "@/types/QuestData";

// fetch quest data from the server
const getQuestData = async (questId: string) => {
  const response = await fetch(`https://api.staircrusher.club/admin/clubQuests/${questId}`);
  const data = await response.json();
  return data as QuestData;
}

export { getQuestData };