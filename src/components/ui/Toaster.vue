<script setup lang="ts">
import { useToast } from "~/composables/useToast"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-vue-next"
import { cn } from "~/utils"
import type { ToastItem } from "~/composables/useToast"

const { toasts, dismiss } = useToast()

const toastVariants: Record<string, string> = {
  default: "border bg-background text-foreground",
  destructive: "border-destructive bg-destructive text-destructive-foreground shadow-lg",
  success: "border-green-500 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 shadow-lg",
  warning: "border-amber-500 bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-100 shadow-lg",
  info: "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100 shadow-lg",
}

const toastIcons: Record<string, any> = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-md">
    <div
      v-for="t in toasts"
      :key="t.id"
      :class="cn(
        'flex items-start gap-3 rounded-lg border p-4 shadow-md animate-in slide-in-from-right-full',
        toastVariants[t.variant] ?? toastVariants.default,
      )"
    >
      <component :is="toastIcons[t.variant] ?? Info" class="h-5 w-5 shrink-0 mt-0.5" />
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
