import {
  fetchStores,
  fetchStore,
  createStore,
  updateStore,
  deleteStore,
} from "@/api/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Store, StoreCreate, StoreUpdate } from "@/types/store";

// Get all stores
export const useStores = () => {
  return useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: fetchStores,
  });
};

// Get a single store by ID
export const useStore = (storeId: string) => {
  return useQuery<Store>({
    queryKey: ["stores", storeId],
    queryFn: () => fetchStore(storeId),
    enabled: !!storeId,
  });
};

// Create a new store
export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StoreCreate) => createStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
};

// Update an existing store
export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      data,
    }: {
      storeId: string;
      data: StoreUpdate;
    }) => updateStore(storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
};

// Delete a store
export const useDeleteStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storeId: string) => deleteStore(storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
};
