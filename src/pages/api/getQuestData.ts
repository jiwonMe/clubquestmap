import type { NextApiRequest, NextApiResponse } from 'next';
import { QuestData } from '@/types/QuestData';

// API handler to fetch quest data
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { questId } = req.query;

  if (!questId || typeof questId !== 'string') {
    res.status(400).json({ error: 'Invalid questId' });
    return;
  }

  try {
    const response = await fetch(`https://api.staircrusher.club/admin/clubQuests/${questId}`);
    const data = await response.json();
    res.status(200).json(data as QuestData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quest data' });
  }
} 