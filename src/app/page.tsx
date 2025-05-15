import { KpiCardList, TrendOverTime, TopProducts } from "@/components";
import TrendOverTime2 from "@/components/dashboard/Main/TOT2";
import { DatePickerWithRange } from "@/components/shared/DatePickerWithRange";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <DatePickerWithRange />
      </div>

      <KpiCardList />
      <TrendOverTime />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProducts />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Store data will appear here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
