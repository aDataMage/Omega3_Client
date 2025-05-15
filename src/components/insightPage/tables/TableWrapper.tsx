"use client";
import React from "react";
import { RegionTable } from "./RegionTable";
import { StoreTable } from "./StoreTable";
import { BrandsTable } from "./BrandTable";
import { ProductsTable } from "./ProductTable";
import { useInsightsStore } from "@/stores/useInsightsStore";

type Props = {};

const TableSwitch = (props: Props) => {
  const {
    appliedFilters: { comparisonLevel },
  } = useInsightsStore();
  return (
    <div className="mt-10 mb-10 bg-muted/70 p-4 rounded-lg shadow">
      {comparisonLevel == "brand" ? (
        <BrandsTable />
      ) : comparisonLevel == "product" ? (
        <ProductsTable />
      ) : comparisonLevel == "region" ? (
        <RegionTable />
      ) : (
        <StoreTable />
      )}
    </div>
  );
};

export default TableSwitch;
