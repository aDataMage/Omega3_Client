import axios from "@/lib/axios";
import { Store, StoreCreate, StoreUpdate } from "../types/store";

const BASE_URL = "/stores";

// Get all stores
export const fetchStores = async (): Promise<Store[]> => {
  try {
    const response = await axios.get<Store[]>(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

// Get a single store by ID
export const fetchStore = async (storeId: string): Promise<Store> => {
  try {
    const response = await axios.get<Store>(`${BASE_URL}/${storeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching store ${storeId}:`, error);
    throw error;
  }
};

// Create a new store
export const createStore = async (storeData: StoreCreate): Promise<Store> => {
  try {
    const response = await axios.post<Store>(BASE_URL, storeData);
    return response.data;
  } catch (error) {
    console.error('Error creating store:', error);
    throw error;
  }
};

// Update an existing store
export const updateStore = async (storeId: string, storeData: StoreUpdate): Promise<Store> => {
  try {
    const response = await axios.put<Store>(`${BASE_URL}/${storeId}`, storeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating store ${storeId}:`, error);
    throw error;
  }
};

// Delete a store
export const deleteStore = async (storeId: string): Promise<void> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${storeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting store ${storeId}:`, error);
    throw error;
  }
};

export default {
  fetchStores,
  fetchStore,
  createStore,
  updateStore,
  deleteStore,
};