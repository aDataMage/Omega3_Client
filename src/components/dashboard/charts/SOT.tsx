"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  value: {
    label: "Sales",
  },
} satisfies ChartConfig;

type SOTProps = {
  data: any[];
};

const SOT = ({ data }: SOTProps) => {
  return (
    <ChartContainer config={chartConfig} className="max-h-[150px] w-full">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="date" hide />
        <YAxis hide />
        <ReferenceDot ifOverflow="hidden" />
        <Tooltip payload={data} />
        <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
      </LineChart>
    </ChartContainer>
  );
};

export default SOT;
