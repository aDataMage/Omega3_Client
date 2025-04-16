import {
  AppBar,
  CustomersList,
  KpiCardList,
  SalesOverTime,
  FilterBar,
  TrendOverTime,
  TopProducts,
  TopStores,
} from "@/components";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto my-10">
      <div className="flex items-center justify-between mb-5">
        <FilterBar />
      </div>
      <div className="flex flex-col gap-5">
        <KpiCardList />
        <TrendOverTime />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <TopProducts />
          </div>
          <div className="col-span-1">
            <TopStores />
          </div>
        </div>
      </div>
    </div>
  );
}
