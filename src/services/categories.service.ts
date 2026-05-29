import api from "./api"
import type { PaginationParams } from "~/types/api"
import type { Category, CategoriesResponse, CreateCategoryRequest, UpdateCategoryRequest } from "~/types/category"

export const categoriesService = {
  async list(params?: PaginationParams) {
    const res = await api.get<CategoriesResponse>("/api/categories", { params })
    return res.data
  },

  async get(id: number) {
    const res = await api.get<{ data: Category; message: string }>(`/api/categories/${id}`)
    return res.data.data
  },

  async create(data: CreateCategoryRequest) {
    const res = await api.post<{ data: Category; message: string }>("/api/categories", data)
    return res.data.data
  },

  async update(id: number, data: UpdateCategoryRequest) {
    const res = await api.put<{ data: Category; message: string }>(`/api/categories/${id}`, data)
    return res.data.data
  },

  async delete(id: number) {
    await api.delete(`/api/categories/${id}`)
  },
}
