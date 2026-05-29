<script setup lang="ts">
import { useUiStore } from "~/stores/ui.store"
import { useAuthStore } from "~/stores/auth.store"
import { cn } from "~/utils"
import { useRuntimeConfig } from "nuxt/app"
import {
  LayoutDashboard, Users, ShoppingCart, Package, FileText,
  FolderTree, Tags, Settings, LogOut, ChevronLeft,
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
    <div :class="cn('flex h-14 items-center border-b border-sidebar-border px-4', uiStore.sidebarCollapsed && 'justify-center')">
      <span v-if="!uiStore.sidebarCollapsed" class="text-sm font-bold text-sidebar-foreground truncate">
        {{ config.public.appName }}
      </span>
      <button
        @click="uiStore.toggleSidebar()"
        :class="cn('ml-auto text-sidebar-foreground hover:bg-sidebar-accent rounded-lg p-2', uiStore.sidebarCollapsed && 'ml-0')"
      >
        <ChevronLeft :class="cn('h-4 w-4 transition-transform', uiStore.sidebarCollapsed && 'rotate-180')" />
      </button>
    </div>

    <nav class="flex-1 space-y-1 p-2 overflow-y-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.href"
        :to="item.href"
        :class="cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
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
      <NuxtLink
        to="/profile"
        :class="cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-1',
          $route.path === '/profile'
            ? 'bg-sidebar-accent text-sidebar-foreground'
            : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground',
          uiStore.sidebarCollapsed && 'justify-center px-2',
        )"
      >
        <Users class="h-4 w-4 shrink-0" />
        <span v-if="!uiStore.sidebarCollapsed">Profile</span>
      </NuxtLink>
      <button
        @click="handleLogout"
        :class="cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors',
          uiStore.sidebarCollapsed && 'justify-center px-2',
        )"
      >
        <LogOut class="h-4 w-4 shrink-0" />
        <span v-if="!uiStore.sidebarCollapsed">Logout</span>
      </button>
    </div>
  </aside>
</template>
