<script setup lang="ts">
definePageMeta({ middleware: "auth" })

import { Plus } from "lucide-vue-next"
import { useCreateTag, useUpdateTag } from "~/composables/useTags"
import Button from "~/components/ui/Button.vue"
import PageHeader from "~/components/layout/PageHeader.vue"
import SearchInput from "~/components/forms/SearchInput.vue"
import TagTable from "~/modules/tags/components/TagTable.vue"
import TagFormDialog from "~/modules/tags/components/TagFormDialog.vue"
import type { Tag } from "~/types/tag"

const search = ref("")
const page = ref(1)
const editTag = ref<Tag | null>(null)
const showCreate = ref(false)
const sortBy = ref("")
const sortOrder = ref<"asc" | "desc">("asc")

const debouncedSearch = useDebounce(search)

const createMutation = useCreateTag()

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
    <PageHeader title="Tags" description="Manage tags">
      <Button @click="showCreate = true">
        <Plus class="mr-2 h-4 w-4" />
        Create Tag
      </Button>
    </PageHeader>

    <div class="flex items-center gap-2">
      <SearchInput v-model="search" placeholder="Search tags..." />
    </div>

    <TagTable
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :params="params"
      @edit="editTag = $event"
      @create="showCreate = true"
      @sort="handleSort"
      @page-change="handlePageChange"
    />

    <TagFormDialog
      :open="showCreate"
      @update:open="showCreate = $event"
      @submit="createMutation.mutate($event, { onSuccess: () => showCreate = false })"
    />
  </div>
</template>
