<script setup lang="ts">
import { AlertCircle, RefreshCw } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"

interface Props {
  title?: string
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: "Something went wrong",
  message: "An error occurred while loading data.",
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <AlertCircle class="mb-4 h-12 w-12 text-destructive" />
    <h3 class="text-lg font-semibold">{{ props.title }}</h3>
    <p class="mt-1 text-sm text-muted-foreground max-w-sm">{{ props.message }}</p>
    <Button variant="outline" class="mt-4" @click="emit('retry')">
      <RefreshCw class="mr-2 h-4 w-4" />
      Try again
    </Button>
  </div>
</template>
