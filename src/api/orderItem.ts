import axios from "@/lib/axios";
import { OrderItem, OrderItemCreate, OrderItemUpdate } from "../types/orderItem";

const BASE_URL = "/order-items";

// Get all order items
export const fetchOrderItems = async (): Promise<OrderItem[]> => {
  try {
    const response = await axios.get<OrderItem[]>(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching order items:', error);
    throw error;
  }
};

// Get a single order item by ID
export const fetchOrderItem = async (orderItemId: string): Promise<OrderItem> => {
  try {
    const response = await axios.get<OrderItem>(`${BASE_URL}/${orderItemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order item ${orderItemId}:`, error);
    throw error;
  }
};

// Create a new order item
export const createOrderItem = async (orderItemData: OrderItemCreate): Promise<OrderItem> => {
  try {
    const response = await axios.post<OrderItem>(BASE_URL, orderItemData);
    return response.data;
  } catch (error) {
    console.error('Error creating order item:', error);
    throw error;
  }
};

// Update an existing order item
export const updateOrderItem = async (orderItemId: string, orderItemData: OrderItemUpdate): Promise<OrderItem> => {
  try {
    const response = await axios.put<OrderItem>(`${BASE_URL}/${orderItemId}`, orderItemData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order item ${orderItemId}:`, error);
    throw error;
  }
};

// Delete an order item
export const deleteOrderItem = async (orderItemId: string): Promise<void> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${orderItemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting order item ${orderItemId}:`, error);
    throw error;
  }
};

export default {
  fetchOrderItems,
  fetchOrderItem,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
}