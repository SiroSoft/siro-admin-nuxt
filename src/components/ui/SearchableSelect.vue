<script setup lang="ts">
import { ref, computed } from "vue"
import { Check, ChevronsUpDown } from "lucide-vue-next"
import { PopoverRoot, PopoverContent, PopoverTrigger } from "radix-vue"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import { cn } from "~/utils"

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  value?: string
  placeholder?: string
  disabled?: boolean
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select...",
  emptyText: "No results",
})

const emit = defineEmits<{
  change: [value: string]
}>()

const open = ref(false)
const search = ref("")

const filtered = computed(() =>
  props.options.filter((o) => o.label.toLowerCase().includes(search.value.toLowerCase()))
)

const selected = computed(() => props.options.find((o) => o.value === props.value))

function selectOption(value: string) {
  emit("change", value)
  open.value = false
  search.value = ""
}
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        class="w-full justify-between font-normal"
        :disabled="props.disabled"
      >
        {{ selected ? selected.label : props.placeholder }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[var(--radix-popover-trigger-width)] p-0 z-50 rounded-md border bg-popover text-popover-foreground shadow-md">
      <div class="p-2">
        <Input v-model="search" placeholder="Search..." class="h-8" />
      </div>
      <div class="max-h-60 overflow-y-auto p-1">
        <p v-if="filtered.length === 0" class="p-2 text-sm text-muted-foreground">{{ props.emptyText }}</p>
        <button
          v-for="option in filtered"
          :key="option.value"
          type="button"
          :class="cn(
            'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent',
            option.value === props.value && 'bg-accent',
          )"
          @click="selectOption(option.value)"
        >
          <Check :class="cn('h-4 w-4 shrink-0', option.value === props.value ? 'opacity-100' : 'opacity-0')" />
          {{ option.label }}
        </button>
      </div>
    </PopoverContent>
  </PopoverRoot>
</template>
