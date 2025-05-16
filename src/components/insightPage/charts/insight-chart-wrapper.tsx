// "use client";
// import React from "react";
// import { useInsight } from "@/hooks/useKpi";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { TabsContent } from "@radix-ui/react-tabs";
// import { formatChartDate } from "@/utils/fomartChartDate";
// import { clipText } from "@/utils/clipText";
// import { formatCurrency } from "@/utils/formatCurrency";
// import getComparisonColor from "@/utils/getComparisonColor";
// import InsightChart from "./insight-chart";
// import { Card, CardContent } from "@/components/ui/card";

// type Props = {};
// const METRICS = [
//   { value: "Total Sales", label: "Sales" },
//   { value: "Total Returns", label: "Returns" },
//   { value: "Total Profit", label: "Profit" },
//   { value: "Total Orders", label: "Orders" },
// ];

// const InsightChartWrapper = (props: Props) => {
//   const [currentMetric, setCurrentMetric] = React.useState("Total Returns");
//   const { data, isLoading, isError } = useInsight(currentMetric);

//   const transformForMultiMetricChart = (
//     trendData: {
//       comparison_value: string;
//       date: Date;
//       metric_value: number;
//     }[]
//   ): Record<string, number | string>[] => {
//     const groupedData: Record<string, Record<string, number>> = {};

//     trendData?.forEach((item) => {
//       const dateKey = String(item.date);
//       if (!groupedData[dateKey]) {
//         groupedData[dateKey] = {};
//       }
//       groupedData[dateKey][item.comparison_value] = item.metric_value;
//     });

//     return Object.entries(groupedData).map(([date, values]) => ({
//       date,
//       name: formatChartDate(date),
//       ...values,
//     }));
//   };

//   const multiMetricChartData = transformForMultiMetricChart(
//     data?.data.trend ?? []
//   );

//   const comparisonKeys = Array.from(
//     new Set(
//       multiMetricChartData?.flatMap((item) =>
//         Object.keys(item).filter((k) => k !== "date" && k !== "name")
//       ) || []
//     )
//   );
//   return (
//     <div className="w-full">
//       <Tabs value={currentMetric} onValueChange={setCurrentMetric}>
//         <TabsList className="mb-5">
//           {METRICS.map((metric) => (
//             <TabsTrigger
//               // className="data-[state=active]:bg-primary dark:data-[state=active]:text-foreground"
//               key={metric.value}
//               value={metric.value}
//             >
//               {metric.label}
//             </TabsTrigger>
//           ))}
//         </TabsList>
//         <Card>
//           <CardContent>
//             {METRICS.map((metric) => (
//               <TabsContent key={metric.value} value={metric.value}>
//                 <div className="flex mb-5 items-center gap-4">
//                   {comparisonKeys.map((key, index) => (
//                     <div key={key} className="flex items-center">
//                       <div
//                         className="w-3 h-3 rounded-full mr-2"
//                         style={{ backgroundColor: getComparisonColor(index) }}
//                       />
//                       <span className="text-sm flex text-muted-foreground">
//                         {clipText(key)}:
//                       </span>
//                       <span className="ml-1 font-medium">
//                         {formatCurrency(
//                           multiMetricChartData?.reduce(
//                             (sum, item) => sum + (Number(item[key]) || 0),
//                             0
//                           ) || 0,
//                           currentMetric
//                         )}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="h-[400px]">
//                   <InsightChart
//                     multiMetricChartData={multiMetricChartData}
//                     currentMetric={currentMetric}
//                     comparisonKeys={comparisonKeys}
//                   />
//                 </div>
//               </TabsContent>
//             ))}
//           </CardContent>
//         </Card>
//       </Tabs>
//     </div>
//   );
// };

// export default InsightChartWrapper;
"use client";

import { useState, useMemo } from "react";
import { useInsight } from "@/hooks/useKpi";
import { useInsightsStore } from "@/stores/useInsightsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import InsightChart from "./insight-chart";
import { clipText } from "@/utils/clipText";
import { formatCurrency } from "@/utils/formatCurrency";
import getComparisonColor from "@/utils/getComparisonColor";

const METRICS = [
  { value: "Total Sales", label: "Sales" },
  { value: "Total Returns", label: "Returns" },
  { value: "Total Profit", label: "Profit" },
  { value: "Total Orders", label: "Orders" },
];

export default function InsightsChartContainer() {
  const [currentMetric, setCurrentMetric] = useState(METRICS[0].value);
  const { comparisonLevel } = useInsightsStore();

  // Fetch insight data
  const { data, isLoading, isError, error } = useInsight(currentMetric);

  // Process data for the chart
  const { chartData, comparisonKeys } = useMemo(() => {
    if (!data || !data.data || !data.data.trend) {
      return { chartData: [], comparisonKeys: [] };
    }

    // Get unique comparison values
    const uniqueComparisonValues = Array.from(
      new Set(data.data.trend.map((item) => item.comparison_value))
    );

    // Group trend data by date
    const groupedByDate = data.data.trend.reduce((acc, item) => {
      const dateStr = new Date(item.date).toISOString().split("T")[0];

      if (!acc[dateStr]) {
        acc[dateStr] = { name: dateStr };
      }

      acc[dateStr][item.comparison_value] = item.metric_value;

      return acc;
    }, {} as Record<string, any>);

    // Convert to array and sort by date
    const chartData = Object.values(groupedByDate).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return {
      chartData,
      comparisonKeys: uniqueComparisonValues,
    };
  }, [data]);

  // Handle loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <Card>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load insight data"}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Handle empty data
  if (!data || !data.data || !data.data.trend || data.data.trend.length === 0) {
    return (
      <Card>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No data available</AlertTitle>
            <AlertDescription>
              There is no data available for the selected filters. Try adjusting
              your selection.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Get the comparison level from the meta data
  const metaComparisonLevel = data.meta.comparison_level;
  const filterCounts = data.meta.filter_counts;

  return (
    <Tabs
      value={currentMetric}
      onValueChange={setCurrentMetric}
      className="space-y-4"
    >
      <TabsList>
        {METRICS.map((metric) => (
          <TabsTrigger key={metric.value} value={metric.value}>
            {metric.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex mb-5 items-center gap-4">
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
                      chartData?.reduce(
                        (sum, item) => sum + (Number(item[key]) || 0),
                        0
                      ) || 0,
                      currentMetric
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-sm font-normal text-muted-foreground">
              {metaComparisonLevel && (
                <span className="mr-2">
                  Comparing by:{" "}
                  <span className="font-medium capitalize">
                    {metaComparisonLevel}
                  </span>
                </span>
              )}
              {filterCounts && (
                <span className="text-xs bg-muted px-2 py-1 rounded-md">
                  Filters:{" "}
                  {filterCounts.regions > 0 &&
                    `${filterCounts.regions} regions`}
                  {filterCounts.stores > 0 && `, ${filterCounts.stores} stores`}
                  {filterCounts.brands > 0 && `, ${filterCounts.brands} brands`}
                  {filterCounts.products > 0 &&
                    `, ${filterCounts.products} products`}
                </span>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <InsightChart
              multiMetricChartData={chartData}
              currentMetric={currentMetric}
              comparisonKeys={comparisonKeys}
            />
          </div>
        </CardContent>
      </Card>
    </Tabs>
  );
}
