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
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useKpis } from "@/hooks/useKpi";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatChartDate } from "@/utils/fomartChartDate";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTabStore } from "@/stores/useTabStore";
import TOTSkelenton from "./TOTSkelenton";

const METRICS = [
  { value: "Total Sales", label: "Sales" },
  { value: "Total Returns", label: "Returns" },
  { value: "Total Profit", label: "Profit" },
  { value: "Total Orders", label: "Orders" },
];

const calculateMomChange = (currentData: any[], index: number, key: string) => {
  if (!currentData || index <= 0) return null;

  const currentValue = currentData[index][key] || 0;
  const previousValue = currentData[index - 1][key] || 0;

  if (previousValue === 0) return null;

  return ((currentValue - previousValue) / previousValue) * 100;
};

const TrendOverTime2 = () => {
  const { data, isLoading, isError } = useKpis();
  const { activeTab, setActiveTab } = useTabStore();

  const kpiTitles = data?.map((kpi) => kpi.title) ?? [];

  const [offset, setOffset] = useState(0);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (kpiTitles.length > 0 && activeTab === null) {
      setActiveTab(kpiTitles[0]);
    }
  }, [kpiTitles, activeTab]);

  useEffect(() => {
    const index = kpiTitles.indexOf(activeTab!);
    const el = refs.current[index];
    if (el) {
      setOffset(el.offsetLeft);
      setTriggerWidth(el.offsetWidth);
    }
  }, [activeTab, kpiTitles]);

  if (isLoading) return <TOTSkelenton />;
  if (isError) return <p className="text-destructive">Error loading data</p>;
  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <div className="w-full p-4 bg-muted/20 shadow-primary/10 shadow-inner  rounded-lg">
      <Tabs
        value={activeTab ?? ""}
        className="w-full h-[400px] overflow-hidden"
      >
        <div className="flex flex-col gap-4 mb-4">
          <TabsList className="relative inline-flex bg-muted p-1 rounded-lg h-10">
            {/* Sliding indicator */}
            <motion.div
              className="absolute top-1 left-1 h-[calc(100%-0.5rem)] rounded-md bg-primary z-0"
              style={{
                width: triggerWidth,
                transform: `translateX(${offset}px)`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            {/* Tab triggers */}
            {kpiTitles.map((title, index) => (
              <button
                key={title}
                ref={(el) => (refs.current[index] = el)}
                onClick={() => setActiveTab(title)}
                className={cn(
                  "relative z-10 px-4 py-1 text-sm font-medium transition-colors",
                  activeTab === title
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {title}
              </button>
            ))}
          </TabsList>
        </div>

        {data.map((kpi) => (
          <TabsContent
            key={kpi.title}
            value={kpi.title}
            className="h-[calc(100%-2.5rem)] mt-4"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={kpi.trend_data}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-chart-2)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-chart-2)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted-foreground/10"
                  vertical={false}
                />

                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ className: "stroke-muted-foreground" }}
                  className="fill-muted-foreground"
                  tickFormatter={(value) => formatCurrency(value, activeTab)}
                />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  className="fill-muted-foreground"
                  axisLine={{ className: "stroke-muted-foreground" }}
                  tickFormatter={formatChartDate}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const currentIndex = kpi.trend_data.findIndex(
                        (item) => item.date === label
                      );
                      const momChange = calculateMomChange(
                        kpi.trend_data,
                        currentIndex,
                        "value"
                      );
                      const isReturns = activeTab === "Total Returns";
                      const isPositive =
                        momChange !== null
                          ? isReturns
                            ? momChange < 0
                            : momChange >= 0
                          : true;
                      const changeColor = isPositive
                        ? isReturns
                          ? "var(--color-chart-5)"
                          : "var(--color-chart-2)"
                        : isReturns
                        ? "var(--color-chart-2)"
                        : "var(--color-chart-5)";
                      const changeSymbol = isPositive ? "↑" : "↓";

                      return (
                        <div className="bg-background p-4 shadow-lg rounded-lg border border-border">
                          <p className="font-semibold text-sm">{label}</p>
                          <div className="flex items-center mt-2">
                            <div className="w-2 h-2 rounded-full bg-chart-2 mr-2" />
                            <span className="text-muted-foreground text-sm">
                              {kpi.title}:
                            </span>
                            <span className="ml-2 font-medium">
                              {formatCurrency(payload[0].value, activeTab)}
                            </span>
                          </div>
                          {momChange !== null && (
                            <div className="ml-5 text-xs mt-1">
                              <span style={{ color: changeColor }}>
                                {changeSymbol} {Math.abs(momChange).toFixed(1)}%
                                MoM
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  fill="url(#gradientFill)"
                  dot={{
                    r: 2,
                    stroke: "var(--color-chart-2)",
                    fill: "var(--background)",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 5,
                    stroke: "var(--color-chart-2)",
                    fill: "var(--background)",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TrendOverTime2;
