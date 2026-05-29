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
const { orders, meta, isLoading, isError, refetch } = useOrders(paramsRef as any)
const deleteMutation = useDeleteOrder()

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "user_name", label: "Customer" },
  { key: "total", label: "Total", sortable: true },
  { key: "status", label: "Status" },
  { key: "payment_status", label: "Payment" },
  { key: "created_at", label: "Date", sortable: true },
  { key: "actions", label: "" },
]
</script>

<template>
  <div v-if="isError">
    <ErrorState @retry="refetch()" />
  </div>
  <div v-else-if="!isLoading && orders.length === 0">
    <EmptyState title="No orders found" description="Orders will appear here once customers place them.">
      <template #action>
        <Button @click="emit('create')">Create Order</Button>
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
          <Button variant="ghost" size="icon" @click="emit('view', item)">
            <Eye class="h-4 w-4" />
          </Button>
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
