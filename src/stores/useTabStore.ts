// stores/useTabStore.ts
import { create } from 'zustand';

type Tab = 'Total Sales' | 'Total Profit' | 'Total Orders' | 'Total Returns';

interface TabStore {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  activeTab: 'Total Sales', // default tab
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
