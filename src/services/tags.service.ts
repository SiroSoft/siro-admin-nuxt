import api from "./api"
import type { PaginationParams } from "~/types/api"
import type { Tag, TagsResponse, CreateTagRequest, UpdateTagRequest } from "~/types/tag"

export const tagsService = {
  async list(params?: PaginationParams) {
    const res = await api.get<TagsResponse>("/api/tags", { params })
    return res.data
  },

  async get(id: number) {
    const res = await api.get<{ data: Tag; message: string }>(`/api/tags/${id}`)
    return res.data.data
  },

  async create(data: CreateTagRequest) {
    const res = await api.post<{ data: Tag; message: string }>("/api/tags", data)
    return res.data.data
  },

  async update(id: number, data: UpdateTagRequest) {
    const res = await api.put<{ data: Tag; message: string }>(`/api/tags/${id}`, data)
    return res.data.data
  },

  async delete(id: number) {
    await api.delete(`/api/tags/${id}`)
  },
}
