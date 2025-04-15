// src/hooks/useOrders.ts
import {
  fetchOrders,
  fetchOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from "@/api/order";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order, OrderCreate, OrderUpdate } from "@/types/order";

// Get all orders
export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
};

// Get a single order by ID
export const useOrder = (orderId: string) => {
  return useQuery<Order>({
    queryKey: ["orders", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: !!orderId,
  });
};

// Create a new order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrderCreate) => createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

// Update an existing order
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: OrderUpdate }) =>
      updateOrder(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

// Delete an order
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
