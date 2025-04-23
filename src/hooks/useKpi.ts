// hooks/useKpis.ts
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { useDateRangeStore } from '@/stores/useDateRangeStore';
import {useInsightsStore} from "@/stores/useInsightsStore"
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

export const useInsight = (metric: string) => {
  const { dateRange } = useDateRangeStore();
  const {
    comparisonLevel,
    selectedBrands,
    selectedProducts,
    selectedRegions,
    selectedStores
  } = useInsightsStore();
  
  const startDate = dateRange?.from?.toISOString().split('T')[0];
  const endDate = dateRange?.to?.toISOString().split('T')[0];

  return useQuery({
    queryKey: [
      'insights',
      metric,
      comparisonLevel,
      startDate,
      endDate,
      selectedRegions,
      selectedStores,
      selectedBrands,
      selectedProducts
    ],
    queryFn: async (): Promise<InsightResponse> => {
      if (!startDate) throw new Error('Start date is required');
      
      const params = new URLSearchParams({
        comparison_level: comparisonLevel,
        metric,
        start_date: startDate,
        ...(endDate && { end_date: endDate }),
        ...(selectedRegions?.length && { 
          selected_regions: JSON.stringify(selectedRegions) 
        }),
        ...(selectedStores?.length && { 
          selected_stores: JSON.stringify(selectedStores) 
        }),
        ...(selectedBrands?.length && { 
          selected_brands: JSON.stringify(selectedBrands) 
        }),
        ...(selectedProducts?.length && { 
          selected_products: JSON.stringify(selectedProducts) 
        }),
      });

      const response = await axios.get(`/kpi/insight?${params.toString()}`);
      return response.data;
    },
    enabled: !!startDate && !!comparisonLevel && !!metric,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    select: (data) => {
      // Transform data if needed
      return {
        ...data,
        data: data.data.map(item => ({
          ...item,
          // Format values if needed
          metric_value: formatMetricValue(item.metric_value, metric)
        }))
      };
    }
  });
};

// Helper function to format values based on metric type
const formatMetricValue = (value: number, metric: string) => {
  switch (metric) {
    case 'Total Sales':
    case 'Total Profit':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    default:
      return new Intl.NumberFormat().format(value);
  }
};

type InsightResponse = {
  data: Array<{
    comparison_value: string;
    metric_value: number;
    metric_name: string;
    percentage_change?: number;
    store_name?: string;
    product_name?: string;
  }>;
  meta: {
    comparison_level: string;
    metric: string;
    start_date: string;
    end_date: string | null;
    filter_counts: {
      regions: number;
      stores: number;
      brands: number;
      products: number;
    };
  };
};

export default useKpis;
