"use client";

import { useState, useRef, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useKpis } from "@/hooks/useKpi";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatChartDate } from "@/utils/fomartChartDate";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTabStore } from "@/stores/useTabStore";
import TrendSkeleton from "./trend-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Helper function to calculate month-over-month change
const calculateMomChange = (currentData: any[], index: number, key: string) => {
  if (!currentData || index <= 0) return null;

  const currentValue = currentData[index][key] || 0;
  const previousValue = currentData[index - 1][key] || 0;

  if (previousValue === 0) return null;

  return ((currentValue - previousValue) / previousValue) * 100;
};

// Custom tooltip component for better organization
const CustomTooltip = ({ active, payload, label, kpiData, activeTab }: any) => {
  if (!(active && payload && payload.length)) return null;

  const currentIndex = kpiData.trend_data.findIndex(
    (item: any) => item.date === label
  );
  const momChange = calculateMomChange(
    kpiData.trend_data,
    currentIndex,
    "value"
  );
  const isReturns = activeTab === "Total Returns";
  const isPositive =
    momChange !== null ? (isReturns ? momChange < 0 : momChange >= 0) : true;
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
      <p className="font-semibold text-sm">{formatChartDate(label)}</p>
      <div className="flex items-center mt-2">
        <div className="w-2 h-2 rounded-full bg-chart-2 mr-2" />
        <span className="text-muted-foreground text-sm">{kpiData.title}:</span>
        <span className="ml-2 font-medium">
          {formatCurrency(payload[0].value, activeTab)}
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
};

export default function TrendOverTime() {
  const { data, isLoading, isError } = useKpis();
  const { activeTab, setActiveTab } = useTabStore();

  const kpiTitles = data?.map((kpi) => kpi.metric_name) ?? [];

  const [offset, setOffset] = useState(0);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Set initial active tab if none is selected
  useEffect(() => {
    if (kpiTitles.length > 0 && activeTab === null) {
      setActiveTab(kpiTitles[0]);
    }
  }, [kpiTitles, activeTab, setActiveTab]);

  // Update the sliding indicator position when active tab changes
  useEffect(() => {
    if (!activeTab) return;

    const index = kpiTitles.indexOf(activeTab);
    if (index === -1) return;

    const el = refs.current[index];
    if (el) {
      setOffset(el.offsetLeft);
      setTriggerWidth(el.offsetWidth);
    }
  }, [activeTab, kpiTitles]);

  if (isLoading) return <TrendSkeleton />;
  if (isError)
    return (
      <div className="text-destructive p-4">Failed to load trend data</div>
    );
  if (!data || data.length === 0)
    return (
      <div className="text-muted-foreground p-4">No trend data available</div>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab ?? ""} className="w-full h-[400px]">
          <div className="flex flex-col gap-4 mb-4">
            <TabsList className="relative inline-flex bg-muted p-1 rounded-lg h-10">
              {/* Animated sliding indicator */}
              {triggerWidth > 0 && (
                <motion.div
                  className="absolute top-1 left-1 h-[calc(100%-0.5rem)] rounded-md bg-primary z-0"
                  style={{ width: triggerWidth }}
                  animate={{ x: offset }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

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
                  aria-selected={activeTab === title}
                  role="tab"
                >
                  {title}
                </button>
              ))}
            </TabsList>
          </div>

          {data.map((kpi) => (
            <TabsContent
              key={kpi.metric_name}
              value={kpi.metric_name}
              className="h-[calc(100%-2.5rem)] mt-4"
              role="tabpanel"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={kpi.trend_data}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <defs>
                    <linearGradient
                      id="gradientFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
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
                    content={(props) => (
                      <CustomTooltip
                        {...props}
                        kpiData={kpi}
                        activeTab={activeTab}
                      />
                    )}
                  />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                    fill="url(#gradientFill)"
                    fillOpacity={1}
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
      </CardContent>
    </Card>
  );
}
