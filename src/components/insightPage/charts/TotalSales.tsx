"use client";

import React from "react";
import { useInsight } from "@/hooks/useKpi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { formatChartDate } from "@/utils/fomartChartDate";
import { formatCurrency } from "@/utils/formatCurrency";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clipText } from "@/utils/clipText";
import getComparisonColor from "@/utils/getComparisonColor";

// Standard color palette (green for positive, red for negative)
const STANDARD_COLORS = {
  positive: "var(--color-chart-2)", // green
  negative: "var(--color-chart-5)", // red
};

// Inverted color palette for returns (red for positive, green for negative)
const INVERTED_COLORS = {
  positive: "var(--color-chart-5)", // red
  negative: "var(--color-chart-2)", // green
};

const METRICS = [
  { value: "Total Sales", label: "Sales" },
  { value: "Total Returns", label: "Returns" },
  { value: "Total Profit", label: "Profit" },
  { value: "Total Orders", label: "Orders" },
];

const calculateMomChange = (currentData: any[], index: number, key: string) => {
  if (!currentData || index === 0) return null;

  const currentValue = currentData[index][key] || 0;
  const previousValue = currentData[index - 1][key] || 0;

  if (previousValue === 0) return null;

  return ((currentValue - previousValue) / previousValue) * 100;
};

const TotalSales = () => {
  const [currentMetric, setCurrentMetric] = React.useState("Total Returns");
  const { data, isLoading, isError } = useInsight(currentMetric);

  const transformForMultiMetricChart = (
    trendData: {
      comparison_value: string;
      date: Date;
      metric_value: number;
    }[]
  ) => {
    const groupedData: Record<string, Record<string, number>> = {};

    trendData?.forEach((item) => {
      const dateKey = String(item.date);
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {};
      }
      groupedData[dateKey][item.comparison_value] = item.metric_value;
    });

    return Object.entries(groupedData).map(([date, values]) => ({
      date,
      name: formatChartDate(date),
      ...values,
    }));
  };

  const multiMetricChartData = transformForMultiMetricChart(data?.data.trend);

  const comparisonKeys = Array.from(
    new Set(
      multiMetricChartData?.flatMap((item) =>
        Object.keys(item).filter((k) => k !== "date" && k !== "name")
      ) || []
    )
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentIndex = multiMetricChartData.findIndex(
        (item) => item.name === label
      );

      const isReturns = currentMetric === "Total Returns";
      const colors = isReturns ? INVERTED_COLORS : STANDARD_COLORS;

      return (
        <div className="bg-background p-4 shadow-lg rounded-lg border border-border">
          <p className="font-semibold">{label}</p>
          <div className="space-y-2 mt-2">
            {payload.map((entry: any, index: number) => {
              const momChange = calculateMomChange(
                multiMetricChartData,
                currentIndex,
                entry.dataKey
              );

              // Determine if change is positive/negative based on metric type
              const isPositive =
                momChange !== null
                  ? isReturns
                    ? momChange < 0
                    : momChange >= 0
                  : true;

              const changeColor = isPositive
                ? colors.positive
                : colors.negative;
              const changeSymbol = isPositive ? "↑" : "↓";

              return (
                <div key={`tooltip-${index}`}>
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-muted-foreground">{entry.name}:</span>
                    <span className="ml-2 font-medium">
                      {formatCurrency(entry.value, currentMetric)}
                    </span>
                  </div>
                  {momChange !== null && (
                    <div className="ml-5 text-xs mt-1">
                      <span style={{ color: changeColor }}>
                        {changeSymbol} {Math.abs(momChange).toFixed(1)}% MoM
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full p-4 bg-muted/70 rounded-lg">
      <Tabs value={currentMetric} onValueChange={setCurrentMetric}>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {comparisonKeys.map((key, index) => (
                <div key={key} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: getComparisonColor(index) }}
                  />
                  <span className="text-sm flex text-muted-foreground">
                    {clipText(key)}:
                  </span>
                  <span className="ml-1 font-medium">
                    {formatCurrency(
                      multiMetricChartData?.reduce(
                        (sum, item) => sum + (item[key] || 0),
                        0
                      ) || 0,
                      currentMetric
                    )}
                  </span>
                </div>
              ))}
            </div>
            <TabsList>
              {METRICS.map((metric) => (
                <TabsTrigger
                  // className="data-[state=active]:bg-primary dark:data-[state=active]:text-foreground"
                  key={metric.value}
                  value={metric.value}
                >
                  {metric.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {METRICS.map((metric) => (
          <TabsContent key={metric.value} value={metric.value}>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={multiMetricChartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    {comparisonKeys.map((key, index) => {
                      const safeId = `color-${key
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`;
                      return (
                        <linearGradient
                          key={`gradient-${safeId}`}
                          id={`color${safeId}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={getComparisonColor(index)}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={getComparisonColor(index)}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      );
                    })}
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted-foreground/10"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    className="fill-muted-foreground"
                    axisLine={{ className: "stroke-muted-foreground" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    className="fill-muted-foreground"
                    axisLine={{ className: "stroke-muted-foreground" }}
                    tickFormatter={(value) =>
                      formatCurrency(value, currentMetric)
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {comparisonKeys.map((key, index) => {
                    const safeId = `color-${key
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`;
                    return (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        name={key}
                        stroke={getComparisonColor(index)}
                        fill={`url(#color${safeId})`}
                        strokeWidth={2}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                    );
                  })}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TotalSales;
