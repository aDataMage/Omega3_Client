// stores/useTabStore.ts
import { create } from "zustand";

type Tab =
  | "Total Customers"
  | "New Customers"
  | "Average Revenue per Customer"
  | "Repeat Customer Rate";
interface TabStore {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  activeTab: "Total Customers", // default tab
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
