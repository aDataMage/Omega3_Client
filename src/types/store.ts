import { Regoin } from "./customer";

export interface StoreBase {
  store_id: string;
  manager_name: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  region: Regoin;
}

export interface StoreCreate extends StoreBase {}

export interface Store extends StoreBase {
  store_id: string;
}

export interface TopStores extends StoreBase {
  metric_key: string;
  metric_value: number;
  top_product_name: string;
}

export interface RegionTable {
  region_name: string;
  top_store: string;
  top_product: string;
  total_sales: number;
  total_profit: number;
  total_returns: number;
  total_orders: number;
  sales_contribution_percentage: number;
}
export interface StoreTable {
  store_id: string;
  store_name: string;
  region: string;
  top_product: string;
  total_sales: number;
  total_profit: number;
  total_returns: number;
  total_orders: number;
  sales_contribution_percentage: number;
}

export interface StoreUpdate extends Partial<StoreBase> {}
