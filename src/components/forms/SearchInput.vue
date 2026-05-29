<script setup lang="ts">
import { Search, X } from "lucide-vue-next"
import { useDebounce } from "~/composables/useDebounce"

interface Props {
  modelValue?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Search...",
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const localValue = ref(props.modelValue ?? "")

const debounced = useDebounce(localValue)

watch(debounced, (val) => {
  emit("update:modelValue", val as string)
})

watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val ?? ""
  },
)
</script>

<template>
  <div class="relative">
    <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <input
      v-model="localValue"
      :placeholder="props.placeholder"
      class="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-8 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    />
    <button
      v-if="localValue"
      @click="localValue = ''"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
    >
      <X class="h-4 w-4" />
    </button>
  </div>
</template>
