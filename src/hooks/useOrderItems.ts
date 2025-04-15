import {
  fetchOrderItems,
  fetchOrderItem,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} from "@/api/orderItem";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderItem, OrderItemCreate, OrderItemUpdate } from "@/types/orderItem";

// Get all order items
export const useOrderItems = () => {
  return useQuery<OrderItem[]>({
    queryKey: ["order-items"],
    queryFn: fetchOrderItems,
  });
};

// Get a single order item
export const useOrderItem = (orderItemId: string) => {
  return useQuery<OrderItem>({
    queryKey: ["order-items", orderItemId],
    queryFn: () => fetchOrderItem(orderItemId),
    enabled: !!orderItemId,
  });
};

// Create a new order item
export const useCreateOrderItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrderItemCreate) => createOrderItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-items"] });
    },
  });
};

// Update an existing order item
export const useUpdateOrderItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderItemId,
      data,
    }: {
      orderItemId: string;
      data: OrderItemUpdate;
    }) => updateOrderItem(orderItemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-items"] });
    },
  });
};

// Delete an order item
export const useDeleteOrderItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderItemId: string) => deleteOrderItem(orderItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-items"] });
    },
  });
};
