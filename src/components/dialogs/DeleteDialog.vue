<script setup lang="ts">
import {
  AlertDialogRoot as AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "radix-vue"
import { cn } from "~/utils"

interface Props {
  open?: boolean
  title?: string
  description?: string
  isPending?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: "Are you sure?",
  description: "This action cannot be undone.",
  isPending: false,
})

const emit = defineEmits<{
  "update:open": [value: boolean]
  confirm: []
}>()
</script>

<template>
  <AlertDialog :open="props.open" @update:open="emit('update:open', $event)">
    <AlertDialogPortal>
      <AlertDialogOverlay class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in" />
      <AlertDialogContent
        :class="cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] sm:max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg',
        )"
      >
        <div class="flex flex-col space-y-2 text-center sm:text-left">
          <AlertDialogTitle class="text-lg font-semibold">{{ props.title }}</AlertDialogTitle>
          <AlertDialogDescription class="text-sm text-muted-foreground">
            {{ props.description }}
          </AlertDialogDescription>
        </div>
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <AlertDialogCancel
            :disabled="props.isPending"
            class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground mt-2 sm:mt-0"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            :disabled="props.isPending"
            @click="emit('confirm')"
            class="inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow hover:bg-destructive/90"
          >
            {{ props.isPending ? 'Deleting...' : 'Delete' }}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialog>
</template>
