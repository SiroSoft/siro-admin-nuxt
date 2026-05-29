import api from "./api"
import type { DashboardStats } from "~/types/dashboard"

export const dashboardService = {
  async getStats() {
    const res = await api.get<DashboardStats>("/api/dashboard/stats")
    return res.data
  },
}
