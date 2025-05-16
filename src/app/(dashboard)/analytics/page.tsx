import { InsightsSidebar } from "@/components/insights/insight-sidebar";
import { InsightsDrawer } from "@/components/insights/insight-drawer";
import DateRangePicker from "@/components/shared/date-range-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InsightChart from "@/components/insightPage/charts/insight-chart";
import InsightChartWrapper from "@/components/insightPage/charts/insight-chart-wrapper";
import { TableWrapper } from "@/components";

export default function AnalyticsPage() {
  return (
    <div className="flex h-full">
      {/* Secondary sidebar positioned next to the main sidebar - hidden on mobile */}

      <div className="flex-1 space-y-6 p-6 lg:p-8 overflow-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Analytics Dashboard
            </h1>
          </div>
          <DateRangePicker />
        </div>

        <InsightChartWrapper />

        <Card>
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <TableWrapper />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
