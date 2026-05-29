<script setup lang="ts">
import Dialog from "~/components/ui/Dialog.vue"
import CategoryForm from "~/modules/categories/components/CategoryForm.vue"
import type { Category } from "~/types/category"

interface Props {
  open?: boolean
  category?: Category
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "update:open": [value: boolean]
  submit: [data: any]
}>()

const title = computed(() => props.category ? "Edit Category" : "Create Category")
const description = computed(() => props.category ? "Update the category details below." : "Fill in the details to create a new category.")
</script>

<template>
  <Dialog
    :open="props.open"
    :title="title"
    :description="description"
    @update:open="emit('update:open', $event)"
  >
    <CategoryForm :category="props.category" @submit="emit('submit', $event)" />
  </Dialog>
</template>
