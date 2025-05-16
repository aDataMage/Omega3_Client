import {
  KpiCardList,
  TrendOverTime,
  TopProducts,
  TopStores,
} from "@/components";
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
          <CardContent>
            <TopProducts />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <TopStores />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
