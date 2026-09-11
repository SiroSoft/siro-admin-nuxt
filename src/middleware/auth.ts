import { useAuthStore } from "~/stores/auth.store"

const publicPaths = ["/login", "/forgot-password", "/register", "/reset-password", "/verify-email"]

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  // Always restore: public pages (e.g. /login) gate their form on
  // isLoading, which stays true forever if restore never runs.
  authStore.restoreSession()

  if (publicPaths.includes(to.path)) return

  if (!authStore.isAuthenticated) {
    return navigateTo("/login")
  }
})
