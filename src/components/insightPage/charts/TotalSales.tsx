"use client";

import React from "react";
import { useInsight } from "@/hooks/useKpi";

type Props = {};

const TotalSales = (props: Props) => {
  const { data, isLoading, isFetched, isError } = useInsight("Total Sales");
  console.table(data);
  return <div>TotalSales</div>;
};

export default TotalSales;
