"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { formatChartDate } from "@/utils/fomartChartDate";
import { useTabStore } from "@/stores/useCustomerTabStore";
import { useCustomerTrend } from "@/hooks/useKpi";
import { formatValue } from "@/utils/formatValue";
import { Skeleton } from "../ui/skeleton";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import getComparisonColor from "@/utils/getComparisonColor";
import { useDrillDown } from "@/stores/useDrillDown";

interface CustomerTrend {
  name: string;
  trend: { period: string; value: number }[];
}

const CustomerTrendChart = () => {
  const { drillDown, setDrillDown } = useDrillDown();
  const { activeTab } = useTabStore();
  const { data, isLoading } = useCustomerTrend(activeTab);
  const toggleDrill = () => setDrillDown(!drillDown);

  if (isLoading) {
    return (
      <div className="p-6 bg-muted/50 rounded-lg w-full">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const general = data?.data.find((d) => d.name === "general");
  const comparisons = data?.data.filter((d) => d.name !== "general");

  // Transform for Recharts
  const transformGeneral = general?.trend.map((item) => ({
    name: formatChartDate(item.period),
    value: item.value,
  }));

  const transformComparison = comparisons[0]?.trend.map((_, i) => {
    const row: Record<string, any> = {
      name: formatChartDate(comparisons[0].trend[i].period),
    };
    comparisons.forEach((comp) => {
      row[comp.name] = comp.trend[i].value;
    });
    return row;
  });

  const comparisonKeys = comparisons.map((c) => c.name);

  const formatType =
    activeTab === "Average Revenue per Customer"
      ? "currency"
      : activeTab === "Repeat Customer Rate"
      ? "percent"
      : "integer";

  // Custom legend formatter
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 bg-muted/50 h-full backdrop-blur-md rounded-lg w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {activeTab} Trend
          </h2>
          <p className="text-sm text-muted-foreground">
            {drillDown ? "Detailed comparison view" : "Overall trend"}
          </p>
        </div>
        <Button
          onClick={toggleDrill}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
        >
          {drillDown ? (
            <div className="flex gap-2 items-center-safe">
              <ArrowUpNarrowWide /> <span>Drill UP</span>{" "}
            </div>
          ) : (
            <div className="flex gap-2 items-center-safe">
              <ArrowDownWideNarrow />
              <span>Drill Down</span>
            </div>
          )}
        </Button>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={drillDown ? transformComparison : transformGeneral}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {drillDown ? (
                comparisonKeys.map((key, index) => {
                  const safeId = key.replace(/\s+/g, "-").toLowerCase();
                  const color = getComparisonColor(index);
                  return (
                    <linearGradient
                      key={safeId}
                      id={`color-${safeId}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  );
                })
              ) : (
                <linearGradient
                  key="value"
                  id="color-value"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={"var(--color-chart-2)"}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={"var(--color-chart-2)"}
                    stopOpacity={0}
                  />
                </linearGradient>
              )}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted-foreground/10"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 12, fontFamily: "poppins" }}
              tickMargin={10}
              tickSize={4}
            />
            <YAxis
              tickFormatter={(value) => formatValue(value, formatType)}
              tick={{ fill: "#64748b", fontSize: 12, fontFamily: "poppins" }}
              tickMargin={10}
              width={80}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background p-4 border rounded-lg shadow-sm">
                      <p className="font-medium text-foreground">{label}</p>
                      <div className="space-y-1 mt-2">
                        {payload.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm text-muted-foreground">
                                {item.name?.toString().split(".").pop()}:{" "}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {formatValue(item?.value, formatType)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {drillDown ? (
              comparisonKeys.map((key, index) => {
                const color = getComparisonColor(index);
                const safeId = key.replace(/\s+/g, "-").toLowerCase();
                return (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={color}
                    fill={`url(#color-${safeId})`}
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                );
              })
            ) : (
              <Area
                key={"value"}
                type="monotone"
                dataKey={"value"}
                stroke={"var(--color-chart-2)"}
                fill={`url(#color-value)`}
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            )}
            {/* Single legend at the bottom */}
            <Legend content={renderLegend} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerTrendChart;
