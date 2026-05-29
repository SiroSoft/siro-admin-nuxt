<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <slot name="icon" />
    <h3 class="text-lg font-semibold mt-4">{{ title }}</h3>
    <p v-if="description" class="mt-1 text-sm text-muted-foreground max-w-sm">{{ description }}</p>
    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>
