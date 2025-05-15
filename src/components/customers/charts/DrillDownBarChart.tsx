"use client";
import { useDrillDown } from "@/stores/useDrillDown";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatValue } from "@/utils/formatValue";
import getComparisonColor from "@/utils/getComparisonColor";
import { useTabStore } from "@/stores/useCustomerTabStore";

interface CustomerSegment {
  data: {
    comparison: Array<{
      compare_value: string;
      data: Array<{ name: string; value: number }>;
    }>;
    general: Array<{ name: string; value: number }>;
  };
}

function formatYaxisLabel(value: string) {
  console.log(value);
  if (value.includes(".")) {
    return String(value).split(".")[1].toUpperCase().replace(/_/g, " ");
  }
  return value;
}

const COLORS = ["#0d9488", "#0891b2", "#0e7490", "#155e75", "#164e63"];

const DrillDownBarChartWrapper = ({
  data,
}: {
  data: CustomerSegment | undefined;
}) => {
  const { drillDown, setDrillDown } = useDrillDown();
  const { activeTab } = useTabStore();

  const totals = drillDown
    ? data.data.comparison.reduce((acc, comp) => {
        comp.data.forEach((item) => {
          acc[item.name] = (acc[item.name] || 0) + item.value;
        });
        return acc;
      }, {} as Record<string, number>)
    : {};

  console.log(totals);

  // Format data for stacked chart when drilled down
  const stackedData = drillDown
    ? data.data.comparison[0]?.data.map((item, index) => {
        const row: Record<string, any> = { name: item.name };
        data.data.comparison.forEach((comp) => {
          row[comp.compare_value] = comp.data[index].value;
        });
        return row;
      })
    : null;

  const comparisonKeys = drillDown
    ? data.data.comparison.map((comp) => comp.compare_value)
    : [];

  const formatType =
    activeTab === "Average Revenue per Customer"
      ? "currency"
      : activeTab === "Repeat Customer Rate"
      ? "percent"
      : "integer"; // Adjust based on your metric

  return (
    <ResponsiveContainer width="100%" height="100%">
      {drillDown ? (
        // Stacked Bar Chart when drilled down
        <BarChart
          data={stackedData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <XAxis
            type="number"
            tickFormatter={(e) => formatValue(e, formatType)}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={80}
            tick={{ fontSize: 12 }}
            tickFormatter={formatYaxisLabel}
          />
          <Tooltip
            content={
              <CustomTooltip
                formatType={formatType}
                isDrilledDown={drillDown}
                totalValues={totals}
              />
            }
          />
          {comparisonKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={getComparisonColor(index)}
              name={key}
              radius={index == 2 ? [0, 6, 6, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      ) : (
        // Regular Bar Chart when not drilled down
        <BarChart
          data={data.data.general}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <XAxis
            type="number"
            tickFormatter={(e) => formatValue(e, formatType)}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={80}
            tick={{ fontSize: 12 }}
            tickFormatter={formatYaxisLabel}
          />
          <Tooltip
            content={
              <CustomTooltip
                formatType={formatType}
                isDrilledDown={drillDown}
                totalValues={totals}
              />
            }
          />
          <Bar dataKey="value" name="Value" radius={[0, 6, 6, 0]}>
            {data.data.general.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="var(--color-chart-2)" />
            ))}
          </Bar>
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};

export default DrillDownBarChartWrapper;

const CustomTooltip = ({
  active,
  payload,
  label,
  formatType = "integer",
  isDrilledDown = false,
  totalValues = {},
}: {
  active: boolean;
  payload: any[];
  label: string;
  formatType?: "currency" | "percent" | "integer";
  isDrilledDown?: boolean;
  totalValues?: Record<string, number>;
}) => {
  console.log(payload);
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-4 shadow-lg rounded-lg border border-border">
        <p className="font-semibold mb-2">{formatYaxisLabel(label)}</p>
        <div className="space-y-3">
          {isDrilledDown ? (
            // Drill-down tooltip with percentage breakdown
            <>
              <div className="text-sm font-medium">
                Total:{" "}
                {formatValue(
                  payload.reduce((sum, entry) => sum + entry.value, 0),
                  formatType
                )}
              </div>
              {payload.map((entry, index) => {
                const percentage = totalValues[label]
                  ? ((entry.value / totalValues[label]) * 100).toFixed(1) + "%"
                  : "N/A";

                return (
                  <div key={`tooltip-${index}`} className="flex flex-col">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-muted-foreground">
                        {formatYaxisLabel(entry.name)}:
                      </span>
                      <span className="ml-2 font-medium">
                        {formatValue(entry.value, formatType)}
                      </span>
                    </div>
                    <div className="ml-5 text-xs text-muted-foreground">
                      {percentage} of total
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            // Regular tooltip for general view
            payload.map((entry, index) => (
              <div key={`tooltip-${index}`} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">Value:</span>
                <span className="ml-2 font-medium">
                  {formatValue(entry.value, formatType)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
  return null;
};
