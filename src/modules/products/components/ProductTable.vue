<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next"
import DataTable from "~/components/data-table/DataTable.vue"
import Pagination from "~/components/data-table/Pagination.vue"
import Button from "~/components/ui/Button.vue"
import StatusBadge from "~/components/layout/StatusBadge.vue"
import EmptyState from "~/components/states/EmptyState.vue"
import ErrorState from "~/components/states/ErrorState.vue"
import DeleteDialog from "~/components/dialogs/DeleteDialog.vue"
import { useProducts, useDeleteProduct } from "~/composables/useProducts"
import type { Product } from "~/types/product"
import { formatDate, formatNumber } from "~/utils"

interface Props {
  sortBy?: string
  sortOrder?: "asc" | "desc"
  params?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  edit: [product: Product]
  create: []
  sort: [key: string]
  pageChange: [page: number]
}>()

const deleteId = ref<number | null>(null)
const paramsRef = computed(() => props.params)
const { products, meta, isLoading, isError, refetch } = useProducts(paramsRef as any)
const deleteMutation = useDeleteProduct()

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "price", label: "Price", sortable: true },
  { key: "stock", label: "Stock", sortable: true },
  { key: "sku", label: "SKU" },
  { key: "is_active", label: "Status" },
  { key: "created_at", label: "Created", sortable: true },
  { key: "actions", label: "" },
]
</script>

<template>
  <div v-if="isError">
    <ErrorState @retry="refetch()" />
  </div>
  <div v-else-if="!isLoading && products.length === 0">
    <EmptyState title="No products found" description="Get started by creating your first product.">
      <template #action>
        <Button @click="emit('create')">Create Product</Button>
      </template>
    </EmptyState>
  </div>
  <div v-else>
    <DataTable
      :columns="columns"
      :data="products"
      :is-loading="isLoading"
      :sort-by="props.sortBy"
      :sort-order="props.sortOrder"
      @sort="emit('sort', $event)"
    >
      <template #cell-price="{ value }: { value: number }">
        <span class="font-medium">${{ formatNumber(value ?? 0) }}</span>
      </template>
      <template #cell-stock="{ value }: { value: number }">
        <span :class="value !== undefined && value < 10 ? 'text-destructive font-medium' : ''">{{ value ?? 0 }}</span>
      </template>
      <template #cell-is_active="{ item }: { item: Product }">
        <StatusBadge :status="item.is_active ? 'active' : 'inactive'" />
      </template>
      <template #cell-created_at="{ value }: { value: string }">
        <span class="text-muted-foreground text-sm">{{ formatDate(value) }}</span>
      </template>
      <template #cell-actions="{ item }: { item: Product }">
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
