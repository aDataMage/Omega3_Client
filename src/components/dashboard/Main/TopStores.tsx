"use client";
import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useTopNStores } from "@/hooks/useStores"; // You'll need to create this hook
import { useTabStore } from "@/stores/useTabStore";
import { TopStores } from "@/types/store"; // Define this type based on your API response
import { useDateRangeStore } from "@/stores/useDateRangeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebounce } from "@/hooks/useDebounce";

const columns: ColumnDef<TopStores>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      const globalRank = pageIndex * pageSize + row.index + 1;

      let badgeClass = "bg-gray-100 text-gray-800";
      if (globalRank === 1) badgeClass = "bg-yellow-400 text-yellow-900";
      else if (globalRank === 2) badgeClass = "bg-gray-300 text-gray-900";
      else if (globalRank === 3) badgeClass = "bg-amber-600 text-amber-100";

      return (
        <div className="flex justify-center">
          <Badge className={`text-[0.7rem] ${badgeClass}`}>#{globalRank}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "store_name",
    header: "Store Name",
    cell: ({ row }) => {
      const fullName: string = row.getValue("store_name");
      const words = fullName.split(" ");
      const clippedName = words.slice(0, 2).join(" ");
      const needsClipping = words.length > 2;

      if (needsClipping) {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate max-w-[150px]">{clippedName}...</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{fullName}</p>
            </TooltipContent>
          </Tooltip>
        );
      }

      return <div>{fullName}</div>;
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
    accessorKey: "top_product_name",
    header: "Top Product",
    cell: ({ row }) => <div>{row.getValue("top_product_name")}</div>,
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

      return <div className="text-right">{headerMap[metric] || "Metric"}</div>;
    },
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("metric_value"));
      const metric = row.original.metric_key ?? "";

      const isCurrency = metric === "Total Sales" || metric === "Total Profit";
      const formatted = isCurrency
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value)
        : value.toLocaleString();

      return <div className="text-right">{formatted}</div>;
    },
  },
];

export function StoresDataTable() {
  const { activeTab } = useTabStore();
  const [topN, setTopN] = React.useState(10);
  const { dateRange } = useDateRangeStore();
  const {
    data: allData = [],
    isLoading,
    isFetching,
  } = useTopNStores(50, activeTab, dateRange);
  const [regionFilter, setRegionFilter] = React.useState<string>("");

  const filteredData = allData.filter((store) =>
    regionFilter ? store.region === regionFilter : true
  );

  const displayedData = filteredData
    .slice(0, topN)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  const table = useReactTable({
    data: displayedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      // Add this
      pagination: {
        pageSize: 10, // Set default page size to 10
      },
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!displayedData.length) return <div>No data available</div>;

  return (
    <div className="w-full relative">
      {(isLoading || isFetching) && (
        <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div className="flex items-center justify-between py-4 space-x-2">
        {/* Region Filter */}
        <Select
          value={regionFilter}
          onValueChange={(value) =>
            setRegionFilter(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {Array.from(new Set(allData.map((store) => store.region))).map(
              (region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        {/* Top N Selector */}
        <div className="flex items-center space-x-2">
          <label htmlFor="topN" className="text-sm text-muted-foreground">
            Top
          </label>
          <select
            id="topN"
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
            className="border px-2 py-1 rounded-md text-sm bg-background"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-chart-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="border-chart-2" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
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
                <TableRow className="border-chart-2" key={row.id}>
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
      <div className="flex items-center justify-end space-x-2 py-4">
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
  );
}

export default StoresDataTable;
