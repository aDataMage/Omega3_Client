import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopNProductByMetric,
  getBrands,
  getProductNames
} from "@/api/product";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, ProductCreate, ProductUpdate, TopProducts } from "@/types/product";
import {useDateRangeStore} from "@/stores/useDateRangeStore"

// Get all products
export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};
export const useBrands = () => {
  return useQuery<string[]>({
    queryKey: ["brands"],
    queryFn: getBrands,
  });
};
export const useProductsNames = () => {
  return useQuery<string[]>({
    queryKey: ["productsNames"],
    queryFn: getProductNames,
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
      queryClient.invalidateQueries({ queryKey: ["products","productsNames"] });
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
      queryClient.invalidateQueries({ queryKey: ["products","productsNames"] });
    },
  });
};

// Delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products","productsNames"] });
    },
  });
};

export const useTopNProducts = (n: number, metric: string) => {
  const { dateRange } = useDateRangeStore();
  const startDate = dateRange?.from?.toISOString().split("T")[0];
  const endDate = dateRange?.to?.toISOString().split("T")[0];
  return useQuery<TopProducts[]>({
    queryKey: ["products", "top", n, metric],
    queryFn: () => getTopNProductByMetric(metric, n, startDate, endDate), // Replace with actual API call for top products
    enabled: !!n && !!metric,
  });
 
}
