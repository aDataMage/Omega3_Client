// hooks/useKpis.ts
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useDateRangeStore } from "@/stores/useDateRangeStore";
import useInsightsStore from "@/stores/useInsightsStore";
import { KPIs } from "@/types/kpi";

export const useKpis = () => {
  const { dateRange } = useDateRangeStore();

  const startDate = dateRange?.from?.toISOString().split("T")[0];
  const endDate = dateRange?.to?.toISOString().split("T")[0];

  return useQuery({
    queryKey: ["kpis", startDate, endDate],
    queryFn: async (): Promise<KPIs[]> => {
      if (!startDate || !endDate) return [];
      console.log("Called");
      const response = await axios.get(
        `/kpi?start_date=${startDate}&end_date=${endDate}`
      );
      console.log(response);
      return response.data;
    },
    enabled: !!startDate && !!endDate, // only run if dates exist
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// hooks/useKpis.ts
export const useInsight = (metric: string) => {
  const { dateRange } = useDateRangeStore();
  const { appliedFilters } = useInsightsStore();

  const startDate = dateRange?.from?.toISOString().split("T")[0];
  const endDate = dateRange?.to?.toISOString().split("T")[0];

  return useQuery({
    queryKey: [
      "insights",
      metric,
      startDate,
      endDate,
      appliedFilters.selectedRegions,
      appliedFilters.selectedBrands,
      appliedFilters.selectedProducts,
      appliedFilters.selectedStores,
      appliedFilters.comparisonLevel,
    ],
    queryFn: async (): Promise<InsightResponse> => {
      if (!startDate) throw new Error("Start date is required");

      // Create URLSearchParams
      const params = new URLSearchParams({
        comparison_level: appliedFilters.comparisonLevel,
        metric,
        start_date: startDate,
      });

      // Add optional parameters
      if (endDate) params.append("end_date", endDate);

      // Handle array parameters properly
      const addArrayParam = (key: string, values: string[] | undefined) => {
        if (values?.length) {
          values.forEach((value) => params.append(key, value));
        }
      };

      addArrayParam("selected_regions", appliedFilters.selectedRegions);
      addArrayParam("selected_stores", appliedFilters.selectedStores);
      addArrayParam("selected_brands", appliedFilters.selectedBrands);
      addArrayParam("selected_products", appliedFilters.selectedProducts);

      const response = await axios.get(`/kpi/insight?${params.toString()}`);
      console.log(response);
      return response.data;
    },
    enabled: !!startDate && !!appliedFilters.comparisonLevel && !!metric,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

// Helper function to format values based on metric type
const formatMetricValue = (value: number, metric: string) => {
  switch (metric) {
    case "Total Sales":
    case "Total Profit":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    default:
      return new Intl.NumberFormat().format(value);
  }
};

type InsightResponse = {
  data: {
    summary: Array<{
      comparison_value: string;
      metric_value: number;
      metric_name: string;
      percentage_change?: number;
      store_name?: string;
      product_name?: string;
    }>;
    trend: Array<{
      comparison_value: string;
      date: Date;
      metric_value: number;
    }>;
  };
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
