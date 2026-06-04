<script setup lang="ts">
import Dialog from "~/components/ui/Dialog.vue"
import TagForm from "~/modules/tags/components/TagForm.vue"
import type { CreateTagRequest, UpdateTagRequest, Tag } from "~/types/tag"

interface Props {
  open?: boolean
  tag?: Tag
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "update:open": [value: boolean]
  submit: [data: CreateTagRequest | UpdateTagRequest]
}>()

const title = computed(() => props.tag ? "Edit Tag" : "Create Tag")
const description = computed(() => props.tag ? "Update the tag details below." : "Fill in the details to create a new tag.")
</script>

<template>
  <Dialog
    :open="props.open"
    :title="title"
    :description="description"
    @update:open="emit('update:open', $event)"
  >
    <TagForm :tag="props.tag" @submit="emit('submit', $event)" />
  </Dialog>
</template>
