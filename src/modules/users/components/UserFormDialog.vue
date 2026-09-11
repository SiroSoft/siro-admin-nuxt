<script setup lang="ts">
import Dialog from "~/components/ui/Dialog.vue"
import UserForm from "~/modules/users/components/UserForm.vue"
import { useI18n } from "~/composables/useI18n"
import type { CreateUserRequest, UpdateUserRequest, User } from "~/types/user"

interface Props {
  open?: boolean
  user?: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "update:open": [value: boolean]
  submit: [data: CreateUserRequest | UpdateUserRequest]
}>()

const { t } = useI18n()
const dirty = ref(false)

const title = computed(() => props.user ? "Edit User" : "Create User")
const description = computed(() => props.user ? "Update the user details below." : "Fill in the details to create a new user.")

function requestClose(next: boolean) {
  if (!next) {
    if (dirty.value && !window.confirm(t("common.unsavedChanges"))) {
      return
    }
    dirty.value = false
  }
  emit("update:open", next)
}
</script>

<template>
  <Dialog
    :open="props.open"
    :title="title"
    :description="description"
    @update:open="requestClose"
  >
    <UserForm
      :user="props.user"
      @submit="dirty = false; emit('submit', $event)"
      @cancel="requestClose(false)"
      @dirty-change="dirty = $event"
    />
  </Dialog>
</template>
