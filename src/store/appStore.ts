import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Store의 상태 타입 정의
interface AppState {
  questId: string | null
  selectedBuildingId: string | null
  useNaverMap: boolean

  // 액션들
  setSelectedBuildingId: (buildingId: string | null) => void
  setQuestId: (questId: string | null) => void
  setUseNaverMap: (useNaverMap: boolean) => void
}

// Zustand 스토어 생성
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        questId: null,
        selectedBuildingId: null,
        useNaverMap: false,

        setQuestId: (questId: string | null) => {
          set({ questId, selectedBuildingId: null });
        },
        setSelectedBuildingId: (buildingId: string | null) => set({ selectedBuildingId: buildingId }),
        setUseNaverMap: (useNaverMap: boolean) => set({ useNaverMap }),
      }),
      {
        name: 'app-store', // localStorage에 저장될 이름
      }
    )
  )
)