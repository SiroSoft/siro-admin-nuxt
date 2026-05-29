import api from "./api"
import type { PaginationParams } from "~/types/api"
import type { Product, ProductsResponse, CreateProductRequest, UpdateProductRequest } from "~/types/product"

export const productsService = {
  async list(params?: PaginationParams) {
    const res = await api.get<ProductsResponse>("/api/products", { params })
    return res.data
  },

  async get(id: number) {
    const res = await api.get<{ data: Product; message: string }>(`/api/products/${id}`)
    return res.data.data
  },

  async create(data: CreateProductRequest) {
    const res = await api.post<{ data: Product; message: string }>("/api/products", data)
    return res.data.data
  },

  async update(id: number, data: UpdateProductRequest) {
    const res = await api.put<{ data: Product; message: string }>(`/api/products/${id}`, data)
    return res.data.data
  },

  async delete(id: number) {
    await api.delete(`/api/products/${id}`)
  },
}
