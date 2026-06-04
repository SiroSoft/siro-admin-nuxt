<script setup lang="ts">
import { Languages } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"

const { locale, setLocale, t } = useI18n()

const locales = [
  { value: "en", label: "EN" },
  { value: "vi", label: "VI" },
  { value: "de", label: "DE" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
]
</script>

<template>
  <div class="flex items-center gap-1">
    <Languages class="h-4 w-4 text-muted-foreground" />
    <Button
      v-for="loc in locales"
      :key="loc.value"
      :variant="locale === loc.value ? 'default' : 'ghost'"
      size="sm"
      class="h-7 min-w-7 px-2 text-xs"
      @click="setLocale(loc.value as 'en' | 'vi' | 'de' | 'zh' | 'ja')"
    >
      {{ loc.label }}
    </Button>
  </div>
</template>
