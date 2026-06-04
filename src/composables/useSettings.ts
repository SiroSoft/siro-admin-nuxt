import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { settingsService } from "~/services/settings.service"
import type { UpdateSettingsRequest } from "~/types/settings"

export function useSettings() {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: ["settings"], queryFn: () => settingsService.get() })
  const mutation = useMutation({
    mutationFn: (data: UpdateSettingsRequest) => settingsService.update(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["settings"] }) },
  })
  return { ...query, mutation }
}
