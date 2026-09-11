<script setup lang="ts">
import { useI18n } from "~/composables/useI18n"
import { useAuthStore } from "~/stores/auth.store"
import { useUiStore } from "~/stores/ui.store"
import Sidebar from "~/components/layout/Sidebar.vue"
import Header from "~/components/layout/Header.vue"
import MobileSidebar from "~/components/layout/MobileSidebar.vue"
import LoadingSkeleton from "~/components/states/LoadingSkeleton.vue"
import { cn } from "~/utils"

const authStore = useAuthStore()
const uiStore = useUiStore()
const { t } = useI18n()
const route = useRoute()

const TITLE_KEYS: Record<string, string> = {
  "/": "common.dashboard",
  "/users": "common.users",
  "/orders": "common.orders",
  "/products": "common.products",
  "/categories": "common.categories",
  "/tags": "common.tags",
  "/posts": "common.posts",
  "/profile": "common.profile",
  "/settings": "common.settings",
  "/login": "auth.signIn",
  "/register": "auth.signUp",
  "/forgot-password": "auth.forgotPassword",
  "/reset-password": "auth.resetTitle",
  "/verify-email": "auth.verifyTitle",
}

const pageTitle = computed(() => {
  const seg = "/" + (route.path.split("/")[1] ?? "");
  return t(TITLE_KEYS[seg] ?? TITLE_KEYS[route.path] ?? "common.dashboard");
});

useHead({ title: pageTitle })

onMounted(() => {
  authStore.restoreSession()
})
</script>

<template>
  <div v-if="authStore.isAuthenticated" class="min-h-screen bg-background">
    <Sidebar />
    <MobileSidebar />

    <div
      :class="cn(
        'transition-all duration-300',
        uiStore.sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60',
      )"
    >
      <Header />
      <main class="p-4 lg:p-6 animate-fade-in">
        <slot />
      </main> <footer class="px-4 pb-6 lg:px-6"><OpenSourceLinks compact /></footer>
    </div>
  </div>
  <div v-else-if="!authStore.isLoading" class="min-h-screen">
    <slot />
  </div>
  <div v-else class="flex min-h-screen items-center justify-center p-8">
    <LoadingSkeleton :rows="4" />
  </div>
</template>
