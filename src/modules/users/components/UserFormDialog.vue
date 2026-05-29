<script setup lang="ts">
import Dialog from "~/components/ui/Dialog.vue"
import UserForm from "~/modules/users/components/UserForm.vue"
import type { User } from "~/types/user"

interface Props {
  open?: boolean
  user?: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "update:open": [value: boolean]
  submit: [data: any]
}>()

const title = computed(() => props.user ? "Edit User" : "Create User")
const description = computed(() => props.user ? "Update the user details below." : "Fill in the details to create a new user.")
</script>

<template>
  <Dialog
    :open="props.open"
    :title="title"
    :description="description"
    @update:open="emit('update:open', $event)"
  >
    <UserForm :user="props.user" @submit="emit('submit', $event)" />
  </Dialog>
</template>
