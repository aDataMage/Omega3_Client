
enum Brand {
    BRANDA = "BrandA",
    BRANDB = "BrandB",
    BRANDC = "BrandC",
    BRANDD= "BrandD",
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
  brand: string;
  price: number;
  stock_quantity: number;
}

export interface ProductCreate extends ProductBase {}

export interface Product extends ProductBase {
  product_id: string;
}

export interface ProductUpdate extends Partial<ProductBase> {}