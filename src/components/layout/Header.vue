<script setup lang="ts">
import { useUiStore } from "~/stores/ui.store"
import { Menu, Moon, Sun } from "lucide-vue-next"
import { cn } from "~/utils"
import Button from "~/components/ui/Button.vue"

const colorMode = useColorMode()
const uiStore = useUiStore()

function toggleTheme() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark"
}
</script>

<template>
  <header class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
    <Button variant="ghost" size="icon" class="lg:hidden" @click="uiStore.setMobileSidebar(true)">
      <Menu class="h-5 w-5" />
    </Button>

    <div class="flex-1" />

    <Button variant="ghost" size="icon" @click="toggleTheme">
      <Sun :class="cn('h-5 w-5', colorMode.value === 'dark' && 'hidden')" />
      <Moon :class="cn('h-5 w-5', colorMode.value !== 'dark' && 'hidden')" />
    </Button>

    <LayoutUserNav />
  </header>
</template>
