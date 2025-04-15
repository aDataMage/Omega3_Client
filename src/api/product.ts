import axios from "@/lib/axios";
import { Product, ProductCreate, ProductUpdate } from "../types/product";

const BASE_URL = "/products";

// Get all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
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
export const createProduct = async (productData: ProductCreate): Promise<Product> => {
  try {
    const response = await axios.post<Product>(BASE_URL, productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (productId: string, productData: ProductUpdate): Promise<Product> => {
  try {
    const response = await axios.put<Product>(`${BASE_URL}/${productId}`, productData);
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

export default {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};