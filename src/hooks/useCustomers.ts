import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '@/api/customer';
import type { CreateCustomer, UpdateCustomer } from '@/types/customer';

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });
};

export const useCustomer = (customer_id: string) => {
  return useQuery({
    queryKey: ['customer', customer_id],
    queryFn: () => getCustomerById(customer_id),
    enabled: !!customer_id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customer_id, data }: { customer_id: string; data: UpdateCustomer }) =>
      updateCustomer(customer_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
