"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  Filter,
  Layers,
  Package,
  ShoppingBag,
  Store,
  MapPin,
  ChevronDown,
  ChevronUp,
  Home,
  BarChart2,
  ShoppingCart,
  Users,
  Settings,
  Search,
  LogOut,
} from "lucide-react";
import DateRangePicker from "@/components/shared/date-range-picker";
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
import { Badge } from "@/components/ui/badge";
import { useInitializeFilters } from "@/hooks/useInitializeFilters";
import { useInsight } from "@/hooks/useKpi";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function DashboardSidebar() {
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
    resetAllFilters,
  } = useInsightsStore();
  const pathname = usePathname();

  const mainNavItems = [
    { title: "Dashboard", icon: Home, href: "/" },
    { title: "Analytics", icon: BarChart2, href: "/analytics" },
    { title: "Products", icon: ShoppingCart, href: "/products" },
    { title: "Customers", icon: Users, href: "/customers" },
    { title: "Settings", icon: Settings, href: "/settings" },
  ];

  const { refetch } = useInsight("Total Sales");
  const [error, setError] = useState<string | null>(null);

  // Define filters configuration
  const filters = [
    {
      key: "region",
      label: "Regions",
      icon: <MapPin className="h-4 w-4" />,
      options: regions,
      selected: selectedRegions,
      onChange: setSelectedRegions,
    },
    {
      key: "store",
      label: "Stores",
      icon: <Store className="h-4 w-4" />,
      options: stores,
      selected: selectedStores,
      onChange: setSelectedStores,
    },
    {
      key: "brand",
      label: "Brands",
      icon: <ShoppingBag className="h-4 w-4" />,
      options: brands,
      selected: selectedBrands,
      onChange: setSelectedBrands,
    },
    {
      key: "product",
      label: "Products",
      icon: <Package className="h-4 w-4" />,
      options: products,
      selected: selectedProducts,
      onChange: setSelectedProducts,
    },
  ];

  // Initialize filters on component mount
  useInitializeFilters();

  // Handle applying filters
  const handleApplyFilters = () => {
    try {
      applyFilters();
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle resetting all filters
  const handleResetAll = () => {
    resetAllFilters();
    refetch();
  };

  // Count total active filters
  const activeFilterCount = useMemo(() => {
    return (
      selectedRegions.length +
      selectedStores.length +
      selectedBrands.length +
      selectedProducts.length
    );
  }, [selectedRegions, selectedStores, selectedBrands, selectedProducts]);

  // Show filters only on analytics page
  const showFilters = pathname === "/analytics";

  return (
    <Sidebar>
      <SidebarHeader className="pb-0">
        <div className="flex items-center px-2 py-3">
          <div className="flex items-center gap-2 font-semibold text-xl">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <span className="bg-primary-foreground size-6 rounded-full flex items-center justify-center text-primary">
                <span className="font-semibold">Ω</span>
              </span>
            </div>
            <span>Omega 3</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-x-clip">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="w-full" />

        {/* Only show filters on analytics page */}
        {showFilters && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <div className="flex items-center text-sm font-medium">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilterCount}
                  </Badge>
                )}
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-4 py-2 flex flex-col h-full overflow-auto">
                <div className="space-y-4 flex-1 overflow-auto">
                  {/* Comparison Level Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium">
                      <Layers className="h-4 w-4 mr-2" />
                      Compare By
                    </div>
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
                              <span className="ml-2">{filter.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dynamic Filters */}
                  <div className="space-y-2">
                    <div className="space-y-2">
                      {filters.map((filter) => (
                        <FilterSection
                          key={filter.key}
                          filter={filter}
                          isComparison={comparisonLevel === filter.key}
                        />
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Error message */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-2 mt-auto">
                  <Button
                    className="w-full"
                    variant="default"
                    onClick={handleApplyFilters}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleResetAll}
                  >
                    Reset All
                  </Button>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="w-full">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
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
        className="w-full justify-between px-2 h-auto py-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {filter.icon}
          <span className="ml-2">{filter.label}</span>
          {filter.selected.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {filter.selected.length}
            </Badge>
          )}
          {isComparison && (
            <Badge
              variant="outline"
              className="ml-2 bg-primary/10 text-primary"
            >
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

  const selectedLabels = useMemo(() => {
    return selected
      .map((value) => options.find((o) => o.value === value)?.label)
      .filter(Boolean)
      .join(", ");
  }, [selected, options]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-left font-normal h-9"
          disabled={options.length === 0}
        >
          <span className="truncate">
            {selected.length > 0
              ? selected.length === 1
                ? selectedLabels
                : `${selected.length} selected`
              : placeholder || "Select"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[var(--radix-dropdown-menu-trigger-width)] p-0"
        align="start"
      >
        <div className="p-2 border-b flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search..."
            className="h-8 text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="px-2 py-1.5 border-b flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7"
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
            {isComparison && " (Max 3)"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={() => onChange([])}
          >
            Clear
          </Button>
        </div>

        <div className="max-h-[200px] overflow-y-auto py-1">
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
                className="py-1.5"
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            <div className="p-2 text-sm text-muted-foreground text-center">
              No options found
            </div>
          )}
        </div>

        <div className="p-2 border-t flex justify-end">
          <Button
            variant="default"
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

export default DashboardSidebar;
