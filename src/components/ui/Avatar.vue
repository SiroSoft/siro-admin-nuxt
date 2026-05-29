<script setup lang="ts">
import { cn } from "~/utils"

interface Props {
  src?: string
  alt?: string
  fallback: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
  <div :class="cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', props.class)">
    <img v-if="props.src" :src="props.src" :alt="props.alt" class="aspect-square h-full w-full" />
    <div v-else class="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium">
      {{ props.fallback }}
    </div>
  </div>
</template>
