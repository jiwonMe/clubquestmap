import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Store의 상태 타입 정의
interface AppState {
  questId: string | null
  selectedBuildingId: string | null

  // 액션들
  setSelectedBuildingId: (buildingId: string | null) => void
  setQuestId: (questId: string | null) => void
}

// Zustand 스토어 생성
export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      questId: null,
      selectedBuildingId: null,

      setQuestId: (questId: string | null) => set({ questId }),
      setSelectedBuildingId: (buildingId: string | null) => set({ selectedBuildingId: buildingId }),
    }),
    { name: 'app-store' }
  )
)