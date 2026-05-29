<script setup lang="ts">
import Skeleton from "~/components/ui/Skeleton.vue"
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <div v-for="i in 4" :key="i" class="rounded-xl border p-6">
      <Skeleton class="h-4 w-24 mb-2" />
      <Skeleton class="h-8 w-16" />
    </div>
  </div>
</template>
