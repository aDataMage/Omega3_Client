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

import { useTopNProducts } from "@/hooks/useProducts";
import { useTabStore } from "@/stores/useTabStore";
import { TopProducts } from "@/types/product";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import {
  SelectLabel,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useDateRangeStore } from "@/stores/useDateRangeStore";

// ✅ COLUMNS
const columns: ColumnDef<TopProducts>[] = [
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
    accessorKey: "product_name",
    header: "Product Name",
    cell: ({ row }) => <div>{row.getValue("product_name")}</div>,
  },
  {
    accessorKey: "brand_name",
    header: "Brand",
    cell: ({ row }) => {
      const raw = row.getValue("brand_name") as string;
      const formatted = raw
        .replace(/([A-Z])/g, " $1") // Add space before each uppercase letter
        .trim() // Remove leading space
        .toLowerCase() // Convert to lowercase
        .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize each word
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const raw = row.getValue("category") as string;
      const formatted = raw
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return <div>{formatted}</div>;
    },
  },

  {
    accessorKey: "price",
    header: () => (
      <div className="text-right font-bold dark:text-gray-300">Price</div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return (
        <div className="text-right font-light font-mono text-xs">
          {formatted}
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
        <div className="text-right font-bold dark:text-gray-300">
          {headerMap[metric] || "Metric"}
        </div>
      );
    },
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("metric_value"));
      const metric = row.original.metric_key ?? ""; // e.g., "total_sales"

      const isCurrency = metric === "Total Sales" || metric === "Total Profit";

      const formatted = isCurrency
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value)
        : value.toLocaleString();

      return (
        <div className="text-right font-mono font-light text-xs">
          {formatted}
        </div>
      );
    },
  },
];

export function DataTableDemo() {
  const { activeTab } = useTabStore();
  const [topN, setTopN] = React.useState(10);
  const { data: allData = [], isLoading } = useTopNProducts(50, activeTab);

  const displayedData = React.useMemo(() => {
    return allData.slice(0, topN).map((item, index) => ({
      ...item,
      rank: index + 1, // Add rank property to each item
    }));
  }, [allData, topN]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: displayedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      // Add this
      pagination: {
        pageSize: 10, // Set default page size to 10
      },
    },
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!displayedData.length) return <div>No data available</div>;

  return (
    <div className="w-full ">
      <div className="flex items-center justify-between py-4 space-x-2">
        {/* Filter by Product Name */}
        <Input
          placeholder="Filter by name..."
          value={
            (table.getColumn("product_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("product_name")?.setFilterValue(event.target.value)
          }
          className="max-w-xs min-w-[10rem]"
        />

        {/* Filter by Category */}
        <Select
          value={
            (table.getColumn("category")?.getFilterValue() as string) ?? ""
          }
          onValueChange={(value) => {
            if (value === "all") {
              table.getColumn("category")?.setFilterValue(undefined);
            } else {
              table.getColumn("category")?.setFilterValue(value);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Array.from(new Set(allData.map((item) => item.category))).map(
              (category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        {/* Filter by Brand */}
        <Select
          value={
            (table.getColumn("brand_name")?.getFilterValue() as string) ?? ""
          }
          onValueChange={(value) => {
            if (value === "all") {
              table.getColumn("brand_name")?.setFilterValue(undefined);
            } else {
              table.getColumn("brand_name")?.setFilterValue(value);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {Array.from(new Set(allData.map((item) => item.brand_name))).map(
              (brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
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
      <div className="rounded-md border border-chart-2 shadow-xs  w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-chart-2">
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
          <TableBody className="border-chart-2">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-chart-2"
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

      {/* Footer */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
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
  );
}

export default DataTableDemo;
