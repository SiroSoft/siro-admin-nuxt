import api from "./api"
import type { PaginationParams } from "~/types/api"
import type { Post, PostsResponse, CreatePostRequest, UpdatePostRequest } from "~/types/post"

export const postsService = {
  async list(params?: PaginationParams) {
    const res = await api.get<PostsResponse>("/api/posts", { params })
    return res.data
  },

  async get(id: number) {
    const res = await api.get<{ data: Post; message: string }>(`/api/posts/${id}`)
    return res.data.data
  },

  async create(data: CreatePostRequest) {
    const res = await api.post<{ data: Post; message: string }>("/api/posts", data)
    return res.data.data
  },

  async update(id: number, data: UpdatePostRequest) {
    const res = await api.put<{ data: Post; message: string }>(`/api/posts/${id}`, data)
    return res.data.data
  },

  async delete(id: number) {
    await api.delete(`/api/posts/${id}`)
  },
}
