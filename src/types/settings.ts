import type { components } from "./api"

export type Settings = components["schemas"]["Settings"]
export type UpdateSettingsRequest = components["schemas"]["UpdateSettingsRequest"]

export interface SettingsResponse {
  data: Settings
  message: string
}
