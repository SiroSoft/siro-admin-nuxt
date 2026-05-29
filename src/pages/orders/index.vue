<script setup lang="ts">
definePageMeta({ middleware: "auth" })

import { Plus, Filter } from "lucide-vue-next"
import StatusBadge from "~/components/layout/StatusBadge.vue"
import { useCreateOrder, useUpdateOrder } from "~/composables/useOrders"
import Button from "~/components/ui/Button.vue"
import PageHeader from "~/components/layout/PageHeader.vue"
import SearchInput from "~/components/forms/SearchInput.vue"
import OrderTable from "~/modules/orders/components/OrderTable.vue"
import OrderFormDialog from "~/modules/orders/components/OrderFormDialog.vue"
import type { Order } from "~/types/order"

const search = ref("")
const page = ref(1)
const editOrder = ref<Order | null>(null)
const showCreate = ref(false)
const sortBy = ref("")
const sortOrder = ref<"asc" | "desc">("asc")
const statusFilter = ref("")

const debouncedSearch = useDebounce(search)

const createMutation = useCreateOrder()

const params = computed(() => ({
  page: page.value,
  search: debouncedSearch.value || undefined,
  per_page: 10,
  sort: sortBy.value || undefined,
  order: sortOrder.value || undefined,
  ...(statusFilter.value ? { status: statusFilter.value } : {}),
}))

function handleSort(key: string) {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"
  } else {
    sortBy.value = key
    sortOrder.value = "asc"
  }
}

function handlePageChange(newPage: number) {
  page.value = newPage
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader title="Orders" description="Manage orders">
      <Button @click="showCreate = true">
        <Plus class="mr-2 h-4 w-4" />
        Create Order
      </Button>
    </PageHeader>

    <div class="flex flex-wrap items-center gap-2">
      <SearchInput v-model="search" placeholder="Search orders..." />
      <div class="flex flex-wrap items-center gap-1 ml-auto">
        <Filter class="h-4 w-4 text-muted-foreground" />
        <button
          v-for="status in ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']"
          :key="status"
          @click="statusFilter = status"
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="statusFilter === status ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'"
        >
          {{ status || 'All' }}
        </button>
      </div>
    </div>

    <OrderTable
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :params="params"
      @edit="editOrder = $event"
      @view="editOrder = $event"
      @create="showCreate = true"
      @sort="handleSort"
      @page-change="handlePageChange"
    />

    <OrderFormDialog
      :open="showCreate"
      @update:open="showCreate = $event"
      @submit="createMutation.mutate($event, { onSuccess: () => showCreate = false })"
    />
  </div>
</template>
