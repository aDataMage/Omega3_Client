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
import { useStoreTable } from "@/hooks/useStores";
import { useDateRangeStore } from "@/stores/useDateRangeStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowUpDown,
  Loader2,
  ChevronDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
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

export function StoreTable() {
  const router = useRouter();
  const { dateRange } = useDateRangeStore();
  const { data, isLoading, isError, isFetching } = useStoreTable(dateRange);
  const [sortField, setSortField] = useState<SortField>("sales");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsPerPage = 10;

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

  const handleDrillDown = (storeId: string, storeName: string) => {
    router.push(
      `/analytics/store/${storeId}?name=${encodeURIComponent(storeName)}`
    );
  };

  const handleDrillThrough = (type: "store" | "product", value: string) => {
    setIsDropdownOpen(false);
    if (type === "store") {
      const store = data?.find((s) => s.store_name === value);
      if (store) {
        handleDrillDown(store.store_id, store.store_name);
      }
    } else {
      router.push(`/analytics/product/${encodeURIComponent(value)}`);
    }
  };

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load store data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const totals = sortedData?.reduce(
    (acc, store) => ({
      totalSales: acc.totalSales + (store.total_sales || 0),
      totalProfit: acc.totalProfit + (store.total_profit || 0),
      totalReturns: acc.totalReturns + (store.total_returns || 0),
      totalOrders: acc.totalOrders + (store.total_orders || 0),
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
              {sortedData?.map((store) => (
                <React.Fragment key={store.store_id}>
                  <DropdownMenuItem
                    onSelect={() =>
                      handleDrillThrough("store", store.store_name)
                    }
                  >
                    Store: {store.store_name}
                  </DropdownMenuItem>
                  {store.top_product && (
                    <DropdownMenuItem
                      onSelect={() =>
                        handleDrillThrough("product", store.top_product)
                      }
                    >
                      Product: {store.top_product}
                    </DropdownMenuItem>
                  )}
                </React.Fragment>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table>
        <TableCaption>Store performance metrics</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Store</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Top Product</TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("sales")}
                className="p-0"
              >
                Sales
                {sortField === "sales" ? (
                  sortDirection === "desc" ? (
                    <ArrowUp className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-primary" />
                  )
                ) : (
                  <ArrowUpDown className="h-4 w-4 opacity-50" />
                )}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("profit")}
                className="p-0"
              >
                Profit
                {sortField === "profit" ? (
                  sortDirection === "desc" ? (
                    <ArrowUp className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-primary" />
                  )
                ) : (
                  <ArrowUpDown className="h-4 w-4 opacity-50" />
                )}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("returns")}
                className="p-0"
              >
                Returns
                {sortField === "returns" ? (
                  sortDirection === "desc" ? (
                    <ArrowUp className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-primary" />
                  )
                ) : (
                  <ArrowUpDown className="h-4 w-4 opacity-50" />
                )}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("orders")}
                className="p-0"
              >
                Orders
                {sortField === "orders" ? (
                  sortDirection === "desc" ? (
                    <ArrowUp className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-primary" />
                  )
                ) : (
                  <ArrowUpDown className="h-4 w-4 opacity-50" />
                )}
              </Button>
            </TableHead>
            <TableHead className="text-right">Contribution</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData?.map((store) => (
            <TableRow key={store.store_id}>
              <TableCell className="font-medium">
                <Button
                  variant="drill"
                  onClick={() =>
                    handleDrillDown(store.store_id, store.store_name)
                  }
                  className="p-0 h-auto"
                >
                  {store.store_name}
                </Button>
              </TableCell>
              <TableCell>{store.region}</TableCell>
              <TableCell>
                {store.top_product ? (
                  <Button
                    variant="drill"
                    onClick={() =>
                      router.push(
                        `/analytics/product/${encodeURIComponent(
                          store.top_product
                        )}`
                      )
                    }
                    className="p-0 h-auto"
                  >
                    {store.top_product}
                  </Button>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-mono font-light text-xs">
                {formatCurrency(store.total_sales, "Total Sales")}
              </TableCell>
              <TableCell className="text-right font-mono font-light text-xs">
                {formatCurrency(store.total_profit, "Total Profit")}
              </TableCell>
              <TableCell className="text-right">
                {formatNumberWithSeparator(store.total_returns)}
              </TableCell>
              <TableCell className="text-right">
                {formatNumberWithSeparator(store.total_orders)}
              </TableCell>
              <TableCell className="text-right">
                {store.sales_contribution_percentage?.toFixed(2)}%
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
