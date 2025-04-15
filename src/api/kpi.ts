import axios from "@/lib/axios";
import { KPIs } from "@/types/kpi";
import { useDateRangeStore } from "@/stores/useDateRangeStore";
const BASE_URL = "/kpi";

export const getKpis = async (): Promise<KPIs[]> => {
    // Access the selected date range from the store
  // const { dateRange } = useDateRangeStore();
  // console.log("dateRange", dateRange);
  // Ensure that dateRange exists and has both `from` and `to`
  // if (!dateRange?.from || !dateRange?.to) {
  //   throw new Error("Date range is not properly selected.");
  // }

  try {
    const response = await axios.get<KPIs[]>(BASE_URL+"/?start_date=2023-01-01&end_date=2023-12-31");
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export default {
    getKpis
};