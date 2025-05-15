import { AppliedFiltersInfoBtn, TableWrapper } from "@/components";
import TotalSales from "@/components/insightPage/charts/TotalSales";
import React from "react";

type Props = {};

const StorePage = (props: Props) => {
  return (
    <div className=" flex flex-col  relative">
      <div className="container mx-auto px-4">
        <TotalSales />
        <TableWrapper />
      </div>
      <AppliedFiltersInfoBtn />
    </div>
  );
};

export default StorePage;
