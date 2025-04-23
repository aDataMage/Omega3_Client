import TotalSales from "@/components/insightPage/charts/TotalSales";
import React from "react";

type Props = {};

const StorePage = (props: Props) => {
  return (
    <div className="container mx-auto grid-cols-2 px-4">
      <TotalSales />
    </div>
  );
};

export default StorePage;
