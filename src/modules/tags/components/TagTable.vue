<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next"
import DataTable from "~/components/data-table/DataTable.vue"
import Pagination from "~/components/data-table/Pagination.vue"
import Button from "~/components/ui/Button.vue"
import EmptyState from "~/components/states/EmptyState.vue"
import ErrorState from "~/components/states/ErrorState.vue"
import DeleteDialog from "~/components/dialogs/DeleteDialog.vue"
import { useTags, useDeleteTag } from "~/composables/useTags"
import type { Tag } from "~/types/tag"
import { formatDate } from "~/utils"

interface Props {
  sortBy?: string
  sortOrder?: "asc" | "desc"
  params?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  edit: [tag: Tag]
  create: []
  sort: [key: string]
  pageChange: [page: number]
}>()

const deleteId = ref<number | null>(null)
const paramsRef = computed(() => props.params)
const { tags, meta, isLoading, isError, refetch } = useTags(paramsRef as any)
const deleteMutation = useDeleteTag()

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "slug", label: "Slug" },
  { key: "color", label: "Color" },
  { key: "created_at", label: "Created", sortable: true },
  { key: "actions", label: "" },
]
</script>

<template>
  <div v-if="isError">
    <ErrorState @retry="refetch()" />
  </div>
  <div v-else-if="!isLoading && tags.length === 0">
    <EmptyState title="No tags found" description="Get started by creating your first tag.">
      <template #action>
        <Button @click="emit('create')">Create Tag</Button>
      </template>
    </EmptyState>
  </div>
  <div v-else>
    <DataTable
      :columns="columns"
      :data="tags"
      :is-loading="isLoading"
      :sort-by="props.sortBy"
      :sort-order="props.sortOrder"
      @sort="emit('sort', $event)"
    >
      <template #cell-color="{ value }: { value: string }">
        <div class="flex items-center gap-2">
          <div v-if="value" class="h-4 w-4 rounded-full border" :style="{ backgroundColor: value }" />
          <span v-else class="text-muted-foreground">—</span>
        </div>
      </template>
      <template #cell-created_at="{ value }: { value: string }">
        <span class="text-muted-foreground text-sm">{{ formatDate(value) }}</span>
      </template>
      <template #cell-actions="{ item }: { item: Tag }">
        <div class="flex justify-end gap-1">
          <Button variant="ghost" size="icon" @click="emit('edit', item)" :aria-label="`Edit ${item.name ?? 'tag'}`">
            <Edit class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" @click="deleteId = item.id" :aria-label="`Delete ${item.name ?? 'tag'}`">
            <Trash2 class="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </template>
    </DataTable>

    <Pagination
      v-if="meta"
      :current-page="meta.current_page"
      :last-page="meta.last_page"
      :total="meta.total"
      @page-change="emit('pageChange', $event)"
    />
  </div>

  <DeleteDialog
    :open="deleteId !== null"
    @update:open="deleteId = null"
    @confirm="deleteId !== null && deleteMutation.mutate(deleteId, { onSettled: () => deleteId = null })"
    :is-pending="deleteMutation.isPending.value"
  />
</template>
