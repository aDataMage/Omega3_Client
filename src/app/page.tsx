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
import { DatePickerWithRange } from "@/components/shared/DatePickerWithRange";

import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto my-10">
      <div className="flex items-center mb-6 ">
        <DatePickerWithRange />
      </div>
      <div className="flex flex-col gap-8">
        <KpiCardList />
        <TrendOverTime />
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <TopProducts />
          </div>
          <div className="col-span-1">
            <TopStores />
          </div>
        </div> */}
      </div>
    </div>
  );
}
