import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopNProductByMetric,
} from "@/api/product";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, ProductCreate, ProductUpdate, TopProducts } from "@/types/product";

// Get all products
export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

// Get a single product by ID
export const useProduct = (productId: string) => {
  return useQuery<Product>({
    queryKey: ["products", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  });
};

// Create a new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductCreate) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Update an existing product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: ProductUpdate;
    }) => updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useTopNProducts = (n: number, metric: string) => {
  return useQuery<TopProducts[]>({
    queryKey: ["products", "top", n, metric],
    queryFn: () => getTopNProductByMetric(metric, n), // Replace with actual API call for top products
    enabled: !!n && !!metric,
  });
}
