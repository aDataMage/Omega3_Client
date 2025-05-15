"use client";

import React from "react";
import KpiCard from "./kpi-card";
import { useKpis } from "@/hooks/useKpi";
import KpiCardSkeleton from "./kpi-card-skeleton";
import { useTabStore } from "@/stores/useTabStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const KpiCardList = () => {
  const { data, isLoading, isError, error } = useKpis();
  const { activeTab } = useTabStore();

  // Handle loading state
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        aria-busy="true"
        aria-label="Loading KPI data"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <KpiCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Failed to load KPI data. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No data available</AlertTitle>
        <AlertDescription>
          There are no KPIs to display at this time.
        </AlertDescription>
      </Alert>
    );
  }

  // Render KPI cards
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      aria-label="KPI metrics"
    >
      {data.map((kpi) => (
        <KpiCard
          key={kpi.metric_name}
          active={kpi.metric_name === activeTab}
          kpi={kpi}
        />
      ))}
    </div>
  );
};

export default React.memo(KpiCardList);
