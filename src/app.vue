<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right, #2563eb 0%, #60a5fa 100%)" :height="3" />
  <NuxtLayout>
    <Transition name="page" mode="out-in">
      <NuxtPage />
    </Transition>
  </NuxtLayout>
  <Toaster />
</template>

<script setup lang="ts">
useHead({
  titleTemplate: "%s | Siro Admin",
});
</script>
