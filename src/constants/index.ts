export const STORAGE_KEYS = {
  ACCESS_TOKEN: "siro_access_token",
  REFRESH_TOKEN: "siro_refresh_token",
  USER: "siro_user",
} as const

export const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
} as const

export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const
