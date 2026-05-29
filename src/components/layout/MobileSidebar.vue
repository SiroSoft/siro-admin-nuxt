<script setup lang="ts">
import { useUiStore } from "~/stores/ui.store"
import { useAuthStore } from "~/stores/auth.store"
import { cn } from "~/utils"
import { useRuntimeConfig } from "nuxt/app"
import { X, LayoutDashboard, Users, ShoppingCart, Package, FileText, Settings, LogOut } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"

const uiStore = useUiStore()
const authStore = useAuthStore()
const config = useRuntimeConfig()
const router = useRouter()

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/products", label: "Products", icon: Package },
  { href: "/posts", label: "Posts", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
]

function handleLogout() {
  uiStore.setMobileSidebar(false)
  authStore.logout()
  router.push("/login")
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && uiStore.mobileSidebarOpen) {
    uiStore.setMobileSidebar(false)
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown)
})

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown)
})
</script>

<template>
  <div v-if="uiStore.mobileSidebarOpen" class="fixed inset-0 z-50 bg-black/50 lg:hidden" @click="uiStore.setMobileSidebar(false)" role="presentation" aria-label="Close overlay" />
  <aside
    :class="cn(
      'fixed inset-y-0 left-0 z-50 w-60 bg-sidebar p-4 shadow-lg transition-transform lg:hidden',
      uiStore.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
    )"
    aria-label="Mobile navigation"
  >
    <div class="flex items-center justify-between mb-6">
      <span class="text-sm font-bold text-sidebar-foreground">{{ config.public.appName }}</span>
      <Button variant="ghost" size="icon" @click="uiStore.setMobileSidebar(false)" class="text-sidebar-foreground hover:bg-sidebar-accent" aria-label="Close navigation menu">
        <X class="h-4 w-4" />
      </Button>
    </div>

    <nav class="space-y-1">
      <NuxtLink
        v-for="item in navItems"
        :key="item.href"
        :to="item.href"
        :aria-current="$route.path === item.href || $route.path.startsWith(item.href + '/') ? 'page' : undefined"
        @click="uiStore.setMobileSidebar(false)"
        :class="cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 active:scale-[0.98]',
          $route.path === item.href || $route.path.startsWith(item.href + '/')
            ? 'bg-sidebar-accent text-sidebar-foreground'
            : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground',
        )"
      >
        <component :is="item.icon" class="h-4 w-4" />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <div class="mt-4 pt-4 border-t border-sidebar-border">
      <button
        @click="handleLogout"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors active:scale-[0.98]"
      >
        <LogOut class="h-4 w-4" />
        Logout
      </button>
    </div>
  </aside>
</template>
