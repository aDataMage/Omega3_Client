// lib/stores/useDateRangeStore.ts
import { create } from "zustand"
import { DateRange } from "react-day-picker"

type DateRangeState = {
  dateRange: DateRange
  setDateRange: (range: DateRange | undefined) => void
}

export const useDateRangeStore = create<DateRangeState>((set) => ({
  dateRange: {
    from: new Date(2024, 0, 1),
    to: new Date(),
  },
  setDateRange: (range) => set({ dateRange: range }),
}))
