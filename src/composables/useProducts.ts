import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { productsService } from "~/services/products.service"
import { useI18n } from "~/composables/useI18n"
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
  const { t } = useI18n()

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      useToast().success(t('toast.productCreated'), t('toast.productCreatedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.productCreateError'))
    },
  })
}

export function useUpdateProduct(id: Ref<number>) {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (data: UpdateProductRequest) => productsService.update(id.value, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      useToast().success(t('toast.productUpdated'), t('toast.productUpdatedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.productUpdateError'))
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (id: number) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      useToast().success(t('toast.productDeleted'), t('toast.productDeletedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.productDeleteError'))
    },
  })
}
