import { Building } from '@/types/QuestData'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Store의 상태 타입 정의
interface AppState {
  selectedBuilding: Building | null

  // 액션들
  setSelectedBuilding: (building: Building | null) => void
}

// Zustand 스토어 생성
export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      selectedBuilding: null,

      setSelectedBuilding: (building: Building | null) => set({ selectedBuilding: building }),
    }),
    { name: 'app-store' }
  )
)