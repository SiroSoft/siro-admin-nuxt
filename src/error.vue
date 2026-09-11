<script setup lang="ts">
import { useI18n } from "~/composables/useI18n"
import Card from "~/components/ui/Card.vue"
import Button from "~/components/ui/Button.vue"

import type { NuxtError } from "#app"

interface Props {
  error: NuxtError
}

const props = defineProps<Props>()
const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-muted/50 px-4">
    <Card class="max-w-md w-full">
      <template #header>
        <div class="text-center">
          <h3 class="text-2xl font-bold">{{ props.error?.statusCode || t('errors.unknown') }}</h3>
          <p class="text-sm text-muted-foreground mt-1">
            {{ props.error?.message || t('errors.unknown') }}
          </p>
        </div>
      </template>
      <div class="flex justify-center">
        <Button @click="clearError({ redirect: '/' })">
          {{ t('common.goHome') }}
        </Button>
      </div>
    </Card>
  </div>
</template>
