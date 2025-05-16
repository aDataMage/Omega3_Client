"use client";

import { useState, useMemo } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTopNStores } from "@/hooks/useStores";
import { useTabStore } from "@/stores/useTabStore";
import { useDateRangeStore } from "@/stores/useDateRangeStore";
import type { TopStores } from "@/types/store";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Format currency values
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

// Get rank badge styling
const getRankBadgeClass = (rank: number) => {
  if (rank === 1) return "bg-yellow-400 text-yellow-900";
  if (rank === 2) return "bg-gray-300 text-gray-900";
  if (rank === 3) return "bg-amber-600 text-amber-100";
  return "bg-gray-100 text-gray-800";
};

export function StoresDataTable() {
  const { activeTab } = useTabStore();
  const { dateRange } = useDateRangeStore();
  const [topN, setTopN] = useState(10);
  const [regionFilter, setRegionFilter] = useState<string>("");

  // Fetch data with the hook
  const {
    data: allData = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useTopNStores(50, activeTab, dateRange);

  console.log("allData", allData);
  // Define columns
  const columns = useMemo<ColumnDef<TopStores>[]>(
    () => [
      {
        id: "rank",
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
        accessorKey: "name",
        header: "Store Name",
        cell: ({ row }) => {
          const fullName: string = row.getValue("name");
          console.log(row.original);
          const words = fullName.split(" ");
          const clippedName = words.slice(0, 2).join(" ");
          const needsClipping = words.length > 2;

          if (needsClipping) {
            return (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="truncate max-w-[150px]">
                      {clippedName}...
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{fullName}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return <div className="font-medium">{fullName}</div>;
        },
      },
      {
        accessorKey: "manager_name",
        header: "Manager",
        cell: ({ row }) => <div>{row.getValue("manager_name")}</div>,
      },
      {
        accessorKey: "region",
        header: "Region",
        cell: ({ row }) => {
          const region = row.getValue("region") as string;
          return <div>{region}</div>;
        },
      },
      {
        accessorKey: "top_product",
        header: "Top Product",
        cell: ({ row }) => (
          <div
            className="max-w-[180px] truncate"
            title={row.getValue("top_product")}
          >
            {row.getValue("top_product")}
          </div>
        ),
      },
      {
        accessorKey: "metric_value",
        header: ({ table }) => {
          const firstRow = table.getCoreRowModel().flatRows[0];
          const metric = firstRow?.original.metric_key ?? "Metric";

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

  // Filter and process data
  const processedData = useMemo(() => {
    // Apply region filter
    const filtered = regionFilter
      ? allData.filter((store) => store.region === regionFilter)
      : allData;

    // Take top N
    return filtered.slice(0, topN).map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [allData, regionFilter, topN]);

  // Get unique regions for filter
  const uniqueRegions = useMemo(
    () => Array.from(new Set(allData.map((store) => store.region))),
    [allData]
  );

  // Initialize table
  const table = useReactTable({
    data: processedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Loading state
  if (isLoading) {
    return <StoresTableSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Stores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">
            Error loading stores:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!allData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Stores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-6">
            No store data available for the selected metric.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-lg font-semibold">Top Stores</p>
        <Select
          value={topN.toString()}
          onValueChange={(value) => setTopN(Number(value))}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Show top" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((n) => (
              <SelectItem key={n} value={n.toString()}>
                Top {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
          <Select
            value={regionFilter}
            onValueChange={(value) =>
              setRegionFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {uniqueRegions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table with loading overlay */}
        <div className="rounded-md border w-full overflow-hidden relative">
          {isFetching && (
            <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
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
function StoresTableSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Top Stores</CardTitle>
        <Skeleton className="h-9 w-[110px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
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
      </CardContent>
    </Card>
  );
}

export default StoresDataTable;
