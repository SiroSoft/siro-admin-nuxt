import api from "./api"
import type { LoginRequest, LoginResponse, User } from "~/types/auth"
import type { ApiResponse } from "~/types/api"

export const authService = {
  async login(data: LoginRequest) {
    const res = await api.post<LoginResponse>("/api/auth/login", data)
    return res.data
  },

  async refresh(refreshToken: string) {
    const res = await api.post<LoginResponse>("/api/auth/refresh", {
      refresh_token: refreshToken,
    })
    return res.data
  },

  async me() {
    const res = await api.get<ApiResponse<User>>("/api/auth/me")
    return res.data.data
  },

  async logout() {
    await api.post("/api/auth/logout")
  },
}
