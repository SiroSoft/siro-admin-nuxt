<script setup lang="ts">
definePageMeta({
  middleware: "auth",
})

import { Plus } from "lucide-vue-next"
import { useCreateUser, useUpdateUser } from "~/composables/useUsers"
import Button from "~/components/ui/Button.vue"
import PageHeader from "~/components/layout/PageHeader.vue"
import SearchInput from "~/components/forms/SearchInput.vue"
import UserTable from "~/modules/users/components/UserTable.vue"
import UserFormDialog from "~/modules/users/components/UserFormDialog.vue"
import type { User } from "~/types/user"

const search = ref("")
const page = ref(1)
const editUser = ref<User | null>(null)
const showCreate = ref(false)
const sortBy = ref("")
const sortOrder = ref<"asc" | "desc">("asc")

const debouncedSearch = useDebounce(search)

const createMutation = useCreateUser()

const params = computed(() => ({
  page: page.value,
  search: debouncedSearch.value || undefined,
  per_page: 10,
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
    <PageHeader title="Users" description="Manage system users">
      <Button @click="showCreate = true">
        <Plus class="mr-2 h-4 w-4" />
        Create User
      </Button>
    </PageHeader>

    <div class="flex items-center gap-2">
      <SearchInput v-model="search" placeholder="Search users..." />
    </div>

    <UserTable
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :params="params"
      @edit="editUser = $event"
      @create="showCreate = true"
      @sort="handleSort"
      @page-change="handlePageChange"
    />

    <UserFormDialog
      :open="showCreate"
      @update:open="showCreate = $event"
      @submit="createMutation.mutate($event, { onSuccess: () => showCreate = false })"
    />
  </div>
</template>
