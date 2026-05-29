<script setup lang="ts">
import { AlertDialogRoot, AlertDialogTrigger, AlertDialogPortal, AlertDialogOverlay, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "radix-vue"
import { cn } from "~/utils"

interface Props {
  open?: boolean
  title?: string
  description?: string
  cancelText?: string
  confirmText?: string
  confirmVariant?: string
}

const props = withDefaults(defineProps<Props>(), {
  cancelText: "Cancel",
  confirmText: "Confirm",
  confirmVariant: "",
})

const emit = defineEmits<{
  "update:open": [value: boolean]
  confirm: []
}>()
</script>

<template>
  <AlertDialogRoot :open="props.open" @update:open="emit('update:open', $event)">
    <AlertDialogPortal>
      <AlertDialogOverlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <AlertDialogContent
        :class="cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] sm:max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        )"
      >
        <div class="flex flex-col space-y-2 text-center sm:text-left">
          <AlertDialogTitle v-if="props.title" class="text-lg font-semibold">
            {{ props.title }}
          </AlertDialogTitle>
          <AlertDialogDescription v-if="props.description" class="text-sm text-muted-foreground">
            {{ props.description }}
          </AlertDialogDescription>
        </div>
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <AlertDialogCancel class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground mt-2 sm:mt-0">
            {{ props.cancelText }}
          </AlertDialogCancel>
          <AlertDialogAction
            @click="emit('confirm')"
            class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            :class="props.confirmVariant"
          >
            {{ props.confirmText }}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
