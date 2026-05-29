<script setup lang="ts">
import { useAuthStore } from "~/stores/auth.store"
import { useUiStore } from "~/stores/ui.store"
import Sidebar from "~/components/layout/Sidebar.vue"
import Header from "~/components/layout/Header.vue"
import MobileSidebar from "~/components/layout/MobileSidebar.vue"
import LoadingSkeleton from "~/components/states/LoadingSkeleton.vue"
import { cn } from "~/utils"

const authStore = useAuthStore()
const uiStore = useUiStore()

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
      <main class="p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
  <div v-else-if="!authStore.isLoading" class="min-h-screen">
    <slot />
  </div>
  <div v-else class="flex min-h-screen items-center justify-center p-8">
    <LoadingSkeleton rows="4" />
  </div>
</template>
