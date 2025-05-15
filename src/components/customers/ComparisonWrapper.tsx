"use client";
import { useCustomerSegment } from "@/hooks/useKpi";
import { useTabStore } from "@/stores/useCustomerTabStore";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { formatValue } from "@/utils/formatValue";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from "lucide-react";
import AgeChart from "./charts/DrillDownBarChart";
import { Button } from "../ui/button";
import { useDrillDown } from "@/stores/useDrillDown";
import DrillDownPieChartWrapper from "./charts/DrillDownPieChart";
import DrillDownBarChartWrapper from "./charts/DrillDownBarChart";

const COLORS = ["#0d9488", "#0891b2", "#0e7490", "#155e75"];

type SegmentSelect =
  | "age"
  | "gender"
  | "income_bracket"
  | "marital_status"
  | "education_level"
  | "employment_status";

const SegmentOptions: Record<string, SegmentSelect> = {
  Age: "age",
  Gender: "gender",
  Income: "income_bracket",
  "Marital Status": "marital_status",
  "Education Level": "education_level",
  "Employment Status": "employment_status",
};

const CustomerSegmentChart = () => {
  const [segmentation, setSegmentation] = useState<SegmentSelect>("age");
  const { activeTab: activeMetric } = useTabStore();
  const { data, isLoading, isError } = useCustomerSegment(
    activeMetric,
    segmentation
  );
  const { drillDown, setDrillDown } = useDrillDown();
  const toggleDrill = () => setDrillDown(!drillDown);
  const formatType =
    activeMetric === "Average Revenue per Customer"
      ? "currency"
      : activeMetric === "Repeat Customer Rate"
      ? "percent"
      : "integer";

  if (isLoading) {
    return (
      <div className="h-[500px] w-full rounded-lg  p-4 flex items-center justify-center">
        <Skeleton className="h-[200px] w-[90%] rounded-md" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center rounded-lg  p-4">
        <div className="text-center">
          <p className="text-sm font-medium text-destructive">
            Unable to load data.
          </p>
          <p className="text-xs text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  console.log(data);

  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold tracking-tight">
          Segmentation Analysis{" "}
        </h3>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Segment by:</label>
          <Select
            value={segmentation}
            onValueChange={(value: SegmentSelect) => setSegmentation(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Segment by" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SegmentOptions).map(([label, value]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      </div>

      <div className="flex-1 min-h-[300px]">
        {["gender", "income_bracket"].includes(segmentation) ? (
          <DrillDownPieChartWrapper data={data} />
        ) : (
          <DrillDownBarChartWrapper data={data} />
        )}
      </div>

      <div className="text-xs text-muted-foreground mt-2">
        <p>
          Currently showing{" "}
          <span className="font-medium text-gray-200">
            {activeMetric.toLowerCase()}
          </span>{" "}
          by{" "}
          <span className="font-medium text-gray-200">
            {segmentation.replace(/_/g, " ")}
          </span>
          .
        </p>
        <p>All filters and selected date range are applied.</p>
      </div>
    </div>
  );
};

export default CustomerSegmentChart;
