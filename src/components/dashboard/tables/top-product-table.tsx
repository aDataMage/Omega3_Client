"use client";

import { useState, useMemo } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTopNProducts } from "@/hooks/useProducts";
import { useTabStore } from "@/stores/useTabStore";
import type { TopProducts } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Format currency values
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

// Format category strings
const formatCategory = (category: string) => {
  console.log("Category:", category);
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Format brand names
const formatBrand = (brand: string) => {
  return brand
    .replace(/([A-Z])/g, " $1")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// Get rank badge styling
const getRankBadgeClass = (rank: number) => {
  if (rank === 1) return "bg-yellow-400 text-yellow-900";
  if (rank === 2) return "bg-gray-300 text-gray-900";
  if (rank === 3) return "bg-amber-600 text-amber-100";
  return "bg-gray-100 text-gray-800";
};

export function TopProductsTable() {
  const { activeTab } = useTabStore();
  const [topN, setTopN] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Fetch data with the optimized hook
  const {
    data: allData = [],
    isLoading,
    isError,
    error,
  } = useTopNProducts(topN, activeTab);

  // Define columns
  const columns = useMemo<ColumnDef<TopProducts>[]>(
    () => [
      {
        accessorKey: "rank",
        header: "Rank",
        cell: ({ row, table }) => {
          const pageIndex = table.getState().pagination.pageIndex;
          const pageSize = table.getState().pagination.pageSize;
          const globalRank = pageIndex * pageSize + row.index + 1;

          return (
            <div className="flex justify-center">
              <Badge
                className={`text-[0.7rem] ${getRankBadgeClass(globalRank)}`}
              >
                #{globalRank}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "product_name",
        header: "Product Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("product_name")}</div>
        ),
      },
      {
        accessorKey: "brand_name",
        header: "Brand",
        cell: ({ row }) => {
          const brand = row.getValue("brand_name") as string;
          return <div>{formatBrand(brand)}</div>;
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const category = row.getValue("category") as string;
          return <div>{formatCategory(category)}</div>;
        },
      },
      {
        accessorKey: "price",
        header: () => <div className="text-right font-medium">Price</div>,
        cell: ({ row }) => {
          const price = Number.parseFloat(row.getValue("price"));
          return (
            <div className="text-right font-mono text-xs">
              {formatCurrency(price)}
            </div>
          );
        },
      },
      {
        accessorKey: "metric_value",
        header: ({ table }) => {
          // Get the first row's metric_key to determine the header
          const firstRow = table.getCoreRowModel().flatRows[0];
          const metric = firstRow?.original.metric_key ?? "Metric";

          // Map metric keys to display names
          const headerMap: Record<string, string> = {
            "Total Sales": "Total Sales",
            "Total Orders": "Order Count",
            "Total Returns": "Return Count",
            "Total Profit": "Total Profit",
          };

          return (
            <div className="text-right font-medium">
              {headerMap[metric] || "Metric"}
            </div>
          );
        },
        cell: ({ row }) => {
          const value = Number.parseFloat(row.getValue("metric_value"));
          const metric = row.original.metric_key ?? "";

          const isCurrency =
            metric === "Total Sales" || metric === "Total Profit";
          const formatted = isCurrency
            ? formatCurrency(value)
            : value.toLocaleString();

          return (
            <div className="text-right font-mono text-xs">{formatted}</div>
          );
        },
      },
    ],
    []
  );

  // Filter data based on active tab
  const filteredData = useMemo(() => {
    if (!activeTab || !allData.length) return [];
    return allData.slice(0, topN).map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [allData, topN, activeTab]);

  // Initialize table
  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  // Get unique categories and brands for filters
  const uniqueCategories = useMemo(
    () => Array.from(new Set(filteredData.map((item) => item.category))),
    [filteredData]
  );
  console.log(
    "Unique Categories:",
    allData.map((item) => item.category)
  );

  const uniqueBrands = useMemo(
    () => Array.from(new Set(filteredData.map((item) => item.brand_name))),
    [filteredData]
  );

  // Loading state
  if (isLoading) {
    return <TopProductsTableSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <>
        <div className="text-destructive">
          Error loading products:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </>
    );
  }

  // Empty state
  if (!filteredData.length) {
    return (
      <>
        <div className="text-muted-foreground text-center py-6">
          No product data available for the selected metric.
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Input
            placeholder="Filter by name..."
            value={
              (table.getColumn("product_name")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("product_name")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-xs w-full sm:w-auto"
          />

          <Select
            value={
              (table.getColumn("category")?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) => {
              table
                .getColumn("category")
                ?.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {formatCategory(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              (table.getColumn("brand_name")?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) => {
              table
                .getColumn("brand_name")
                ?.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {uniqueBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {formatBrand(brand)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select
              value={topN.toString()}
              onValueChange={(value) => setTopN(Number(value))}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border w-full overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Skeleton loader for the table
function TopProductsTableSkeleton() {
  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <Skeleton className="h-[400px] w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-[80px]" />
            <Skeleton className="h-8 w-[80px]" />
          </div>
        </div>
      </div>
    </>
  );
}

export default TopProductsTable;
