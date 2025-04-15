"use client"
import { Button } from "@/components/ui/button";
import { useDateRangeStore } from "@/stores/useDateRangeStore";
import { DatePickerWithRange } from "@/components/dashboard/DatePickerWithRange";
import { addDays } from "date-fns";

const FilterBar = () => {
  const { setDateRange } = useDateRangeStore();

  const setLast30Days = () => {
    const endDate = new Date();
    const startDate = addDays(endDate, -30);
    setDateRange({ from: startDate, to: endDate });
  };

  const setLastYear = () => {
    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
    setDateRange({ from: startDate, to: endDate });
  };

  return (
    <div className="flex items-center justify-between bg-white">
      <DatePickerWithRange />
      <Button variant="outline" className="ml-4" onClick={setLast30Days}>
        Last 30 Days
      </Button>
      <Button variant="outline" className="ml-4" onClick={setLastYear}>
        1 year
      </Button>
    </div>
  );
};

export default FilterBar;
