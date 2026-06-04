import api from "./api"
import type { PaginationParams } from "~/types/api"
import type { Product, ProductsResponse, CreateProductRequest, UpdateProductRequest } from "~/types/product"
import { mapProductFromApi, mapProductToApi } from "~/utils/api-mapping"

export const productsService = {
  async list(params?: PaginationParams) {
    const res = await api.get<ProductsResponse>("/api/products", { params })
    return { ...res.data, data: res.data.data.map(mapProductFromApi) }
  },

  async get(id: number) {
    const res = await api.get<{ data: Product; message: string }>(`/api/products/${id}`)
    return mapProductFromApi(res.data.data)
  },

  async create(data: CreateProductRequest) {
    const res = await api.post<{ data: Product; message: string }>("/api/products", mapProductToApi(data))
    return mapProductFromApi(res.data.data)
  },

  async update(id: number, data: UpdateProductRequest) {
    const res = await api.put<{ data: Product; message: string }>(`/api/products/${id}`, mapProductToApi(data))
    return mapProductFromApi(res.data.data)
  },

  async delete(id: number) {
    await api.delete(`/api/products/${id}`)
  },
}
