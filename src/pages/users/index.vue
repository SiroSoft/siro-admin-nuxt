<script setup lang="ts">
definePageMeta({
  middleware: "auth",
})

import { Plus, Download, Trash2 } from "lucide-vue-next"
import type { User } from "~/types/user"
import { useCreateUser, useUpdateUser, useDeleteUser } from "~/composables/useUsers"
import { usersService } from "~/services/users.service"
import Button from "~/components/ui/Button.vue"
import PageHeader from "~/components/layout/PageHeader.vue"
import SearchInput from "~/components/forms/SearchInput.vue"
import UserTable from "~/modules/users/components/UserTable.vue"
import UserFormDialog from "~/modules/users/components/UserFormDialog.vue"
import DeleteDialog from "~/components/dialogs/DeleteDialog.vue"
const { t } = useI18n()
import { useQueryClient } from "@tanstack/vue-query"
import { useToast } from "~/composables/useToast"

const search = ref("")
const page = ref(1)
const editUser = ref<User | null>(null)
const showCreate = ref(false)
const sortBy = ref("")
const sortOrder = ref<"asc" | "desc">("asc")
const selectedIds = ref<Set<number>>(new Set())
const confirmDeleteSelected = ref(false)

const queryClient = useQueryClient()

const createMutation = useCreateUser()
const deleteMutation = useDeleteUser()

const params = computed(() => ({
  page: page.value,
  search: search.value || undefined,
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

async function handleExport() {
  const res = await usersService.list({ per_page: 10000, page: 1 })
  const allUsers = res.data
  const rows = (selectedIds.value.size > 0
    ? allUsers.filter((u) => u.id && selectedIds.value.has(u.id))
    : allUsers
  ).map((u) =>
    [u.name, u.email, u.role, u.status, u.created_at].map((v) => `"${v ?? ""}"`).join(",")
  )
  if (rows.length === 0) return
  const headers = [t('users.name'), t('users.email'), t('users.role'), t('common.status'), t('users.createdAt')]
  const csvContent = [headers.join(","), ...rows].join("\n")
  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `users_export_${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function handleDeleteSelected() {
  confirmDeleteSelected.value = true
}

function handleConfirmDeleteSelected() {
  const ids = Array.from(selectedIds.value)
  // Delete sequentially
  Promise.all(ids.map((id) => deleteMutation.mutateAsync(id)))
    .then(() => {
      selectedIds.value = new Set()
      queryClient.invalidateQueries({ queryKey: ["users"] })
      useToast().success("Users deleted", `${ids.length} user(s) have been deleted.`)
    })
    .catch(() => {
      useToast().error("Error", "Failed to delete some users.")
    })
  confirmDeleteSelected.value = false
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('users.title')" description="Manage system users">
      <Button @click="showCreate = true">
        <Plus class="mr-2 h-4 w-4" />
        {{ t('users.create') }}
      </Button>
    </PageHeader>

    <div class="flex flex-wrap items-center gap-2">
      <SearchInput v-model="search" :placeholder="t('common.search') + '...'" />
      <div v-if="selectedIds.size > 0" class="flex flex-wrap items-center gap-2 ml-auto">
        <span class="text-sm text-muted-foreground">{{ selectedIds.size }} {{ t('common.selected') }}</span>
        <Button variant="outline" size="sm" @click="handleExport">
          <Download class="mr-1 h-4 w-4" />
          {{ t('common.export') }}
        </Button>
        <Button variant="destructive" size="sm" @click="handleDeleteSelected">
          <Trash2 class="mr-1 h-4 w-4" />
          {{ t('common.delete') }}
        </Button>
      </div>
    </div>

    <UserTable
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :params="params"
      v-model:selected-ids="selectedIds"
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

    <DeleteDialog
      :open="confirmDeleteSelected"
      @update:open="confirmDeleteSelected = $event"
      @confirm="handleConfirmDeleteSelected"
      :is-pending="deleteMutation.isPending.value"
      :title="t('users.delete')"
      :description="`${t('users.confirmDelete')} ${t('common.actions')} ${selectedIds.size} ${t('users.title').toLowerCase()}.`"
    />
  </div>
</template>
