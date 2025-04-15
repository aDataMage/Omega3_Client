import {
  fetchReturns,
  fetchReturn,
  createReturn,
  updateReturn,
  deleteReturn,
} from "@/api/returns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Return, ReturnCreate, ReturnUpdate } from "@/types/returns";

// Get all returns
export const useReturns = () => {
  return useQuery<Return[]>({
    queryKey: ["returns"],
    queryFn: fetchReturns,
  });
};

// Get a single return by ID
export const useReturn = (returnId: string) => {
  return useQuery<Return>({
    queryKey: ["returns", returnId],
    queryFn: () => fetchReturn(returnId),
    enabled: !!returnId,
  });
};

// Create a new return
export const useCreateReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReturnCreate) => createReturn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
    },
  });
};

// Update an existing return
export const useUpdateReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      returnId,
      data,
    }: {
      returnId: string;
      data: ReturnUpdate;
    }) => updateReturn(returnId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
    },
  });
};

// Delete a return
export const useDeleteReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (returnId: string) => deleteReturn(returnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
    },
  });
};
