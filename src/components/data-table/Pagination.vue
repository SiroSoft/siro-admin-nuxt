<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"

interface Props {
  currentPage: number
  lastPage: number
  total: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  pageChange: [page: number]
}>()

const pages = computed(() => {
  const result: number[] = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.lastPage, props.currentPage + 2)
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
})
</script>

<template>
  <div v-if="props.lastPage > 1" class="flex items-center justify-between pt-4">
    <p class="text-sm text-muted-foreground">
      Page {{ props.currentPage }} of {{ props.lastPage }} ({{ props.total }} total)
    </p>
    <div class="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8"
        :disabled="props.currentPage <= 1"
        @click="emit('pageChange', props.currentPage - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>
      <Button
        v-for="page in pages"
        :key="page"
        :variant="page === props.currentPage ? 'default' : 'outline'"
        size="icon"
        class="h-8 w-8"
        @click="emit('pageChange', page)"
      >
        {{ page }}
      </Button>
      <Button
        variant="outline"
        size="icon"
        class="h-8 w-8"
        :disabled="props.currentPage >= props.lastPage"
        @click="emit('pageChange', props.currentPage + 1)"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
