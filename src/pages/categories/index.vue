<script setup lang="ts">
definePageMeta({ middleware: "auth" })

import { Plus } from "lucide-vue-next"
import { useCreateCategory, useUpdateCategory } from "~/composables/useCategories"
import Button from "~/components/ui/Button.vue"
import PageHeader from "~/components/layout/PageHeader.vue"
import SearchInput from "~/components/forms/SearchInput.vue"
import CategoryTable from "~/modules/categories/components/CategoryTable.vue"
import CategoryFormDialog from "~/modules/categories/components/CategoryFormDialog.vue"
import type { Category } from "~/types/category"

const search = ref("")
const page = ref(1)
const editCategory = ref<Category | null>(null)
const showCreate = ref(false)
const sortBy = ref("")
const sortOrder = ref<"asc" | "desc">("asc")

const debouncedSearch = useDebounce(search)

const createMutation = useCreateCategory()

const params = computed(() => ({
  page: page.value,
  search: debouncedSearch.value || undefined,
  per_page: 20,
  sort: sortBy.value || undefined,
  order: sortOrder.value || undefined,
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
    <PageHeader title="Categories" description="Manage categories">
      <Button @click="showCreate = true">
        <Plus class="mr-2 h-4 w-4" />
        Create Category
      </Button>
    </PageHeader>

    <div class="flex items-center gap-2">
      <SearchInput v-model="search" placeholder="Search categories..." />
    </div>

    <CategoryTable
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :params="params"
      @edit="editCategory = $event"
      @create="showCreate = true"
      @sort="handleSort"
      @page-change="handlePageChange"
    />

    <CategoryFormDialog
      :open="showCreate"
      @update:open="showCreate = $event"
      @submit="createMutation.mutate($event, { onSuccess: () => showCreate = false })"
    />
  </div>
</template>
