// hooks/useKpis.ts
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { useDateRangeStore } from '@/stores/useDateRangeStore';
import { KPIs } from '@/types/kpi';

export const useKpis = () => {
  const { dateRange } = useDateRangeStore();

  const startDate = dateRange?.from?.toISOString().split("T")[0];
  const endDate = dateRange?.to?.toISOString().split("T")[0];

  return useQuery({
    queryKey: ['kpis', startDate, endDate],
    queryFn: async (): Promise<KPIs[]> => {
      if (!startDate || !endDate) return [];
      console.log("Called")
      const response = await axios.get(`/kpi?start_date=${startDate}&end_date=${endDate}`);
      console.log(response)
      return response.data;
    },
    enabled: !!startDate && !!endDate, // only run if dates exist
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useKpis;
