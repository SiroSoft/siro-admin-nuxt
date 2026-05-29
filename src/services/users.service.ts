import api from "./api"
import type { ApiResponse, PaginationMeta, PaginationParams } from "~/types/api"
import type { User, CreateUserRequest, UpdateUserRequest } from "~/types/user"

export interface UsersResponse {
  data: User[]
  meta: PaginationMeta
}

export const usersService = {
  async list(params?: PaginationParams) {
    const res = await api.get<UsersResponse>("/api/users", { params })
    return res.data
  },

  async get(id: number) {
    const res = await api.get<ApiResponse<User>>(`/api/users/${id}`)
    return res.data.data
  },

  async create(data: CreateUserRequest) {
    const res = await api.post<ApiResponse<User>>("/api/users", data)
    return res.data.data
  },

  async update(id: number, data: UpdateUserRequest) {
    const res = await api.put<ApiResponse<User>>(`/api/users/${id}`, data)
    return res.data.data
  },

  async delete(id: number) {
    await api.delete(`/api/users/${id}`)
  },
}
