<script setup lang="ts">
import { cn } from "~/utils"

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div :class="cn('animate-shimmer rounded-md', props.class)" />
</template>
