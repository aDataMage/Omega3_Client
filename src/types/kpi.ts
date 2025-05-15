export interface KPIs {
  metric_name:
    | "Total Sales"
    | "Total Profit"
    | "Total Orders"
    | "Total Returns";
  total_value: number;
  percentage_change: Partial<number>;
  trend_data: {
    date: string;
    value: number;
  }[];
  previous_total: number;
  current_date_range: [string, string];
  previous_date_range: [string, string];
}

export interface Customers_Metrics {
  data: {
    metric_name: string;
    total_value: number;
    comparisons: Array<{ name: string; value: number }>;
  };
}
