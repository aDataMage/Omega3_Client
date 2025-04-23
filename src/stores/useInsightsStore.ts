import { create } from "zustand";
import {useRegions,useStoresNames} from "@/hooks/useStores"
import {useProductsNames,useBrands} from "@/hooks/useProducts"
type ComparisonLevel = "region" | "store" | "brand" | "product";

type Option = {
  label: string;
  value: string;
};

interface InsightsState {
  // Comparison
  comparisonLevel: ComparisonLevel;
  setComparisonLevel: (level: ComparisonLevel) => void;

  // Region Filters
  regions: Option[];
  selectedRegions: string[];
  setRegions: (options: Option[]) => void;
  setSelectedRegions: (values: string[]) => void;

  stores: Option[];
  selectedStores: string[];
  setStores: (options: Option[]) => void;
  setSelectedStores: (values: string[]) => void;

  brands: Option[];
  selectedBrands: string[];
  setBrands: (options: Option[]) => void;
  setSelectedBrands: (values: string[]) => void;

  products: Option[];
  selectedProducts: string[];
  setProducts: (options: Option[]) => void;
  setSelectedProducts: (values: string[]) => void;
}

export const useInsightsStore = create<InsightsState>((set) => ({
  comparisonLevel: "region",
  setComparisonLevel: (level) => set({ comparisonLevel: level }),

  regions: [],
  selectedRegions: [],
  setRegions: (regions) => set({ regions }),
  setSelectedRegions:(values) =>
  set((state) => ({
    selectedRegions:
      state.comparisonLevel === "region" ? values.slice(0, 3) : values,
  })),

  stores: [],
  selectedStores: [],
  setStores: (stores) => set({stores}),
  setSelectedStores: (values) =>
  set((state) => ({
    selectedStores:
      state.comparisonLevel === "store" ? values.slice(0, 3) : values,
  })),

  brands: [],
  selectedBrands: [],
  setBrands: (brands) => set({brands}),
  setSelectedBrands: (values) =>
  set((state) => ({
    selectedBrands:
      state.comparisonLevel === "brand" ? values.slice(0, 3) : values,
  })),

  products: [],
  selectedProducts: [],
  setProducts: (products) => set({products}),
  setSelectedProducts: (values) =>
  set((state) => ({
    selectedProducts:
      state.comparisonLevel === "product" ? values.slice(0, 3) : values,
  }))
}));
