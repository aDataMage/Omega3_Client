"use client";
import React from "react";
import { Customers_Metrics } from "@/types/kpi";
import { cn } from "@/lib/utils";
import { formatValue } from "@/utils/formatValue";
import { clipText } from "@/utils/clipText";
import { useTabStore } from "@/stores/useCustomerTabStore";
import getComparisonColor from "@/utils/getComparisonColor";
import { useDrillDown } from "@/stores/useDrillDown";

const KpiCard = ({
  data: { comparisons, metric_name, total_value },
}: Customers_Metrics) => {
  const { setActiveTab, activeTab } = useTabStore();
  const { drillDown } = useDrillDown();
  // Determine the formatting type based on metric name
  const formatType =
    metric_name === "Average Revenue per Customer"
      ? "currency"
      : metric_name === "Repeat Customer Rate"
      ? "percent"
      : "integer";

  const isActive = activeTab === metric_name;

  const handleClick = () => {
    if (!isActive && metric_name !== "Repeat Customer Rate") {
      setActiveTab(metric_name);
    }
  };

  return (
    <div
      className={cn(
        "w-full h-full p-4 rounded-md shadow bg-muted/50 transition-all duration-200 border",
        "flex flex-col",
        isActive
          ? "border-2 border-primary"
          : metric_name !== "Repeat Customer Rate"
          ? "hover:bg-muted hover:border-primary/50 cursor-pointer"
          : ""
      )}
      onClick={handleClick}
      aria-current={isActive ? "true" : "false"}
    >
      <div className="">
        <div className="">
          <div className="text-sm font-medium text-foreground line-clamp-2 min-h-[2.5rem]">
            {metric_name}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-end justify-between">
            <h2
              className={cn(
                "text-3xl font-bold tracking-tight break-all",
                metric_name === "Average Revenue per Customer" && "text-2xl",
                isActive &&
                  metric_name !== "Repeat Customer Rate" &&
                  "text-primary" // Highlight active tab value
              )}
            >
              {formatValue(total_value, formatType)}
            </h2>
          </div>
        </div>
      </div>
      <div className="w-full h-full pt-4">
        <div className="w-full h-full justify-between flex flex-col items-center space-y-2">
          {comparisons.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-1 w-full"
            >
              <div className="flex w-full items-center gap-1">
                <p
                  className={cn(
                    "text-xs text-muted-foreground font-light truncate max-w-[60%]"
                  )}
                >
                  {clipText(item.name.split(".").pop(), 2)}
                </p>
                <div
                  className={cn(
                    "size-2 rounded-full",
                    isActive && drillDown
                      ? getComparisonColor(index, "bg")
                      : isActive && !drillDown
                      ? "text-primary"
                      : ""
                  )}
                ></div>
              </div>
              <p
                className={cn(
                  "text-xs font-mono whitespace-nowrap",
                  isActive && drillDown
                    ? getComparisonColor(index, "text")
                    : "text-foreground"
                )}
              >
                {formatValue(item.value, formatType)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(KpiCard);
