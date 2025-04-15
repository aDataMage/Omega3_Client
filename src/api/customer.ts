import axios from "@/lib/axios";
import { Customer, CreateCustomer, UpdateCustomer } from "@/types/customer";

const BASE_URL = "/customers";

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await axios.get<Customer[]>(BASE_URL);
  return response.data;
};

export const getCustomerById = async (
  customer_id: string
): Promise<Customer> => {
  const response = await axios.get(`${BASE_URL}/${customer_id}`);
  return response.data;
};

export const createCustomer = async (
  data: CreateCustomer
): Promise<Customer> => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const updateCustomer = async (
  customer_id: string,
  data: UpdateCustomer
): Promise<Customer> => {
  const response = await axios.put(`${BASE_URL}/${customer_id}`, data);
  return response.data;
};

export const deleteCustomer = async (customer_id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${customer_id}`);
};

export default {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
}