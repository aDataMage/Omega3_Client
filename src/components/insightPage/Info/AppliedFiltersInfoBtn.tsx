"use client";
import React from "react";
import { Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useInsightsStore } from "@/stores/useInsightsStore";
import { fetchStore } from "@/api/store";

type Props = {};

const AppliedFiltersInfoBtn = (props: Props) => {
  const { appliedFilters } = useInsightsStore();
  const {
    comparisonLevel,
    selectedBrands,
    selectedProducts,
    selectedRegions,
    selectedStores,
  } = appliedFilters;

  async function getStoreName(storeID: string) {
    const store = await fetchStore(storeID);
    return store.name;
  }

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger className="sticky bottom-10 w-fit px-4 self-end">
              <Info
                className="text-primary/70 cursor-pointer hover:text-primary"
                size={30}
              />
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Applied Filters</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent className="mx-4">
        <DropdownMenuLabel>Applied Filters</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {comparisonLevel != "region" && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>Regions</DropdownMenuLabel>{" "}
            {selectedRegions.map((region) => (
              <DropdownMenuItem key={region}>{region}</DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
        {comparisonLevel != "brand" && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>Brands</DropdownMenuLabel>{" "}
            {selectedBrands.map((brand) => (
              <DropdownMenuItem key={brand}>{brand}</DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
        {comparisonLevel != "product" && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>Products</DropdownMenuLabel>{" "}
            {selectedProducts.map((product) => (
              <DropdownMenuItem key={product}>{product}</DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
        {comparisonLevel != "store" && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>Stores</DropdownMenuLabel>{" "}
            {selectedStores.map((store) => (
              <DropdownMenuItem key={store}>
                {getStoreName(store)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppliedFiltersInfoBtn;
