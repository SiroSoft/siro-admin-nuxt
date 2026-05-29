<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next"
import DataTable from "~/components/data-table/DataTable.vue"
import Pagination from "~/components/data-table/Pagination.vue"
import Button from "~/components/ui/Button.vue"
import StatusBadge from "~/components/layout/StatusBadge.vue"
import EmptyState from "~/components/states/EmptyState.vue"
import ErrorState from "~/components/states/ErrorState.vue"
import DeleteDialog from "~/components/dialogs/DeleteDialog.vue"
import { usePosts, useDeletePost } from "~/composables/usePosts"
import type { Post } from "~/types/post"
import { formatDate } from "~/utils"

interface Props {
  sortBy?: string
  sortOrder?: "asc" | "desc"
  params?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  edit: [post: Post]
  create: []
  sort: [key: string]
  pageChange: [page: number]
}>()

const deleteId = ref<number | null>(null)
const paramsRef = computed(() => props.params)
const { posts, meta, isLoading, isError, refetch } = usePosts(paramsRef as any)
const deleteMutation = useDeletePost()

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "title", label: "Title", sortable: true },
  { key: "author_name", label: "Author" },
  { key: "status", label: "Status" },
  { key: "category_name", label: "Category" },
  { key: "created_at", label: "Created", sortable: true },
  { key: "actions", label: "" },
]
</script>

<template>
  <div v-if="isError">
    <ErrorState @retry="refetch()" />
  </div>
  <div v-else-if="!isLoading && posts.length === 0">
    <EmptyState title="No posts found" description="Get started by creating your first post.">
      <template #action>
        <Button @click="emit('create')">Create Post</Button>
      </template>
    </EmptyState>
  </div>
  <div v-else>
    <DataTable
      :columns="columns"
      :data="posts"
      :is-loading="isLoading"
      :sort-by="props.sortBy"
      :sort-order="props.sortOrder"
      @sort="emit('sort', $event)"
    >
      <template #cell-status="{ item }: { item: Post }">
        <StatusBadge :status="item.status ?? 'draft'" />
      </template>
      <template #cell-created_at="{ value }: { value: string }">
        <span class="text-muted-foreground text-sm">{{ formatDate(value) }}</span>
      </template>
      <template #cell-actions="{ item }: { item: Post }">
        <div class="flex justify-end gap-1">
          <Button variant="ghost" size="icon" @click="emit('edit', item)">
            <Edit class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" @click="deleteId = item.id">
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
