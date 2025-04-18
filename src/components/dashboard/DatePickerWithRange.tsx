"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
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
import { CustomSelectDropdown } from "./CustomDropdown"; // Import your custom dropdown

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { dateRange, setDateRange } = useDateRangeStore();
  const minDate = new Date(2023, 0, 1); // Jan 1, 2023
  const maxDate = new Date(); // today

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
            <CalendarIcon />
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
          {/* Use CustomDropdown for selecting dates */}
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            fromDate={minDate}
            toDate={maxDate}
            onSelect={setDateRange}
            numberOfMonths={2}
            // captionLayout="dropdown" // Switch to dropdown mode
            components={{
              Dropdown: CustomSelectDropdown, // Use CustomDropdown here
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
