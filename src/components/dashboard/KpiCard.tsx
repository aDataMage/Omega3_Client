import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KPIs } from "@/types/kpi";
import { SalesOverTime } from "..";
import Sparkline from "./charts/SparkLine";
import { smoothData } from "@/utils/smoothData";
import { cn } from "@/lib/utils";
type Props = {};

const KpiCard = (props: KPIs) => {
  const data = props.trend_data.map((item) => item.value);
  const smoothedData = smoothData(data, 5);
  const dates = props.trend_data.map((item) => item.date);
  const joindata = smoothedData.map((item, index) => {
    return { date: dates[index], value: item };
  });
  return (
    <Card className="w-full bg-muted border-none shadow-2xs hover:shadow-xs shadow-chart-2 gap-2 transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="text-md font-semibold text-card-foreground">
          {props.title}
        </CardTitle>
        <CardDescription className="text-sm font-light text-gray-500">
          {props.current_date_range}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h2 className="text-3xl font-bold">{props.value}</h2>
        <div className="flex flex-col mt-4">
          <p className="text-xs font-light text-gray-500">
            {props.previous_date_range}
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs font-normal text-gray-500">
              Previous Total: {props.previous_total}
            </p>
            <p
              className={cn(
                "text-md font-semibold",
                parseFloat(props.percentage_change) > 0
                  ? "text-primary"
                  : "text-destructive"
              )}
            >
              {props.percentage_change}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-4">
        {/* <SalesOverTime data={joindata} /> */}

        {/* <Sparkline
          data={smoothedData}
          width={300}
          height={40}
          color="#10B981"
          positiveColor="#10B981"
          negativeColor="#EF4444"
          animate={true}
        /> */}
      </CardFooter>
    </Card>
  );
};

export default KpiCard;
