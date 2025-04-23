import { useEffect } from "react";
import { useInsightsStore } from "@/stores/useInsightsStore";
import { useRegions, useStoresNames } from "@/hooks/useStores";
import { useProductsNames, useBrands } from "@/hooks/useProducts";

export const useInitializeFilters = () => {
  const {
    setRegions,
    setStores,
    setProducts,
    setBrands
  } = useInsightsStore();

  const { data: regionsData } = useRegions();
  const { data: storesData } = useStoresNames();
  const { data: productsData } = useProductsNames();
  const { data: brandsData } = useBrands();

  useEffect(() => {
    if (regionsData) {
      setRegions(regionsData.map((r: string) => ({
        label: r,
        value: r,
      })));
    }
  }, [regionsData]);

  useEffect(() => {
    if (storesData) {
      setStores(storesData.map((s: string) => ({
        label: s,
        value: s,
      })));
    }
  }, [storesData]);

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.map((p: string) => ({
        label: p,
        value: p,
      })));
    }
  }, [productsData]);

  useEffect(() => {
    if (brandsData) {
      setBrands(brandsData.map((b: string) => ({
        label: b,
        value: b,
      })));
    }
  }, [brandsData]);
};
