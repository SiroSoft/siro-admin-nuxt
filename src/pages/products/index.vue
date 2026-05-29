<script setup lang="ts">
definePageMeta({ middleware: "auth" })

import { Plus, Filter } from "lucide-vue-next"
import { useCreateProduct, useUpdateProduct } from "~/composables/useProducts"
import Button from "~/components/ui/Button.vue"
import PageHeader from "~/components/layout/PageHeader.vue"
import SearchInput from "~/components/forms/SearchInput.vue"
import ProductTable from "~/modules/products/components/ProductTable.vue"
import ProductFormDialog from "~/modules/products/components/ProductFormDialog.vue"
import type { Product } from "~/types/product"

const search = ref("")
const page = ref(1)
const editProduct = ref<Product | null>(null)
const showCreate = ref(false)
const sortBy = ref("")
const sortOrder = ref<"asc" | "desc">("asc")
const categoryFilter = ref("")
const minPrice = ref("")
const maxPrice = ref("")
const statusFilter = ref<string | undefined>(undefined)

const debouncedSearch = useDebounce(search)

const createMutation = useCreateProduct()

const params = computed(() => ({
  page: page.value,
  search: debouncedSearch.value || undefined,
  per_page: 10,
  sort: sortBy.value || undefined,
  order: sortOrder.value || undefined,
  ...(categoryFilter.value ? { category_id: categoryFilter.value } : {}),
  ...(minPrice.value ? { min_price: minPrice.value } : {}),
  ...(maxPrice.value ? { max_price: maxPrice.value } : {}),
  ...(statusFilter.value !== undefined ? { is_active: statusFilter.value } : {}),
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
    <PageHeader title="Products" description="Manage products">
      <Button @click="showCreate = true">
        <Plus class="mr-2 h-4 w-4" />
        Create Product
      </Button>
    </PageHeader>

    <div class="flex flex-wrap items-center gap-2">
      <SearchInput v-model="search" placeholder="Search products..." />
      <div class="flex flex-wrap items-center gap-1">
        <button
          v-for="opt in [{ label: 'All', value: undefined }, { label: 'Active', value: true }, { label: 'Inactive', value: false }]"
          :key="String(opt.value)"
          @click="statusFilter = opt.value"
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="statusFilter === opt.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'"
        >
          {{ opt.label }}
        </button>
      </div>
      <input v-model="categoryFilter" placeholder="Category ID" class="flex h-9 w-24 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
      <input v-model="minPrice" type="number" step="0.01" placeholder="Min price" class="flex h-9 w-24 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
      <input v-model="maxPrice" type="number" step="0.01" placeholder="Max price" class="flex h-9 w-24 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
    </div>

    <ProductTable
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :params="params"
      @edit="editProduct = $event"
      @create="showCreate = true"
      @sort="handleSort"
      @page-change="handlePageChange"
    />

    <ProductFormDialog
      :open="showCreate"
      @update:open="showCreate = $event"
      @submit="createMutation.mutate($event, { onSuccess: () => showCreate = false })"
    />
  </div>
</template>
