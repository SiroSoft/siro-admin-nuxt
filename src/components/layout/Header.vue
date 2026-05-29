<script setup lang="ts">
import { useUiStore } from "~/stores/ui.store"
import { Menu, Moon, Sun, ChevronRight } from "lucide-vue-next"
import { cn } from "~/utils"
import Button from "~/components/ui/Button.vue"

const colorMode = useColorMode()
const uiStore = useUiStore()
const route = useRoute()

const breadcrumbs = computed(() => {
  return route.path.split("/").filter(Boolean).map((segment, i, arr) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
    isLast: i === arr.length - 1,
  }))
})

function toggleTheme() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark"
}
</script>

<template>
  <header class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
    <Button variant="ghost" size="icon" class="lg:hidden" @click="uiStore.setMobileSidebar(true)">
      <Menu class="h-5 w-5" />
    </Button>

    <nav aria-label="Breadcrumb" class="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
      <template v-for="(crumb, i) in breadcrumbs" :key="i">
        <ChevronRight v-if="i > 0" class="h-3 w-3" />
        <span :class="crumb.isLast ? 'text-foreground font-medium' : ''">{{ crumb.label }}</span>
      </template>
    </nav>

    <div class="flex-1" />

    <Button variant="ghost" size="icon" @click="toggleTheme">
      <Sun :class="cn('h-5 w-5', colorMode.value === 'dark' && 'hidden')" />
      <Moon :class="cn('h-5 w-5', colorMode.value !== 'dark' && 'hidden')" />
    </Button>

    <LayoutUserNav />
  </header>
</template>
