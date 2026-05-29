import api from "./api"
import type { Settings, UpdateSettingsRequest } from "~/types/settings"

export const settingsService = {
  async get() {
    const res = await api.get<{ data: Settings; message: string }>("/api/settings")
    return res.data
  },

  async update(data: UpdateSettingsRequest) {
    const res = await api.put<{ data: Settings; message: string }>("/api/settings", data)
    return res.data.data
  },
}
