import { useQuery } from "@tanstack/vue-query"
import { dashboardService } from "~/services/dashboard.service"

export function useDashboard() {
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getStats(),
    enabled: import.meta.client,
  })

  return {
    ...query,
    isRefetching: query.isRefetching,
  }
}
