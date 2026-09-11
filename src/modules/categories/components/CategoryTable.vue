<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next"
import DataTable from "~/components/data-table/DataTable.vue"
import Pagination from "~/components/data-table/Pagination.vue"
import Button from "~/components/ui/Button.vue"
import StatusBadge from "~/components/layout/StatusBadge.vue"
import EmptyState from "~/components/states/EmptyState.vue"
import ErrorState from "~/components/states/ErrorState.vue"
import DeleteDialog from "~/components/dialogs/DeleteDialog.vue"
import { useCategories, useDeleteCategory } from "~/composables/useCategories"
import type { Ref } from "vue"
import type { Category } from "~/types/category"
import { formatDate } from "~/utils"

interface Props {
  sortBy?: string
  sortOrder?: "asc" | "desc"
  params?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  edit: [category: Category]
  create: []
  sort: [key: string]
  pageChange: [page: number]
}>()

const { t } = useI18n()
const deleteId = ref<number | null>(null)
const paramsRef = computed(() => props.params)
const { categories, meta, isLoading, isError, refetch } = useCategories(paramsRef as Ref<Record<string, string | number | undefined>>)
const deleteMutation = useDeleteCategory()

const columns = [
  { key: "id", label: t('common.id'), sortable: true },
  { key: "name", label: t('categories.name'), sortable: true },
  { key: "slug", label: t('categories.slug') },
  { key: "is_active", label: t('common.status') },
  { key: "created_at", label: t('users.createdAt'), sortable: true },
  { key: "actions", label: "" },
]
</script>

<template>
  <div v-if="isError">
    <ErrorState @retry="refetch()" />
  </div>
  <div v-else-if="!isLoading && categories.length === 0">
    <EmptyState :title="t('common.noData')" :description="t('categories.title')">
      <template #action>
        <Button @click="emit('create')">{{ t('categories.create') }}</Button>
      </template>
    </EmptyState>
  </div>
  <div v-else>
    <DataTable
      :columns="columns"
      :data="categories"
      :is-loading="isLoading"
      :sort-by="props.sortBy"
      :sort-order="props.sortOrder"
      @sort="emit('sort', $event)"
    >
      <template #cell-is_active="{ item }: { item: Category }">
        <StatusBadge :status="item.is_active ? 'active' : 'inactive'" />
      </template>
      <template #cell-created_at="{ value }: { value: string }">
        <span class="text-muted-foreground text-sm">{{ formatDate(value) }}</span>
      </template>
      <template #cell-actions="{ item }: { item: Category }">
        <div class="flex justify-end gap-1">
          <Button variant="ghost" size="icon" @click="emit('edit', item)" :aria-label="t('a11y.edit', { name: item.name ?? t('a11y.item') })">
            <Edit class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" @click="deleteId = item.id ?? null" :aria-label="t('a11y.delete', { name: item.name ?? t('a11y.item') })">
            <Trash2 class="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </template>
    </DataTable>

    <Pagination
      v-if="meta"
      :current-page="meta.page"
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
