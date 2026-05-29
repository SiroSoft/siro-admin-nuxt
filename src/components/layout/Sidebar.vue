<script setup lang="ts">
import { useUiStore } from "~/stores/ui.store"
import { useAuthStore } from "~/stores/auth.store"
import { cn } from "~/utils"
import { useRuntimeConfig } from "nuxt/app"
import {
  LayoutDashboard, Users, ShoppingCart, Package, FileText,
  FolderTree, Tags, Settings, LogOut, ChevronLeft, User,
} from "lucide-vue-next"

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
  { href: "/categories", label: "Categories", icon: FolderTree },
  { href: "/tags", label: "Tags", icon: Tags },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
]

function handleLogout() {
  authStore.logout()
  router.push("/login")
}
</script>

<template>
  <aside
    :class="cn(
      'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar transition-all duration-300',
      uiStore.sidebarCollapsed ? 'w-16' : 'w-60',
    )"
  >
    <div :class="cn('flex h-14 items-center border-b border-sidebar-border px-4 gap-2', uiStore.sidebarCollapsed && 'justify-center')">
      <NuxtLink to="/" class="flex items-center gap-2 truncate">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" class="h-7 w-7 shrink-0"><rect width="32" height="32" rx="8" fill="#2563eb"/><path d="M12 5h10l-4 10h4l-6 14 2-12h-4l2-12z" fill="white"/></svg>
        <span v-if="!uiStore.sidebarCollapsed" class="text-sm font-bold text-sidebar-foreground">
          {{ config.public.appName }}
        </span>
      </NuxtLink>
      <button
        @click="uiStore.toggleSidebar()"
        :class="cn('ml-auto text-sidebar-foreground hover:bg-sidebar-accent rounded-lg p-2', uiStore.sidebarCollapsed && 'ml-0')"
        :aria-label="uiStore.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <ChevronLeft :class="cn('h-4 w-4 transition-transform', uiStore.sidebarCollapsed && 'rotate-180')" />
      </button>
    </div>

    <nav class="flex-1 space-y-1 p-2 overflow-y-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.href"
        :to="item.href"
        :aria-current="$route.path === item.href || $route.path.startsWith(item.href + '/') ? 'page' : undefined"
        :class="cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]',
          $route.path === item.href || $route.path.startsWith(item.href + '/')
            ? 'bg-sidebar-accent text-sidebar-foreground'
            : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground',
          uiStore.sidebarCollapsed && 'justify-center px-2',
        )"
      >
        <component :is="item.icon" class="h-4 w-4 shrink-0" />
        <span v-if="!uiStore.sidebarCollapsed">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <div class="border-t border-sidebar-border p-2">
      <button
        @click="handleLogout"
        :class="cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-150 active:scale-[0.98]',
          uiStore.sidebarCollapsed && 'justify-center px-2',
        )"
      >
        <LogOut class="h-4 w-4 shrink-0" />
        <span v-if="!uiStore.sidebarCollapsed">Logout</span>
      </button>
    </div>
  </aside>
</template>
