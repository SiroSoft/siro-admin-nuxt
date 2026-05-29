<script setup lang="ts">
import { cn } from "~/utils"

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const attrs = useAttrs()
</script>

<template>
  <div class="space-y-1">
    <textarea
      v-bind="attrs"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :class="cn(
        'flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        props.error ? 'border-destructive' : 'border-input',
      )"
    />
    <p v-if="props.error" class="text-sm text-destructive">{{ props.error }}</p>
  </div>
</template>
