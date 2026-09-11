import { useAuthStore } from "~/stores/auth.store"

const publicPaths = ["/login", "/forgot-password", "/register", "/reset-password", "/verify-email"]

export default defineNuxtRouteMiddleware((to) => {
  if (publicPaths.includes(to.path)) return

  const authStore = useAuthStore()
  authStore.restoreSession()

  if (!authStore.isAuthenticated) {
    return navigateTo("/login")
  }
})
