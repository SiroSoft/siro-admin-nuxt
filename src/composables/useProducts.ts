import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { productsService } from "~/services/products.service"
import type { PaginationParams } from "~/types/api"
import type { CreateProductRequest, UpdateProductRequest } from "~/types/product"

export function useProducts(params?: Ref<PaginationParams | undefined>) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: computed(() => ["products", params?.value]),
    queryFn: () => productsService.list(params?.value),
  })

  return {
    products: computed(() => query.data.value?.data ?? []),
    meta: computed(() => query.data.value?.meta),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useProduct(id: Ref<number | null>) {
  return useQuery({
    queryKey: computed(() => ["products", id.value]),
    queryFn: () => productsService.get(id.value!),
    enabled: computed(() => !!id.value),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      useToast().success("Product created", "Product has been created successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to create product.")
    },
  })
}

export function useUpdateProduct(id: Ref<number>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProductRequest) => productsService.update(id.value, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      useToast().success("Product updated", "Product has been updated successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to update product.")
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      useToast().success("Product deleted", "Product has been deleted successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to delete product.")
    },
  })
}
