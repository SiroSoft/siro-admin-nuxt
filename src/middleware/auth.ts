import { useAuthStore } from "~/stores/auth.store"

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  authStore.restoreSession()

  if (!authStore.isAuthenticated) {
    return navigateTo("/login")
  }
})
