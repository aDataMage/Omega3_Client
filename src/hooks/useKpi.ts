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

export const useCustomerMetrics = () => {
  const { dateRange } = useDateRangeStore();
  const { appliedFilters } = useInsightsStore();

  const startDate = dateRange?.from?.toISOString().split("T")[0];
  const endDate = dateRange?.to?.toISOString().split("T")[0];

  return useQuery({
    queryKey: [
      "customer-metrics",
      startDate,
      endDate,
      appliedFilters.selectedRegions,
      appliedFilters.selectedBrands,
      appliedFilters.selectedProducts,
      appliedFilters.selectedStores,
      appliedFilters.comparisonLevel,
    ],
    queryFn: async (): Promise<CustomerMetricsResponse> => {
      if (!startDate) throw new Error("Start date is required");

      // Create URLSearchParams
      const params = new URLSearchParams({
        comparison_level: appliedFilters.comparisonLevel,
        start_date: startDate,
      });

      // Add optional parameters
      if (endDate) params.append("end_date", endDate);

      // Helper function to handle array parameters
      const addArrayParam = (key: string, values: string[] | undefined) => {
        if (values?.length) {
          values.forEach((value) => params.append(key, value));
        }
      };

      addArrayParam("selected_regions", appliedFilters.selectedRegions);
      addArrayParam("selected_stores", appliedFilters.selectedStores);
      addArrayParam("selected_brands", appliedFilters.selectedBrands);
      addArrayParam("selected_products", appliedFilters.selectedProducts);

      const response = await axios.get(
        `/kpi/customer_metrics?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!startDate && !!appliedFilters.comparisonLevel,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    select: (data) => {
      // Transform the data into a more convenient format if needed
      return {
        ...data,
        metricsMap: data.data.reduce(
          (acc: Record<string, CustomerMetric>, metric) => {
            acc[metric.metric_name] = metric;
            return acc;
          },
          {}
        ),
      };
    },
  });
};

export const useCustomerTrend = (metricName: string) => {
  const { dateRange } = useDateRangeStore();
  const { appliedFilters } = useInsightsStore();

  const startDate = dateRange?.from?.toISOString().split("T")[0];
  const endDate = dateRange?.to?.toISOString().split("T")[0];

  return useQuery({
    queryKey: [
      "customer-trend",
      metricName,
      startDate,
      endDate,
      appliedFilters.selectedRegions,
      appliedFilters.selectedBrands,
      appliedFilters.selectedProducts,
      appliedFilters.selectedStores,
      appliedFilters.comparisonLevel,
    ],
    queryFn: async (): Promise<CustomerTrendResponse> => {
      if (!startDate) throw new Error("Start date is required");

      const params = new URLSearchParams({
        metric_name: metricName,
        start_date: startDate,
      });

      if (endDate) params.append("end_date", endDate);
      if (appliedFilters.comparisonLevel)
        params.append("comparison_level", appliedFilters.comparisonLevel);

      const addArrayParam = (key: string, values: string[] | undefined) => {
        if (values?.length) {
          values.forEach((value) => params.append(key, value));
        }
      };

      addArrayParam("selected_regions", appliedFilters.selectedRegions);
      addArrayParam("selected_stores", appliedFilters.selectedStores);
      addArrayParam("selected_brands", appliedFilters.selectedBrands);
      addArrayParam("selected_products", appliedFilters.selectedProducts);

      const response = await axios.get(
        `/kpi/customer_trend?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!metricName && !!startDate,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
export const useCustomerSegment = (metricName: string, segmentName: string) => {
  const { dateRange } = useDateRangeStore();
  const { appliedFilters } = useInsightsStore();

  const startDate = dateRange?.from?.toISOString().split("T")[0];
  const endDate = dateRange?.to?.toISOString().split("T")[0];

  return useQuery({
    queryKey: [
      "customer-segment",
      metricName,
      segmentName,
      startDate,
      endDate,
      appliedFilters.selectedRegions,
      appliedFilters.selectedBrands,
      appliedFilters.selectedProducts,
      appliedFilters.selectedStores,
      appliedFilters.comparisonLevel,
    ],
    queryFn: async (): Promise<CustomerSegment> => {
      if (!startDate) throw new Error("Start date is required");

      const params = new URLSearchParams({
        metric_name: metricName,
        segment_name: segmentName,
        start_date: startDate,
      });

      if (endDate) params.append("end_date", endDate);
      if (appliedFilters.comparisonLevel)
        params.append("comparison_level", appliedFilters.comparisonLevel);

      const addArrayParam = (key: string, values: string[] | undefined) => {
        if (values?.length) {
          values.forEach((value) => params.append(key, value));
        }
      };

      addArrayParam("selected_regions", appliedFilters.selectedRegions);
      addArrayParam("selected_stores", appliedFilters.selectedStores);
      addArrayParam("selected_brands", appliedFilters.selectedBrands);
      addArrayParam("selected_products", appliedFilters.selectedProducts);

      const response = await axios.get(
        `/kpi/customer_segment?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!metricName && !!startDate,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

interface CustomerMetric {
  metric_name: string;
  total_value: number;
  comparisons: Array<{
    name: string;
    value: number;
  }>;
}

interface CustomerMetricsResponse {
  data: CustomerMetric[];
  meta: {
    comparison_level: string;
    start_date: string;
    end_date: string;
    filter_counts: {
      regions: number;
      stores: number;
      brands: number;
      products: number;
    };
    metrics_returned: string[];
  };
}

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

type CustomerTrend = {
  name: string;
  trend: { period: string; value: number }[];
};

type CustomerTrendResponse = {
  data: CustomerTrend[];
};

interface CustomerSegment {
  data: {
    comparison: Array<{
      compare_value: string;
      data: Array<{ name: string; value: number }>;
    }>;
    general: Array<{ name: string; value: number }>;
  };
}

export default useKpis;
