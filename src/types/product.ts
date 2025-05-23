enum Brand {
  BRANDA = "BrandA",
  BRANDB = "BrandB",
  BRANDC = "BrandC",
  BRANDD = "BrandD",
  BRANDE = "BrandE",
  BRANDF = "BrandF",
  BRANDG = "BrandG",
  BRANDH = "BrandH",
  BRANDI = "BrandI",
  BRANDJ = "BrandJ",
}

enum Category {
  Electronics = "electronics",
  Fashion = "fashion",
  Home_Appliances = "home_appliances",
  Beauty = "beauty",
  Sports = "sports",
  Books = "books",
  Toys = "toys",
  Automotive = "automotive",
  Groceries = "groceries",
  Furniture = "furniture",
  Health = "health",
}

export interface ProductBase {
  name: string;
  brand_name: Brand;
  price: number;
  cost: number;
  category: Category;
  stock_quantity: number;
}

export interface ProductCreate extends ProductBase {}

export interface Product extends ProductBase {
  product_id: string;
}

export interface TopProducts extends ProductBase {
  metric_key: string;
  metric_value: number;
}

export interface BrandsTable {
  brand_name: Brand;
  top_product: string;
  top_region: string;
  total_sales: number;
  total_profit: number;
  total_returns: number;
  total_orders: number;
  sales_contribution_percentage: number;
}

export interface ProductsTable {
  product_id: string;
  product_name: string;
  top_region: string;
  category: Category;
  brand: Brand;
  cost: number;
  stock_quantity: number;
  total_sales: number;
  total_profit: number;
  total_returns: number;
  total_orders: number;
  sales_contribution_percentage: number;
}

export interface ProductUpdate extends Partial<ProductBase> {}
