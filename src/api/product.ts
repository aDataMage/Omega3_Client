import axios from "@/lib/axios";
import {
  BrandsTable,
  Product,
  ProductCreate,
  ProductsTable,
  ProductUpdate,
  TopProducts,
} from "../types/product";

const BASE_URL = "/products";

// Get all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get a single product by ID
export const fetchProduct = async (productId: string): Promise<Product> => {
  try {
    const response = await axios.get<Product>(`${BASE_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (
  productData: ProductCreate
): Promise<Product> => {
  try {
    const response = await axios.post<Product>(BASE_URL, productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (
  productId: string,
  productData: ProductUpdate
): Promise<Product> => {
  try {
    const response = await axios.put<Product>(
      `${BASE_URL}/${productId}`,
      productData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);
    throw error;
  }
};

export const getTopNProductByMetric = async (
  metric: string,
  n: number,
  start_date: string | undefined,
  end_date: string | undefined
): Promise<TopProducts[]> => {
  try {
    const response = await axios.get<TopProducts[]>(
      `${BASE_URL}/top/?metric=${metric}&n=${n}&start_date=${start_date}&end_date=${end_date}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching top ${n} products by ${metric}:`, error);
    throw error;
  }
};

export const getBrands = async () => {
  try {
    const response = await axios.get<string[]>(`${BASE_URL}/filters/brands`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching brands`, error);
    throw error;
  }
};

export const getProductNames = async (brandNames: string[] | undefined) => {
  try {
    const response = await axios.get<{ product_id: string; name: string }[]>(
      `${BASE_URL}/filters/products?selected_brands=${brandNames}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching Product Names`, error);
    throw error;
  }
};

export const getBrandsTableData = async (
  start_date: string | undefined,
  end_date: string | undefined
) => {
  try {
    const response = await axios.get<BrandsTable[]>(
      `${BASE_URL}/table/brand?start_date=${start_date}&end_date=${end_date}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching brand table`, error);
    throw error;
  }
};

export const getProductsTableData = async (
  start_date: string | undefined,
  end_date: string | undefined
) => {
  try {
    const response = await axios.get<ProductsTable[]>(
      `${BASE_URL}/table/product?start_date=${start_date}&end_date=${end_date}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching product table`, error);
    throw error;
  }
};

export default {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopNProductByMetric,
  getBrands,
  getProductNames,
  getBrandsTableData,
  getProductsTableData,
};
