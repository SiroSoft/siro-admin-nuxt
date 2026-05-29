<script setup lang="ts">
import Card from "~/components/ui/Card.vue"
import Button from "~/components/ui/Button.vue"

interface Props {
  error: any
}

const props = defineProps<Props>()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-muted/50 px-4">
    <Card class="max-w-md w-full">
      <template #header>
        <div class="text-center">
          <h3 class="text-2xl font-bold">{{ props.error?.statusCode || 'Error' }}</h3>
          <p class="text-sm text-muted-foreground mt-1">
            {{ props.error?.message || 'An unexpected error occurred' }}
          </p>
        </div>
      </template>
      <div class="flex justify-center">
        <Button @click="clearError({ redirect: '/' })">
          Go Home
        </Button>
      </div>
    </Card>
  </div>
</template>
