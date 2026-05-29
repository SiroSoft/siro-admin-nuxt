import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { categoriesService } from "~/services/categories.service"
import type { PaginationParams } from "~/types/api"
import type { CreateCategoryRequest, UpdateCategoryRequest } from "~/types/category"

export function useCategories(params?: Ref<PaginationParams | undefined>) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: computed(() => ["categories", params?.value]),
    queryFn: () => categoriesService.list(params?.value),
  })

  return {
    categories: computed(() => query.data.value?.data ?? []),
    meta: computed(() => query.data.value?.meta),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useCategory(id: Ref<number | null>) {
  return useQuery({
    queryKey: computed(() => ["categories", id.value]),
    queryFn: () => categoriesService.get(id.value!),
    enabled: computed(() => !!id.value),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      useToast().success("Category created", "Category has been created successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to create category.")
    },
  })
}

export function useUpdateCategory(id: Ref<number>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => categoriesService.update(id.value, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      useToast().success("Category updated", "Category has been updated successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to update category.")
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      useToast().success("Category deleted", "Category has been deleted successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to delete category.")
    },
  })
}
