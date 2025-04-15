import axios from "@/lib/axios";
import { Order, OrderCreate, OrderUpdate } from "../types/order";

const BASE_URL = "/orders";

// Get all orders
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get<Order[]>(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Get a single order by ID
export const fetchOrder = async (orderId: string): Promise<Order> => {
  try {
    const response = await axios.get<Order>(`${BASE_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData: OrderCreate): Promise<Order> => {
  try {
    const response = await axios.post<Order>(BASE_URL, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Update an existing order
export const updateOrder = async (orderId: string, orderData: OrderUpdate): Promise<Order> => {
  try {
    const response = await axios.put<Order>(`${BASE_URL}/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    throw error;
  }
};

// Delete an order
export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting order ${orderId}:`, error);
    throw error;
  }
};

// Export all functions
export default {
  fetchOrders,
  fetchOrder,
  createOrder,
  updateOrder,
  deleteOrder,
};