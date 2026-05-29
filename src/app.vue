<template>
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
