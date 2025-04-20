"use client";

import * as React from "react";
import { format } from "date-fns";
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

export function DatePickerWithRange({
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
    // Add your data fetching logic here or trigger a parent component's fetch
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
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
          <div className="p-2 border-t flex justify-end">
            <Button size="sm" onClick={handleApply} disabled={!tempRange.from}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
