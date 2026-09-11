import { defineStore } from "pinia"
import { STORAGE_KEYS } from "~/constants"
import type { User } from "~/types/auth"

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(true)

  function setUser(newUser: User | null) {
    user.value = newUser
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function login(userData: User, accessToken: string, refreshToken: string) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
    user.value = userData
    isLoading.value = false
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    user.value = null
    isLoading.value = false
  }

  function restoreSession(): User | null {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      isLoading.value = false
      return null
    }
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      const userStr = localStorage.getItem(STORAGE_KEYS.USER)
      if (token && userStr) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]))
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
            localStorage.removeItem(STORAGE_KEYS.USER)
            isLoading.value = false
            return null
          }
        } catch {
          // Invalid token format, proceed with restore
        }
        const parsed = JSON.parse(userStr) as User
        user.value = parsed
        isLoading.value = false
        return parsed
      }
    } catch {
      if (typeof window !== "undefined") {
        try { localStorage.removeItem(STORAGE_KEYS.USER) } catch {}
      }
    }
    isLoading.value = false
    return null
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setLoading,
    login,
    logout,
    restoreSession,
  }
})
