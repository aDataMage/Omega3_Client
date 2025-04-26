import { useEffect } from "react";
import { useInsightsStore } from "@/stores/useInsightsStore";
import { useRegions, useStoresNames } from "@/hooks/useStores";
import { useProductsNames, useBrands } from "@/hooks/useProducts";

export const useInitializeFilters = () => {
  const {
    setRegions,
    setStores,
    setProducts,
    setBrands,
    setSelectedRegions,
    appliedFilters,
  } = useInsightsStore();

  const { data: regionsData } = useRegions();
  const { data: storesData } = useStoresNames(appliedFilters.selectedRegions);
  const { data: productsData } = useProductsNames(
    appliedFilters.selectedBrands
  );
  const { data: brandsData } = useBrands();

  useEffect(() => {
    if (regionsData) {
      setRegions(
        regionsData.map((r: string) => ({
          label: r,
          value: r,
        }))
      );
    }
  }, [regionsData]);

  useEffect(() => {
    if (regionsData) {
      setSelectedRegions(regionsData.slice(0, 3));
      appliedFilters.selectedRegions = regionsData.slice(0, 3);
    }
  }, [regionsData]);

  useEffect(() => {
    if (storesData) {
      setStores(
        storesData.map((s: { store_id: string; name: string }) => ({
          label: s.name,
          value: s.store_id,
        }))
      );
    }
  }, [storesData]);

  useEffect(() => {
    if (productsData) {
      setProducts(
        productsData.map((p: { product_id: string; name: string }) => ({
          label: p.name,
          value: p.name,
        }))
      );
    }
  }, [productsData]);

  useEffect(() => {
    if (brandsData) {
      setBrands(
        brandsData.map((b: string) => ({
          label: b,
          value: b,
        }))
      );
    }
  }, [brandsData]);
};
