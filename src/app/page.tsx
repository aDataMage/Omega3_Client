import { AppBar, CustomersList, KpiCardList, SalesOverTime, FilterBar } from "@/components";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto my-10">
      <div className="flex items-center justify-between mb-5">
        <FilterBar/>
      </div>
      
      <KpiCardList/>
    </div>
  );
}
