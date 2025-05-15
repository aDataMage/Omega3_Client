"use client";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { formatValue } from "@/utils/formatValue";
import { useDrillDown } from "@/stores/useDrillDown";
import { useTabStore } from "@/stores/useCustomerTabStore";

interface GenderData {
  data: {
    general: Array<{ name: string; value: number }>;
    comparison: Array<{
      compare_value: string;
      data: Array<{ name: string; value: number }>;
    }>;
  };
}

// Base colors for each region with darker and lighter variants
const REGION_COLORS = {
  Male: {
    base: "#3b82f6", // blue-500
    shades: ["#1d4ed8", "#3b82f6", "#93c5fd"], // blue-700, blue-500, blue-300
  },
  Female: {
    base: "#ec4899", // pink-500
    shades: ["#be185d", "#ec4899", "#f9a8d4"], // pink-700, pink-500, pink-300
  },
  Other: {
    base: "#8b5cf6", // violet-500
    shades: ["#6d28d9", "#8b5cf6", "#c4b5fd"], // violet-700, violet-500, violet-300
  },
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  const { activeTab } = useTabStore();
  const formatType =
    activeTab === "Average Revenue per Customer"
      ? "currency"
      : activeTab === "Repeat Customer Rate"
      ? "percent"
      : "integer";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        className="font-semibold"
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="var(--foreground)"
        className="text-sm"
      >
        {formatValue(value, formatType)}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="var(--muted-foreground)"
        className="text-xs"
      >
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

const GenderPieChart = ({
  data,
  activeIndex,
  onPieEnter,
  colors,
  title,
}: {
  data: Array<{ name: string; value: number }>;
  activeIndex: number;
  onPieEnter: (data: any, index: number) => void;
  colors: string[];
  title: string;
}) => {
  return (
    <div
      className="flex flex-col items-center h-full"
      style={{ minWidth: "450px" }}
    >
      <h3 className="text-center font-medium mb-2">{title.split(".")[1]}</h3>
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={onPieEnter}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DrillDownPieChart = ({ data }: { data: GenderData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { drillDown } = useDrillDown();

  // Track active indices for each drill-down chart
  const [drillDownIndices, setDrillDownIndices] = useState<number[]>(
    Array(data.data.comparison.length).fill(0)
  );

  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handleDrillDownPieEnter =
    (chartIndex: number) => (_: any, index: number) => {
      const newIndices = [...drillDownIndices];
      newIndices[chartIndex] = index;
      setDrillDownIndices(newIndices);
    };

  if (drillDown) {
    return (
      <div className="w-full h-full flex flex-col items-center">
        <div className="grid grid-cols-3 gap-4 p-4 place-items-center">
          {data.data.comparison.map((genderData, index) => {
            const regionColor = REGION_COLORS[
              genderData.compare_value as keyof typeof REGION_COLORS
            ] || { base: "#64748b", shades: ["#475569", "#64748b", "#94a3b8"] };

            return (
              <GenderPieChart
                key={genderData.compare_value}
                data={genderData.data}
                activeIndex={drillDownIndices[index]}
                onPieEnter={handleDrillDownPieEnter(index)}
                colors={["#3b82f6", "#ec4899", "#8b5cf6"]}
                title={genderData.compare_value}
              />
            );
          })}
        </div>
        <div className="flex justify-center mt-4">
          <div className="bg-background p-2 rounded-lg border shadow-sm">
            <div className="flex flex-wrap justify-center gap-4">
              {data.data.general.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: ["#3b82f6", "#ec4899", "#8b5cf6"][
                        index % 3
                      ],
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // General view - single pie chart with region base colors
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <GenderPieChart
        data={data.data.general}
        activeIndex={activeIndex}
        onPieEnter={handlePieEnter}
        colors={["#3b82f6", "#ec4899", "#8b5cf6"]}
        title="Gender Distribution"
      />
      <div className="flex justify-center mt-4">
        <div className="bg-background p-2 rounded-lg border shadow-sm">
          <div className="flex flex-wrap justify-center gap-4">
            {data.data.general.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: ["#3b82f6", "#ec4899", "#8b5cf6"][
                      index % 3
                    ],
                  }}
                />
                <span className="text-xs text-muted-foreground">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrillDownPieChart;
