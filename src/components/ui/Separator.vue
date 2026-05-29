<script setup lang="ts">
import { cn } from "~/utils"

interface Props {
  class?: string
  orientation?: "horizontal" | "vertical"
}

const props = withDefaults(defineProps<Props>(), {
  orientation: "horizontal",
})
</script>

<template>
  <div
    :class="cn(
      'shrink-0 bg-border',
      props.orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      props.class,
    )"
  />
</template>
