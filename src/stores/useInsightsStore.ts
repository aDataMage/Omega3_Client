import { getProductNames } from "@/api/product";
import { getStoreNames } from "@/api/store";
import { create } from "zustand";

type ComparisonLevel = "region" | "store" | "brand" | "product";

type Option = {
  label: string;
  value: string;
};

interface InsightsState {
  comparisonLevel: ComparisonLevel;
  setComparisonLevel: (level: ComparisonLevel) => void;

  regions: Option[];
  selectedRegions: string[];
  setRegions: (options: Option[]) => void;
  setSelectedRegions: (values: string[]) => void;
  fetchStoresByRegions: (regionIds: string[]) => Promise<void>;
  fetchProductsByBrands: (brandName: string[]) => Promise<void>;

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

  resetAllFilters: () => void;
  applyFilters: () => void;

  appliedFilters: {
    selectedRegions: string[];
    selectedBrands: string[];
    selectedProducts: string[];
    selectedStores: string[];
    comparisonLevel: ComparisonLevel;
  };
}

export const useInsightsStore = create<InsightsState>((set, get) => ({
  comparisonLevel: "region",

  selectedRegions: [],
  selectedBrands: [],
  selectedProducts: [],
  selectedStores: [],

  regions: [],
  brands: [],
  products: [],
  stores: [],

  setComparisonLevel: (level) => {
    set((state) => {
      const resetFields: Partial<InsightsState> = { comparisonLevel: level };
      resetFields.selectedRegions = [];
      resetFields.selectedStores = [];
      resetFields.selectedBrands = [];
      resetFields.selectedProducts = [];
      return resetFields;
    });
  },

  setSelectedRegions: async (regions) => {
    set({ selectedRegions: regions });
    await get().fetchStoresByRegions(regions);
  },
  setSelectedBrands: async (brands) => {
    set({ selectedBrands: brands });
    await get().fetchProductsByBrands(brands);
  },

  setSelectedProducts: (products) => set({ selectedProducts: products }),
  setSelectedStores: (stores) => set({ selectedStores: stores }),

  fetchStoresByRegions: async (regionIds) => {
    try {
      // Replace with your actual API call to fetch stores by regions
      const stores = await getStoreNames(regionIds);
      set({
        stores: stores.map((store: any) => ({
          label: store.name,
          value: store.store_id,
        })),
        selectedStores: [], // Reset selected stores when regions change
      });
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  },

  setRegions: (regions) => {
    const defaultSelected = regions.slice(0, 3).map((r) => r.value);
    set({
      regions,
      selectedRegions: defaultSelected,
      appliedFilters: {
        ...get().appliedFilters,
        selectedRegions: defaultSelected,
      },
    });
    // Fetch stores for the default selected regions
    get().fetchStoresByRegions(defaultSelected);
  },

  setBrands: (brands) => set({ brands }),
  setProducts: (products) => set({ products }),

  fetchProductsByBrands: async (brandName) => {
    try {
      const products = await getProductNames(brandName);
      console.log(products);
      set({
        products: products.map((product: any) => ({
          label: product.name,
          value: product.name,
        })),
        selectedProducts: [], // Reset selected products when regions change
      });
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  },

  setStores: (stores) => set({ stores }),

  appliedFilters: {
    selectedRegions: [],
    selectedBrands: [],
    selectedProducts: [],
    selectedStores: [],
    comparisonLevel: "region",
  },

  applyFilters: () =>
    set((state) => {
      // Validation logic
      const validateComparison = () => {
        const selectionMap = {
          store: {
            values: state.selectedStores,
            name: "stores",
          },
          brand: {
            values: state.selectedBrands,
            name: "brands",
          },
          product: {
            values: state.selectedProducts,
            name: "products",
          },
          region: {
            values: state.selectedRegions,
            name: "region",
          },
        };

        const currentSelection = selectionMap[state.comparisonLevel];
        if (currentSelection.values.length < 2) {
          throw new Error(
            `Please select at least 2 ${currentSelection.name} to compare`
          );
        }

        return true;
      };

      validateComparison();

      return {
        appliedFilters: {
          selectedRegions: state.selectedRegions,
          selectedBrands: state.selectedBrands,
          selectedProducts: state.selectedProducts,
          selectedStores: state.selectedStores,
          comparisonLevel: state.comparisonLevel,
        },
        error: null, // Reset any previous errors
      };
    }),

  resetAllFilters: () =>
    set((state) => {
      const defaultSelectedRegions = state.regions
        .slice(0, 3)
        .map((r) => r.value);

      return {
        selectedRegions: defaultSelectedRegions,
        selectedBrands: [],
        selectedProducts: [],
        selectedStores: [],
        comparisonLevel: "region",
        appliedFilters: {
          selectedRegions: defaultSelectedRegions,
          selectedBrands: [],
          selectedProducts: [],
          selectedStores: [],
          comparisonLevel: "region",
        },
      };
    }),
}));

export default useInsightsStore;
