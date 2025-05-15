// stores/useTabStore.ts
import { create } from "zustand";

interface DrillDownStore {
  drillDown: boolean;
  setDrillDown: (drillDown: boolean) => void;
}

export const useDrillDown = create<DrillDownStore>((set) => ({
  drillDown: false,
  setDrillDown: (drillDown) => set({ drillDown: drillDown }),
}));
