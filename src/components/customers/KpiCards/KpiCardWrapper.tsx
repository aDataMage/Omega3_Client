"use client";
import React from "react";
import KpiCard from "./KpiCard";
import { useCustomerMetrics } from "@/hooks/useKpi";

type Props = {};

const KpiCardWrapper = (props: Props) => {
  const { data, isError, isLoading } = useCustomerMetrics();
  console.log("KpiCardWrapper", data, isError, isLoading);
  if (isLoading) return <div>Loading</div>;

  return (
    <>
      {data?.data.map((item) => (
        <KpiCard key={item.metric_name} data={item} />
      ))}
    </>
  );
};

export default React.memo(KpiCardWrapper);
