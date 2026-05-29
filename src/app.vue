<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster />
</template>

<script setup lang="ts">
useHead({
  titleTemplate: "%s | Siro Admin",
});
</script>
