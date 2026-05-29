import { useMutation, useQuery } from "@tanstack/vue-query"
import { authService } from "~/services/auth.service"
import { useAuthStore } from "~/stores/auth.store"
import type { LoginRequest } from "~/types/auth"

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (res) => {
      const payload = res.data!
      authStore.login(payload.user!, payload.token!, payload.refresh_token!)
      router.push("/")
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      authStore.logout()
      router.push("/login")
    },
  })

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      authStore.setLoading(true)
      try {
        const userData = await authService.me()
        authStore.setUser(userData)
        return userData
      } catch {
        authStore.logout()
        return null
      } finally {
        authStore.setLoading(false)
      }
    },
    enabled: computed(() => authStore.isAuthenticated),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  return {
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading || sessionQuery.isLoading.value),
    login: loginMutation.mutate,
    loginError: loginMutation.error,
    isLoginPending: computed(() => loginMutation.isPending.value),
    logout: logoutMutation.mutate,
  }
}
