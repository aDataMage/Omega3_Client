"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBrandsTable } from "@/hooks/useProducts"; // You'll need to create this hook
import { useDateRangeStore } from "@/stores/useDateRangeStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowUpDown, Loader2, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatNumberWithSeparator } from "@/utils/formatNumber";

type SortField = "sales" | "profit" | "returns" | "orders";

export function BrandsTable() {
  const router = useRouter();
  const { dateRange } = useDateRangeStore();
  const { data, isLoading, isError, isFetching } = useBrandsTable(dateRange);
  const [sortField, setSortField] = useState<SortField>("sales");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsPerPage = 10;

  console.log(data);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const sortedData = [...(data || [])].sort((a, b) => {
    let valueA, valueB;

    switch (sortField) {
      case "sales":
        valueA = a.total_sales;
        valueB = b.total_sales;
        break;
      case "profit":
        valueA = a.total_profit;
        valueB = b.total_profit;
        break;
      case "returns":
        valueA = a.total_returns;
        valueB = b.total_returns;
        break;
      case "orders":
        valueA = a.total_orders;
        valueB = b.total_orders;
        break;
      default:
        return 0;
    }

    return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDrillDown = (
    type: "brand" | "product" | "region",
    value: string
  ) => {
    setIsDropdownOpen(false);
    router.push(`/analytics/${type}/${encodeURIComponent(value)}`);
  };

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load brand data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const totals = sortedData?.reduce(
    (acc, brand) => ({
      totalSales: acc.totalSales + (brand.total_sales || 0),
      totalProfit: acc.totalProfit + (brand.total_profit || 0),
      totalReturns: acc.totalReturns + (brand.total_returns || 0),
      totalOrders: acc.totalOrders + (brand.total_orders || 0),
    }),
    { totalSales: 0, totalProfit: 0, totalReturns: 0, totalOrders: 0 }
  );

  return (
    <div className="space-y-4 relative">
      {/* Loading overlay */}
      {isFetching && (
        <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      <div className="flex justify-between items-center">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              ref={triggerRef}
              variant="outline"
              className="w-[200px] justify-between"
            >
              Drill through to...
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent ref={dropdownRef} className="w-[200px]">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => handleDrillDown("brand", "All Brands")}
              >
                All Brands
              </DropdownMenuItem>
              {sortedData?.map((brand) => (
                <React.Fragment key={brand.brand_name}>
                  <DropdownMenuItem
                    onSelect={() => handleDrillDown("brand", brand.brand_name)}
                  >
                    Brand: {brand.brand_name}
                  </DropdownMenuItem>
                  {brand.top_product && (
                    <DropdownMenuItem
                      onSelect={() =>
                        handleDrillDown("product", brand.top_product)
                      }
                    >
                      Product: {brand.top_product}
                    </DropdownMenuItem>
                  )}
                  {brand.top_region && (
                    <DropdownMenuItem
                      onSelect={() =>
                        handleDrillDown("region", brand.top_region)
                      }
                    >
                      Region: {brand.top_region}
                    </DropdownMenuItem>
                  )}
                </React.Fragment>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table>
        <TableCaption>Brand performance metrics</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Brand</TableHead>
            <TableHead>Top Product</TableHead>
            <TableHead>Top Region</TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("sales")}
                className="p-0"
              >
                Sales
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("profit")}
                className="p-0"
              >
                Profit
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("returns")}
                className="p-0"
              >
                Returns
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("orders")}
                className="p-0"
              >
                Orders
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Contribution</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData?.map((brand) => (
            <TableRow key={brand.brand_name}>
              <TableCell className="font-medium">
                <Button
                  variant="drill"
                  onClick={() => handleDrillDown("brand", brand.brand_name)}
                  className="p-0 h-auto"
                >
                  {brand.brand_name}
                </Button>
              </TableCell>
              <TableCell>
                {brand.top_product ? (
                  <Button
                    variant="drill"
                    onClick={() =>
                      handleDrillDown("product", brand.top_product)
                    }
                    className="p-0 h-auto"
                  >
                    {brand.top_product}
                  </Button>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                {brand.top_region ? (
                  <Button
                    variant="drill"
                    onClick={() => handleDrillDown("region", brand.top_region)}
                    className="p-0 h-auto"
                  >
                    {brand.top_region}
                  </Button>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-mono font-light text-xs">
                {formatCurrency(brand.total_sales, "Total Sales")}
              </TableCell>
              <TableCell className="text-right font-mono font-light text-xs">
                {formatCurrency(brand.total_profit, "Total Profit")}
              </TableCell>
              <TableCell className="text-right">
                {formatNumberWithSeparator(brand.total_returns)}
              </TableCell>
              <TableCell className="text-right">
                {formatNumberWithSeparator(brand.total_orders)}
              </TableCell>
              <TableCell className="text-right">
                {brand.sales_contribution_percentage?.toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Totals</TableCell>
            <TableCell className="text-right font-mono font-light text-xs">
              {formatCurrency(totals?.totalSales, "Total Sales")}
            </TableCell>
            <TableCell className="text-right font-mono font-light text-xs">
              {formatCurrency(totals?.totalProfit, "Total Profit")}
            </TableCell>
            <TableCell className="text-right">
              {formatNumberWithSeparator(totals?.totalReturns)}
            </TableCell>
            <TableCell className="text-right">
              {formatNumberWithSeparator(totals?.totalOrders)}
            </TableCell>
            <TableCell className="text-right">100%</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                Previous
              </Button>
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={currentPage === pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <Button
                variant="ghost"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
