<script setup lang="ts">
import { SelectRoot, SelectTrigger, SelectValue, SelectContent, SelectItem } from "radix-vue"
import { ChevronDown } from "lucide-vue-next"
import { cn } from "~/utils"

interface Props {
  modelValue?: string
  placeholder?: string
  options: { label: string; value: string }[]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select...",
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()
</script>

<template>
  <SelectRoot :model-value="props.modelValue" @update:model-value="emit('update:modelValue', $event)">
    <SelectTrigger
      :class="cn(
        'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      )"
    >
      <SelectValue :placeholder="props.placeholder" />
      <ChevronDown class="h-4 w-4 opacity-50" />
    </SelectTrigger>
    <SelectContent
      :class="cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'p-1',
      )"
    >
      <SelectItem
        v-for="opt in props.options"
        :key="opt.value"
        :value="opt.value"
        class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      >
        {{ opt.label }}
      </SelectItem>
    </SelectContent>
  </SelectRoot>
</template>
