import axios from "@/lib/axios";
import { Return, ReturnCreate, ReturnUpdate } from "../types/returns";

const BASE_URL = "/returns";

// Get all returns
export const fetchReturns = async (): Promise<Return[]> => {
  try {
    const response = await axios.get<Return[]>(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching returns:', error);
    throw error;
  }
};

// Get a single return by ID
export const fetchReturn = async (returnId: string): Promise<Return> => {
  try {
    const response = await axios.get<Return>(`${BASE_URL}/${returnId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching return ${returnId}:`, error);
    throw error;
  }
};

// Create a new return
export const createReturn = async (returnData: ReturnCreate): Promise<Return> => {
  try {
    const response = await axios.post<Return>(BASE_URL, returnData);
    return response.data;
  } catch (error) {
    console.error('Error creating return:', error);
    throw error;
  }
};

// Update an existing return
export const updateReturn = async (returnId: string, returnData: ReturnUpdate): Promise<Return> => {
  try {
    const response = await axios.put<Return>(`${BASE_URL}/${returnId}`, returnData);
    return response.data;
  } catch (error) {
    console.error(`Error updating return ${returnId}:`, error);
    throw error;
  }
};

// Delete a return
export const deleteReturn = async (returnId: string): Promise<void> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${returnId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting return ${returnId}:`, error);
    throw error;
  }
};

export default {
  fetchReturns,
  fetchReturn,
  createReturn,
  updateReturn,
  deleteReturn,
};
