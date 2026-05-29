<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query"
import { Edit, Trash2, Plus } from "lucide-vue-next"
import DataTable from "~/components/data-table/DataTable.vue"
import Pagination from "~/components/data-table/Pagination.vue"
import Button from "~/components/ui/Button.vue"
import StatusBadge from "~/components/layout/StatusBadge.vue"
import EmptyState from "~/components/states/EmptyState.vue"
import ErrorState from "~/components/states/ErrorState.vue"
import DeleteDialog from "~/components/dialogs/DeleteDialog.vue"
import { useUsers, useDeleteUser } from "~/composables/useUsers"
import type { User } from "~/types/user"
import type { PaginationMeta } from "~/types/api"
import { formatDate } from "~/utils"

interface Props {
  sortBy?: string
  sortOrder?: "asc" | "desc"
  params?: Record<string, any>
  selectedIds?: Set<number>
}

const props = withDefaults(defineProps<Props>(), {
  selectedIds: () => new Set<number>(),
})

const emit = defineEmits<{
  edit: [user: User]
  create: []
  sort: [key: string]
  pageChange: [page: number]
  "update:selectedIds": [ids: Set<number>]
}>()

const deleteId = ref<number | null>(null)
const paramsRef = computed(() => props.params)
const { users, meta, isLoading, isError, error, refetch } = useUsers(paramsRef as any)
const deleteMutation = useDeleteUser()

const allSelected = computed(() =>
  users.value.length > 0 && users.value.every((u: User) => props.selectedIds.has(u.id!))
)

function toggleSelect(userId: number) {
  const next = new Set(props.selectedIds)
  if (next.has(userId)) {
    next.delete(userId)
  } else {
    next.add(userId)
  }
  emit("update:selectedIds", next)
}

function toggleSelectAll() {
  if (allSelected.value) {
    emit("update:selectedIds", new Set())
  } else {
    emit("update:selectedIds", new Set(users.value.map((u: User) => u.id!)))
  }
}

const columns = [
  { key: "select", label: "" },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created", sortable: true },
  { key: "actions", label: "" },
]
</script>

<template>
  <div v-if="isError">
    <ErrorState @retry="refetch()" />
  </div>
  <div v-else-if="!isLoading && users.length === 0">
    <EmptyState title="No users found" description="Get started by creating your first user.">
      <template #action>
        <Button @click="emit('create')">
          <Plus class="mr-2 h-4 w-4" />
          Create User
        </Button>
      </template>
    </EmptyState>
  </div>
  <div v-else>
    <DataTable
      :columns="columns"
      :data="users"
      :is-loading="isLoading"
      :sort-by="props.sortBy"
      :sort-order="props.sortOrder"
      @sort="emit('sort', $event)"
    >
      <template #header-select>
        <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" class="h-4 w-4 rounded border-primary text-primary focus:ring-ring" />
      </template>
      <template #cell-select="{ item }: { item: User }">
        <input type="checkbox" :checked="props.selectedIds.has(item.id!)" @change="toggleSelect(item.id!)" class="h-4 w-4 rounded border-primary text-primary focus:ring-ring" />
      </template>
      <template #cell-role="{ item }: { item: User }">
        <StatusBadge :status="item.role" />
      </template>
      <template #cell-status="{ item }: { item: User }">
        <StatusBadge :status="item.status" />
      </template>
      <template #cell-created_at="{ value }: { value: string }">
        <span class="text-muted-foreground">{{ formatDate(value) }}</span>
      </template>
      <template #cell-actions="{ item }: { item: User }">
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
