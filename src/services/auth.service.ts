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

  async forgotPassword(email: string) {
    const res = await api.post("/api/auth/forgot-password", { email })
    return res.data
  },

  async register(data: { name: string; email: string; password: string; password_confirmation: string }) {
    const res = await api.post("/api/auth/register", data)
    return res.data
  },

  async resetPassword(data: { token: string; password: string; password_confirmation: string }) {
    const res = await api.post("/api/auth/reset-password", data)
    return res.data
  },

  async verifyEmail(data: { token: string }) {
    const res = await api.post("/api/auth/verify-email", data)
    return res.data
  },

  async resendVerificationEmail() {
    const res = await api.post("/api/auth/verify-email/resend")
    return res.data
  },
}
