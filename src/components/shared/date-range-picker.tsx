"use client";

import * as React from "react";
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subYears,
  startOfYear,
  endOfYear,
  subQuarters,
  startOfQuarter,
  endOfQuarter,
  getQuarter,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDateRangeStore } from "@/stores/useDateRangeStore";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRESETS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "This Week", value: "thisWeek" },
  { label: "Last Week", value: "lastWeek" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Month to Date", value: "monthToDate" },
  { label: "Last Year", value: "lastYear" },
  { label: "Year to Date", value: "yearToDate" },
  { label: "Current Year", value: "currentYear" },
  { label: "Last Quarter", value: "lastQuarter" },
  { label: "Current Quarter", value: "currentQuarter" },
];

export default function DateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { dateRange, setDateRange } = useDateRangeStore();
  const [tempRange, setTempRange] = React.useState({
    from: dateRange.from,
    to: dateRange.to,
  });
  const minDate = new Date(2023, 0, 1);
  const maxDate = new Date();

  const handleApply = () => {
    setDateRange(tempRange);
    // Add your data fetching logic here
  };

  const applyPreset = (presetValue: string) => {
    const today = new Date();
    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    switch (presetValue) {
      case "today":
        fromDate = today;
        toDate = today;
        break;
      case "yesterday":
        fromDate = subDays(today, 1);
        toDate = subDays(today, 1);
        break;
      case "last7":
        fromDate = subDays(today, 7);
        toDate = today;
        break;
      case "last30":
        fromDate = subDays(today, 30);
        toDate = today;
        break;
      case "thisWeek":
        fromDate = startOfWeek(today);
        toDate = endOfWeek(today);
        break;
      case "lastWeek":
        fromDate = startOfWeek(subDays(today, 7));
        toDate = endOfWeek(subDays(today, 7));
        break;
      case "thisMonth":
        fromDate = startOfMonth(today);
        toDate = endOfMonth(today);
        break;
      case "lastMonth":
        const firstDayOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        fromDate = startOfMonth(firstDayOfLastMonth);
        toDate = endOfMonth(firstDayOfLastMonth);
        break;
      case "monthToDate":
        fromDate = startOfMonth(today);
        toDate = today;
        break;
      case "lastYear":
        fromDate = startOfYear(subYears(today, 1));
        toDate = endOfYear(subYears(today, 1));
        break;
      case "yearToDate":
        fromDate = startOfYear(today);
        toDate = today;
        break;
      case "currentYear":
        fromDate = startOfYear(today);
        toDate = endOfYear(today);
        break;
      case "lastQuarter":
        fromDate = startOfQuarter(subQuarters(today, 1));
        toDate = endOfQuarter(subQuarters(today, 1));
        break;
      case "currentQuarter":
        fromDate = startOfQuarter(today);
        toDate = endOfQuarter(today);
        break;
      default:
        break;
    }

    if (fromDate && toDate) {
      setTempRange({ from: fromDate, to: toDate });
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "max-w-[300px] justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col space-y-2 p-2">
            <Select onValueChange={applyPreset}>
              <SelectTrigger>
                <SelectValue placeholder="Quick select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="custom" className="text-muted-foreground">
                  Custom Range
                </SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7">Last 7 Days</SelectItem>
                <SelectItem value="last30">Last 30 Days</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="lastWeek">Last Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="monthToDate">Month to Date</SelectItem>
                <SelectItem value="lastYear">Last Year</SelectItem>
                <SelectItem value="yearToDate">Year to Date</SelectItem>
                <SelectItem value="currentYear">Current Year</SelectItem>
                <SelectItem value="lastQuarter">Last Quarter</SelectItem>
                <SelectItem value="currentQuarter">Current Quarter</SelectItem>
              </SelectContent>
            </Select>
            <div className="rounded-md border">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={tempRange.from}
                selected={{
                  from: tempRange.from,
                  to: tempRange.to,
                }}
                onSelect={(range) => {
                  setTempRange({
                    from: range?.from || tempRange.from,
                    to: range?.to || tempRange.to,
                  });
                }}
                fromDate={minDate}
                toDate={maxDate}
                numberOfMonths={2}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTempRange({ from: undefined, to: undefined })}
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={!tempRange.from}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
