<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Select from "~/components/ui/Select.vue"
import Switch from "~/components/ui/Switch.vue"
import { createPostSchema, updatePostSchema } from "~/modules/posts/schemas/post.schema"
import type { Post } from "~/types/post"

interface Props {
  post?: Post
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: any]
}>()

const isEdit = computed(() => !!props.post)
const schema = computed(() => isEdit.value ? updatePostSchema : createPostSchema)

const { handleSubmit, errors, defineField, setFieldValue, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema.value),
  initialValues: {
    title: props.post?.title ?? "",
    content: props.post?.content ?? "",
    excerpt: props.post?.excerpt ?? "",
    cover_image: props.post?.cover_image ?? "",
    status: props.post?.status ?? "draft",
    featured: props.post?.featured ?? false,
    category_id: props.post?.category_id ?? undefined,
    tag_ids: props.post?.tags?.map(t => t.id) ?? [],
  },
})

const [title, titleAttrs] = defineField("title")
const [content] = defineField("content" as any)
const [status] = defineField("status" as any)
const [featured] = defineField("featured" as any)
const [category_id] = defineField("category_id" as any)

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
]

const onSubmit = handleSubmit((values) => {
  emit("submit", values)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="title">Title</Label>
      <Input id="title" v-model="title" v-bind="titleAttrs" placeholder="Post title" />
      <p v-if="errors.title" class="text-sm text-destructive">{{ errors.title }}</p>
    </div>

    <div class="space-y-2">
      <Label for="content">Content</Label>
      <textarea
        id="content"
        v-model="content"
        class="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        placeholder="Write your post content here..."
      />
      <p v-if="errors.content" class="text-sm text-destructive">{{ errors.content }}</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label>Status</Label>
        <Select
          :model-value="status"
          @update:model-value="(v: string) => setFieldValue('status', v)"
          :options="statusOptions"
        />
      </div>
      <div class="space-y-2">
        <Label for="category_id">Category ID</Label>
        <Input id="category_id" type="number" :model-value="category_id" @input="setFieldValue('category_id', Number(($event.target as HTMLInputElement).value) || undefined)" placeholder="Optional" />
      </div>
    </div>

    <div class="flex items-center gap-2">
      <Switch :model-value="featured" @update:model-value="(v: boolean) => setFieldValue('featured', v)" />
      <Label>Featured</Label>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button type="submit" :disabled="isSubmitting">
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        {{ isEdit ? "Update" : "Create" }} Post
      </Button>
    </div>
  </form>
</template>
