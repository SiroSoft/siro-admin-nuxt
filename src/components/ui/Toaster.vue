<script setup lang="ts">
import { useToast } from "~/composables/useToast"
import { X } from "lucide-vue-next"
import { cn } from "~/utils"

const { toasts, dismiss } = useToast()

const toastVariants = {
  default: "border bg-background text-foreground",
  destructive: "border-destructive bg-destructive text-destructive-foreground shadow-lg",
} as const
</script>

<template>
  <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-md">
    <div
      v-for="t in toasts"
      :key="t.id"
      :class="cn(
        'flex items-start gap-3 rounded-lg border p-4 shadow-md animate-in slide-in-from-right-full',
        toastVariants[t.variant],
      )"
    >
      <div class="flex-1">
        <p class="text-sm font-semibold">{{ t.title }}</p>
        <p v-if="t.description" class="text-sm opacity-90">{{ t.description }}</p>
      </div>
      <button @click="dismiss(t.id)" class="shrink-0 opacity-60 hover:opacity-100">
        <X class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
