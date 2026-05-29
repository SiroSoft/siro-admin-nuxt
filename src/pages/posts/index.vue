<script setup lang="ts">
definePageMeta({ middleware: "auth" })

import { Plus } from "lucide-vue-next"
import { useCreatePost, useUpdatePost } from "~/composables/usePosts"
import Button from "~/components/ui/Button.vue"
import PageHeader from "~/components/layout/PageHeader.vue"
import SearchInput from "~/components/forms/SearchInput.vue"
import PostTable from "~/modules/posts/components/PostTable.vue"
import PostFormDialog from "~/modules/posts/components/PostFormDialog.vue"
import type { Post } from "~/types/post"

const search = ref("")
const page = ref(1)
const editPost = ref<Post | null>(null)
const showCreate = ref(false)
const sortBy = ref("")
const sortOrder = ref<"asc" | "desc">("asc")
const statusFilter = ref("")

const debouncedSearch = useDebounce(search)

const createMutation = useCreatePost()

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
    <PageHeader title="Posts" description="Manage posts">
      <Button @click="showCreate = true">
        <Plus class="mr-2 h-4 w-4" />
        Create Post
      </Button>
    </PageHeader>

    <div class="flex flex-wrap items-center gap-2">
      <SearchInput v-model="search" placeholder="Search posts..." />
      <select
        v-model="statusFilter"
        class="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="">All Statuses</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
    </div>

    <PostTable
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :params="params"
      @edit="editPost = $event"
      @create="showCreate = true"
      @sort="handleSort"
      @page-change="handlePageChange"
    />

    <PostFormDialog
      :open="showCreate"
      @update:open="showCreate = $event"
      @submit="createMutation.mutate($event, { onSuccess: () => showCreate = false })"
    />
  </div>
</template>
