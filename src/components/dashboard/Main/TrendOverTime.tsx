"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useKpis } from "@/hooks/useKpi";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTabStore } from "@/stores/useTabStore";

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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data</p>;
  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <Tabs value={activeTab ?? ""} className="w-full h-[300px] overflow-hidden">
      <TabsList className="relative inline-flex bg-muted p-1 rounded-md overflow-hidden h-10">
        {/* Sliding indicator */}
        <motion.div
          className="absolute top-1 left-1 h-[calc(100%-0.5rem)] rounded-sm bg-gray-800 z-0 transition-all duration-300"
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
              activeTab === title ? "text-white" : "text-muted-foreground"
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
          className="h-[calc(100%-2.5rem)] pt-2"
        >
          <ChartContainer
            title={kpi.title}
            config={chartConfig}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={kpi.trend_data}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#d1d5db" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TrendOverTime;
