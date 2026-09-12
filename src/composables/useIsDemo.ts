import { useAuthStore } from "~/stores/auth.store"
import { DEMO_EMAIL } from "~/constants"

/**
 * True when the signed-in user is the public read-only demo account.
 * Demo writes are blocked server-side (DemoGuard); UI uses this to
 * disable mutating affordances (e.g. uploads) with an explanation
 * instead of letting the click fail with a bare 403.
 */
export function useIsDemo() {
  const authStore = useAuthStore()
  return computed(() => {
    const email = typeof authStore.user?.email === "string" ? authStore.user.email.toLowerCase() : ""
    return email !== "" && email === DEMO_EMAIL.toLowerCase()
  })
}
