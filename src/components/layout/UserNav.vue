<script setup lang="ts">
import { useAuthStore } from "~/stores/auth.store"
import { useRouter } from "nuxt/app"
import { User, LogOut } from "lucide-vue-next"
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "radix-vue"
import Avatar from "~/components/ui/Avatar.vue"

const authStore = useAuthStore()
const router = useRouter()

const initials = computed(() => {
  if (!authStore.user) return ""
  return authStore.user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
})

function handleLogout() {
  authStore.logout()
  router.push("/login")
}
</script>

<template>
  <DropdownMenuRoot v-if="authStore.user">
    <DropdownMenuTrigger as-child>
      <button class="flex items-center gap-2 rounded-full outline-none">
        <Avatar :fallback="initials" class="h-8 w-8" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="z-50 min-w-[10rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
      <DropdownMenuLabel>
        <div class="flex flex-col px-2 py-1.5">
          <p class="text-sm font-medium">{{ authStore.user.name }}</p>
          <p class="text-xs text-muted-foreground">{{ authStore.user.email }}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator class="-mx-1 my-1 h-px bg-muted" />
      <DropdownMenuItem
        @click="router.push('/profile')"
        class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
      >
        <User class="mr-2 h-4 w-4" />
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem
        @click="handleLogout"
        class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
      >
        <LogOut class="mr-2 h-4 w-4" />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenuRoot>
</template>
