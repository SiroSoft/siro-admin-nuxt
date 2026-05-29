import api from "./api"
import type { PaginationParams } from "~/types/api"
import type { Order, OrdersResponse, CreateOrderRequest, UpdateOrderRequest } from "~/types/order"

export const ordersService = {
  async list(params?: PaginationParams) {
    const res = await api.get<OrdersResponse>("/api/orders", { params })
    return res.data
  },

  async get(id: number) {
    const res = await api.get<{ data: Order; message: string }>(`/api/orders/${id}`)
    return res.data.data
  },

  async create(data: CreateOrderRequest) {
    const res = await api.post<{ data: Order; message: string }>("/api/orders", data)
    return res.data.data
  },

  async update(id: number, data: UpdateOrderRequest) {
    const res = await api.put<{ data: Order; message: string }>(`/api/orders/${id}`, data)
    return res.data.data
  },

  async updateStatus(id: number, status: string) {
    const res = await api.patch<{ data: Order; message: string }>(`/api/orders/${id}/status`, { status })
    return res.data.data
  },

  async delete(id: number) {
    await api.delete(`/api/orders/${id}`)
  },
}
