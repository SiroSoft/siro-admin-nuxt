import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { ordersService } from "~/services/orders.service"
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

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      useToast().success("Order created", "Order has been created successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to create order.")
    },
  })
}

export function useUpdateOrder(id: Ref<number>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateOrderRequest) => ordersService.update(id.value, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      useToast().success("Order updated", "Order has been updated successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to update order.")
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => ordersService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      useToast().success("Status updated", "Order status has been updated.")
    },
    onError: () => {
      useToast().error("Error", "Failed to update order status.")
    },
  })
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => ordersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      useToast().success("Order deleted", "Order has been deleted successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to delete order.")
    },
  })
}
