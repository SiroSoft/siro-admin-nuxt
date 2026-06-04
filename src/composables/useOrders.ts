import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { ordersService } from "~/services/orders.service"
import { useI18n } from "~/composables/useI18n"
import type { PaginationParams } from "~/types/api"
import type { CreateOrderRequest, UpdateOrderRequest } from "~/types/order"

export function useOrders(params?: Ref<PaginationParams | undefined>) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: computed(() => ["orders", params?.value]),
    queryFn: () => ordersService.list(params?.value),
  })

  return {
    orders: computed(() => query.data.value?.data ?? []),
    meta: computed(() => query.data.value?.meta),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useOrder(id: Ref<number | null>) {
  return useQuery({
    queryKey: computed(() => ["orders", id.value]),
    queryFn: () => ordersService.get(id.value!),
    enabled: computed(() => !!id.value),
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      useToast().success(t('toast.orderCreated'), t('toast.orderCreatedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.orderCreateError'))
    },
  })
}

export function useUpdateOrder(id: Ref<number>) {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (data: UpdateOrderRequest) => ordersService.update(id.value, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      useToast().success(t('toast.orderUpdated'), t('toast.orderUpdatedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.orderUpdateError'))
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => ordersService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      useToast().success(t('toast.orderStatusUpdated'), t('toast.orderStatusUpdatedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.orderStatusUpdateError'))
    },
  })
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (id: number) => ordersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      useToast().success(t('toast.orderDeleted'), t('toast.orderDeletedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.orderDeleteError'))
    },
  })
}
