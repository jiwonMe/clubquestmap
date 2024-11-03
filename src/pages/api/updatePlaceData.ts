import type { NextApiRequest, NextApiResponse } from 'next';
import { QuestData } from '@/types/QuestData';

interface UpdatePlaceDataRequest {
  buildingId: string;
  placeId: string;
  isNotAccessible?: boolean;
  isClosed?: boolean;
  questId: string;
}

interface ApiError {
  error: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const validateRequest = (body: unknown): ValidationResult => {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: '요청 본문이 올바르지 않습니다.' };
  }
  
  const typedBody = body as Record<string, unknown>;
  
  // 필수 필드 검증
  const requiredFields = ['buildingId', 'placeId', 'questId'];
  for (const field of requiredFields) {
    if (!(field in typedBody)) {
      return { isValid: false, error: `${field}가 누락되었습니다.` };
    }
    if (typeof typedBody[field] !== 'string') {
      return { isValid: false, error: `${field}는 문자열이어야 합니다.` };
    }
  }

  // 상호 배타적 필드 검증
  const hasNotAccessible = 'isNotAccessible' in typedBody;
  const hasClosed = 'isClosed' in typedBody;
  
  if (hasNotAccessible && hasClosed) {
    return { 
      isValid: false, 
      error: 'isNotAccessible와 isClosed는 동시에 존재할 수 없습니다.' 
    };
  }
  
  if (!hasNotAccessible && !hasClosed) {
    return { 
      isValid: false, 
      error: 'isNotAccessible 또는 isClosed 중 하나는 반드시 필요합니다.' 
    };
  }
  
  if (hasNotAccessible && typeof typedBody.isNotAccessible !== 'boolean') {
    return { 
      isValid: false, 
      error: 'isNotAccessible는 boolean 타입이어야 합니다.' 
    };
  }
  
  if (hasClosed && typeof typedBody.isClosed !== 'boolean') {
    return { 
      isValid: false, 
      error: 'isClosed는 boolean 타입이어야 합니다.' 
    };
  }

  return { isValid: true };
};

// API call function
const updatePlaceData = async (data: UpdatePlaceDataRequest): Promise<Response> => {
  try {

    const mode = Object.keys(data).find(key => key === 'isNotAccessible') ?? 'isClosed';

    const response = await fetch(`https://api.staircrusher.club/admin/clubQuests/${data.questId}/${mode}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        buildingId: data.buildingId,
        placeId: data.placeId,
        [mode]: data[mode]
      }),
    });
    return response;
  } catch (error) {
    console.error(error, data);
    return new Response(JSON.stringify({ error: 'Failed to update place data' }), { status: 500 });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean } | ApiError>
) {
  if (req.method !== 'PUT') {
    res.status(405).json({ error: 'PUT 메소드만 허용됩니다.' });
    return;
  }

  const requestBody = JSON.parse(req.body);

  const validation = validateRequest(requestBody);
  if (!validation.isValid) {
    res.status(400).json({ error: validation.error! });
    return;
  }

  try {
    const result = await updatePlaceData(requestBody);
    if (result.status === 400) {
      res.status(400).json({ error: 'Failed to update place data' });
    } else {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  }
} 