"use client";
import React from "react";
import { useTopNProducts } from "@/hooks/useProducts";
import { useTabStore } from "@/stores/useTabStore";

type Props = {};

const TopProducts = (props: Props) => {
  const { activeTab, setActiveTab } = useTabStore();
  const { data, isLoading } = useTopNProducts(5, activeTab);

  console.log(data);
  return <div>TopProducts</div>;
};

export default TopProducts;
