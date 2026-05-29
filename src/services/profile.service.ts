import api from "./api"
import type { User } from "~/types/user"

export const profileService = {
  async get() {
    const res = await api.get<{ data: User; message: string }>("/api/profile")
    return res.data.data
  },

  async update(data: { name: string; email: string; avatar?: string }) {
    const res = await api.put<{ data: User; message: string }>("/api/profile", data)
    return res.data.data
  },

  async changePassword(data: { current_password: string; new_password: string; new_password_confirmation: string }) {
    const res = await api.put<{ data: null; message: string }>("/api/profile/password", data)
    return res.data
  },
}
