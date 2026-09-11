<script setup lang="ts">
import { Edit, Trash2, Eye } from "lucide-vue-next"
import DataTable from "~/components/data-table/DataTable.vue"
import Pagination from "~/components/data-table/Pagination.vue"
import Button from "~/components/ui/Button.vue"
import StatusBadge from "~/components/layout/StatusBadge.vue"
import EmptyState from "~/components/states/EmptyState.vue"
import ErrorState from "~/components/states/ErrorState.vue"
import DeleteDialog from "~/components/dialogs/DeleteDialog.vue"
import { useOrders, useDeleteOrder } from "~/composables/useOrders"
import type { Ref } from "vue"
import type { Order } from "~/types/order"
import { formatDate, formatNumber } from "~/utils"

interface Props {
  sortBy?: string
  sortOrder?: "asc" | "desc"
  params?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  edit: [order: Order]
  create: []
  view: [order: Order]
  sort: [key: string]
  pageChange: [page: number]
}>()

const deleteId = ref<number | null>(null)
const paramsRef = computed(() => props.params)
const { orders, meta, isLoading, isError, refetch } = useOrders(paramsRef as Ref<Record<string, string | number | undefined>>)
const deleteMutation = useDeleteOrder()

const { t } = useI18n()
const columns = [
  { key: "id", label: t('common.id'), sortable: true },
  { key: "user_name", label: t('orders.customer') },
  { key: "total", label: t('orders.total'), sortable: true },
  { key: "status", label: t('common.status') },
  { key: "payment_status", label: t('orders.payment') },
  { key: "created_at", label: t('orders.date'), sortable: true },
  { key: "actions", label: "" },
]
</script>

<template>
  <div v-if="isError">
    <ErrorState @retry="refetch()" />
  </div>
  <div v-else-if="!isLoading && orders.length === 0">
    <EmptyState :title="t('common.noData')" :description="t('orders.title')">
      <template #action>
        <Button @click="emit('create')">{{ t('orders.create') }}</Button>
      </template>
    </EmptyState>
  </div>
  <div v-else>
    <DataTable
      :columns="columns"
      :data="orders"
      :is-loading="isLoading"
      :sort-by="props.sortBy"
      :sort-order="props.sortOrder"
      @sort="emit('sort', $event)"
    >
      <template #cell-total="{ value }: { value: number }">
        <span class="font-medium">${{ formatNumber(value ?? 0) }}</span>
      </template>
      <template #cell-status="{ item }: { item: Order }">
        <StatusBadge :status="item.status ?? 'pending'" />
      </template>
      <template #cell-payment_status="{ item }: { item: Order }">
        <StatusBadge :status="item.payment_status ?? 'pending'" />
      </template>
      <template #cell-created_at="{ value }: { value: string }">
        <span class="text-muted-foreground text-sm">{{ formatDate(value) }}</span>
      </template>
      <template #cell-actions="{ item }: { item: Order }">
        <div class="flex justify-end gap-1">
          <Button variant="ghost" size="icon" @click="emit('view', item)" :aria-label="t('a11y.view', { name: `#${item.id}` })">
            <Eye class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" @click="emit('edit', item)" :aria-label="t('a11y.edit', { name: `#${item.id}` })">
            <Edit class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" @click="deleteId = item.id ?? null" :aria-label="t('a11y.delete', { name: `#${item.id}` })">
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
