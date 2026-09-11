<script setup lang="ts">
import { ref } from "vue"

defineProps<{ compact?: boolean }>()

const { t } = useI18n()

const UTM = "?utm_source=admin-demo&utm_medium=footer"
const TEMPLATE_URL = `https://github.com/SiroSoft/siro-admin-nuxt${UTM}`
const SKELETON_URL = `https://github.com/SiroSoft/SiroPHP${UTM}`
const SITE_URL = `https://sirophp.com${UTM}`
const COMPOSER_CMD = "composer create-project sirosoft/api my-app"

const copied = ref(false)

async function copyCmd() {
  try {
    await navigator.clipboard.writeText(COMPOSER_CMD)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    /* clipboard unavailable */
  }
}
</script>

<template>
  <div v-if="compact" class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
    <a :href="TEMPLATE_URL" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 hover:text-foreground">
      ⭐ {{ t('opensource.starTemplate') }}
    </a>
    <a :href="SKELETON_URL" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 hover:text-foreground">
      🚀 {{ t('opensource.getSkeleton') }}
    </a>
    <a :href="SITE_URL" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 hover:text-foreground">
      🌐 {{ t('opensource.visitSite') }}
    </a>
  </div>
  <div v-else class="rounded-xl border bg-card p-4 text-card-foreground">
    <p class="text-sm font-semibold">{{ t('opensource.deployTitle') }}</p>
    <p class="mt-1 text-xs text-muted-foreground">{{ t('opensource.deployDesc') }}</p>
    <div class="mt-3 flex flex-col gap-2 sm:flex-row">
      <a :href="TEMPLATE_URL" target="_blank" rel="noopener noreferrer" class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-accent">
        ⭐ {{ t('opensource.starTemplate') }}
      </a>
      <a :href="SKELETON_URL" target="_blank" rel="noopener noreferrer" class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
        🚀 {{ t('opensource.getSkeleton') }}
      </a>
    </div>
    <a :href="SITE_URL" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-accent">
      🌐 {{ t('opensource.visitSite') }}
    </a>
    <button type="button" class="mt-2 flex w-full items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 font-mono text-xs text-muted-foreground hover:text-foreground" aria-label="Copy composer command" @click="copyCmd">
      <span class="truncate">{{ COMPOSER_CMD }}</span>
      <span v-if="copied">✓</span>
      <span v-else>⧉</span>
    </button>
  </div>
</template>
