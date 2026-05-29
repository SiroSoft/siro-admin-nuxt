<script setup lang="ts">
import Table from "~/components/ui/Table.vue"
import TableHeader from "~/components/ui/TableHeader.vue"
import TableBody from "~/components/ui/TableBody.vue"
import TableRow from "~/components/ui/TableRow.vue"
import TableHead from "~/components/ui/TableHead.vue"
import TableCell from "~/components/ui/TableCell.vue"

interface Column<T = any> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => any
}

interface Props<T = any> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const emit = defineEmits<{
  sort: [key: string]
}>()

function getSortIcon(key: string) {
  if (props.sortBy !== key) return "opacity-30"
  return props.sortOrder === "asc" ? "" : "rotate-180"
}
</script>

<template>
  <div class="rounded-md border overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-for="col in columns" :key="col.key">
            <button
              v-if="col.sortable"
              @click="emit('sort', col.key)"
              class="inline-flex items-center gap-1 hover:text-foreground"
            >
              {{ col.label }}
              <svg
                v-if="col.sortable"
                :class="['h-4 w-4 transition-transform', getSortIcon(col.key)]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="m6 9 6-6 6 6" />
                <path d="m6 15 6 6 6-6" />
              </svg>
            </button>
            <span v-else>{{ col.label }}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="isLoading">
          <TableRow v-for="i in 5" :key="i">
            <TableCell v-for="col in columns" :key="col.key">
              <div class="h-4 animate-pulse rounded bg-muted" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else-if="data.length === 0">
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center text-muted-foreground">
              No results.
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow v-for="(item, idx) in data" :key="idx">
            <TableCell v-for="col in columns" :key="col.key">
              <slot :name="`cell-${col.key}`" :item="item" :value="item[col.key]">
                {{ col.render ? col.render(item) : item[col.key] }}
              </slot>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
