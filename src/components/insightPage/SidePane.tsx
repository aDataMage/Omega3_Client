"use client";

import {
  Calendar,
  Filter,
  Layers,
  Package,
  ShoppingBag,
  Store,
  MapPin,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DatePickerWithRange } from "@/components/shared/DatePickerWithRange";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useInsightsStore } from "@/stores/useInsightsStore";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useInitializeFilters } from "@/hooks/useInitializeFilters";
import { useInsight } from "@/hooks/useKpi";

function InsightsSidebar() {
  const {
    comparisonLevel,
    setComparisonLevel,
    regions,
    selectedRegions,
    setSelectedRegions,
    brands,
    products,
    selectedBrands,
    selectedProducts,
    selectedStores,
    setSelectedBrands,
    setSelectedProducts,
    setSelectedStores,
    stores,
    applyFilters,
    resetAllFilters, // Add this to your store if not already present
  } = useInsightsStore();

  // const { data: dateRange, setDateRange } = useDateRangeStore();
  const { refetch } = useInsight("Total Sales"); // Or use the appropriate metric
  const [error, setError] = useState<string | null>(null);

  const filters = [
    {
      key: "region",
      label: "Regions",
      icon: <MapPin className="h-4 w-4 mr-2" />,
      options: regions,
      selected: selectedRegions,
      onChange: setSelectedRegions,
    },
    {
      key: "store",
      label: "Stores",
      icon: <Store className="h-4 w-4 mr-2" />,
      options: stores,
      selected: selectedStores,
      onChange: setSelectedStores,
    },
    {
      key: "brand",
      label: "Brands",
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
      options: brands,
      selected: selectedBrands,
      onChange: setSelectedBrands,
    },
    {
      key: "product",
      label: "Products",
      icon: <Package className="h-4 w-4 mr-2" />,
      options: products,
      selected: selectedProducts,
      onChange: setSelectedProducts,
    },
  ];

  useInitializeFilters();

  const handleApplyFilters = () => {
    try {
      applyFilters();
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResetAll = () => {
    // Reset all filters to their initial state
    resetAllFilters();
    // setDateRange(undefined);
    // After resetting, refetch the data
    refetch();
  };

  return (
    <Sidebar className="border-r">
      <SidebarContent className="px-4 flex flex-col justify-center">
        {/* Comparison Level Selection */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Layers className="h-4 w-4 mr-2" />
            Compare By
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Select
                value={comparisonLevel}
                onValueChange={setComparisonLevel}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {filters.map((filter) => (
                    <SelectItem key={filter.key} value={filter.key}>
                      <div className="flex items-center">
                        {filter.icon}
                        {filter.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Dynamic Filters */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {filters.map((filter) => (
                <FilterSection
                  key={filter.key}
                  filter={filter}
                  isComparison={comparisonLevel === filter.key}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Date Range Picker */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <DatePickerWithRange className="w-full" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Action Buttons */}
        <div className="p-4 space-y-2">
          <Button
            className="w-full"
            variant="default"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
          <Button className="w-full" variant="outline" onClick={handleResetAll}>
            Reset All
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

function FilterSection({
  filter,
  isComparison,
}: {
  filter: any;
  isComparison: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-between px-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {filter.icon}
          <span>{filter.label}</span>
          {isComparison && (
            <Badge variant="secondary" className="ml-2">
              Comparing
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isExpanded && (
        <MultiSelectFilter
          options={filter.options}
          selected={filter.selected}
          onChange={filter.onChange}
          placeholder={`Select ${filter.label}`}
          isComparison={isComparison}
        />
      )}
    </div>
  );
}

function MultiSelectFilter({
  options,
  selected,
  onChange,
  placeholder,
  isComparison = false,
}: {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  isComparison?: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else if (!isComparison || selected.length < 3) {
      onChange([...selected, value]);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={options.length === 0}
        >
          <span className="truncate">
            {selected.length > 0
              ? selected.length === 1
                ? options.find((o) => o.value === selected[0])?.label
                : `${selected.length} selected`
              : placeholder || "Select"}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 max-h-96 overflow-auto">
        <div className="p-2 border-b">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-1 text-sm border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs px-2 shrink-0"
          onClick={() => {
            if (isComparison) {
              onChange(filteredOptions.slice(0, 3).map((o) => o.value));
            } else {
              onChange(filteredOptions.map((o) => o.value));
            }
          }}
          disabled={filteredOptions.length === 0}
        >
          Select All
        </Button>
        <div className="max-h-80 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selected.includes(option.value)}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={() => toggleOption(option.value)}
                disabled={
                  isComparison &&
                  !selected.includes(option.value) &&
                  selected.length >= 3
                }
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            <div className="p-2 text-sm text-muted-foreground">
              No options found
            </div>
          )}
        </div>

        <div className="p-2 border-t flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange([])}
            className="text-xs"
          >
            Clear
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-xs"
          >
            Done
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default InsightsSidebar;
