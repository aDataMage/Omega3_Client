"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useKpis } from "@/hooks/useKpi";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatChartDate } from "@/utils/fomartChartDate";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTabStore } from "@/stores/useTabStore";
import TOTSkelenton from "./TOTSkelenton";

const chartConfig = {
  value: {
    label: "Sales",
  },
} satisfies ChartConfig;

const TrendOverTime = () => {
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
  if (isError) return <p>Error loading data</p>;
  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <Tabs value={activeTab ?? ""} className="w-full h-[400px] overflow-hidden">
      <TabsList className="relative inline-flex  bg-muted p-1 rounded-md overflow-hidden h-10 shadow-xs shadow-accent/15">
        {/* Sliding indicator */}
        <motion.div
          className="absolute top-1 left-1 h-[calc(100%-0.5rem)] rounded-sm bg-primary z-0 transition-all duration-300"
          style={{
            width: triggerWidth,
            transform: `translateX(${offset}px)`,
          }}
        />

        {/* Tab triggers */}
        {kpiTitles.map((title, index) => (
          <button
            key={title}
            ref={(el) => (refs.current[index] = el)}
            onClick={() => setActiveTab(title)}
            className={cn(
              "relative z-10 px-4 py-1 transition-colors",
              activeTab === title
                ? "text-white dark:text-secondary-foreground"
                : "text-muted-foreground"
            )}
          >
            {title}
          </button>
        ))}
      </TabsList>

      {data.map((kpi) => (
        <TabsContent
          key={kpi.title}
          value={kpi.title}
          className="h-[calc(100%-2.5rem)] pt-4"
        >
          <ChartContainer
            title={kpi.title}
            config={chartConfig}
            className="h-full w-full"
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
                      stopColor="var(--chart-2)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="2 2"
                  stroke="var(--foreground)"
                  opacity={0.1}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value, activeTab)}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatChartDate} // Add this
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#d1d5db" }}
                  labelFormatter={formatChartDate} // Use the same formatter
                  formatter={(value) => [
                    formatCurrency(Number(value), activeTab),
                    chartConfig.value.label,
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  fill="url(#gradientFill)"
                  dot={{ r: 2 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TrendOverTime;
