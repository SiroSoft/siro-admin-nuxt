<script setup lang="ts">
import Dialog from "~/components/ui/Dialog.vue"
import PostForm from "~/modules/posts/components/PostForm.vue"
import type { Post } from "~/types/post"

interface Props {
  open?: boolean
  post?: Post
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "update:open": [value: boolean]
  submit: [data: any]
}>()

const title = computed(() => props.post ? "Edit Post" : "Create Post")
const description = computed(() => props.post ? "Update the post details below." : "Fill in the details to create a new post.")
</script>

<template>
  <Dialog
    :open="props.open"
    :title="title"
    :description="description"
    @update:open="emit('update:open', $event)"
  >
    <PostForm :post="props.post" @submit="emit('submit', $event)" />
  </Dialog>
</template>
