<script setup lang="ts">
interface Props {
  for?: string
}

const props = defineProps<Props>()
</script>

<template>
  <label
    :for="props.for"
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    <slot />
  </label>
</template>
