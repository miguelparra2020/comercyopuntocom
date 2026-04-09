import { create } from 'zustand'

type ActiveTab = 'buyer' | 'saas'

interface UiStore {
  isDrawerOpen: boolean
  activeTab: ActiveTab
  openDrawer: () => void
  closeDrawer: () => void
  setActiveTab: (tab: ActiveTab) => void
}

export const useUiStore = create<UiStore>()((set) => ({
  isDrawerOpen: false,
  activeTab: 'buyer',
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
