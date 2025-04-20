import {useTabStore} from "@/stores/useTabStore"

export function formatCurrency(value: number, activeTab: string): string {
  if (activeTab == "Total Sales" || activeTab == "Total Profit")
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  else
    return String(value)
}
