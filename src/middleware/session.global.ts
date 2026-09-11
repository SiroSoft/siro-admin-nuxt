import { useAuthStore } from "~/stores/auth.store"

/**
 * Global session restore — runs on every navigation (including public pages
 * like /login that don't declare the "auth" middleware).
 *
 * Without this, authStore.isLoading stays true forever on public pages and
 * any UI gated on it (e.g. the login form) never renders.
 */
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  authStore.restoreSession()
})
