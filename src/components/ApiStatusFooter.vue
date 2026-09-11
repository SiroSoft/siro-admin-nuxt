<script setup lang="ts">
import { useI18n } from "~/composables/useI18n"
import { cn } from "~/utils"

const APP_VERSION = "1.0.1"
const CORE_VERSION = "1.0.6"

const { t } = useI18n()
const config = useRuntimeConfig()
const online = ref<boolean | null>(null)

onMounted(async () => {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 4000)
  try {
    const res = await fetch(`${config.public.apiUrl}/health/ready`, { signal: ctrl.signal })
    online.value = res.ok
  } catch {
    online.value = false
  } finally {
    clearTimeout(timer)
  }
})
</script>

<template>
  <p class="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
    <span
      :title="online === null ? t('auth.apiChecking') : online ? t('auth.apiOnline') : t('auth.apiOffline')"
      :class="cn(
        'inline-block h-2 w-2 rounded-full',
        online === null && 'bg-muted-foreground/50',
        online === true && 'bg-green-500',
        online === false && 'bg-red-500',
      )"
    />
    SiroPHP v{{ APP_VERSION }} · core v{{ CORE_VERSION }} ·
    {{ online === null ? t('auth.apiChecking') : online ? t('auth.apiOnline') : t('auth.apiOffline') }}
  </p>
</template>
