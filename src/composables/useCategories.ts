import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { categoriesService } from "~/services/categories.service"
import { useI18n } from "~/composables/useI18n"
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
  const { t } = useI18n()

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      useToast().success(t('toast.categoryCreated'), t('toast.categoryCreatedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.categoryCreateError'))
    },
  })
}

export function useUpdateCategory(id: Ref<number>) {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => categoriesService.update(id.value, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      useToast().success(t('toast.categoryUpdated'), t('toast.categoryUpdatedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.categoryUpdateError'))
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (id: number) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      useToast().success(t('toast.categoryDeleted'), t('toast.categoryDeletedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.categoryDeleteError'))
    },
  })
}
