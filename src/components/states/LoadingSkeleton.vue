<script setup lang="ts">
import Skeleton from "~/components/ui/Skeleton.vue"

interface Props {
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  rows: 5,
})
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-4 p-4">
      <Skeleton class="h-8 flex-1" />
      <Skeleton class="h-8 w-24" />
      <Skeleton class="h-8 w-24" />
    </div>
    <div v-for="i in props.rows" :key="i" class="flex items-center gap-4 p-4">
      <Skeleton class="h-5 flex-1" />
      <Skeleton class="h-5 w-24" />
      <Skeleton class="h-5 w-24" />
      <Skeleton class="h-8 w-20" />
    </div>
  </div>
</template>
