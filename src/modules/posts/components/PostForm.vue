<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Textarea from "~/components/ui/Textarea.vue"
import Label from "~/components/ui/Label.vue"
import Select from "~/components/ui/Select.vue"
import Switch from "~/components/ui/Switch.vue"
import ImageUpload from "~/components/ui/ImageUpload.vue"
import { createPostSchema, updatePostSchema } from "~/modules/posts/schemas/post.schema"
import { useCategories } from "~/composables/useCategories"
import { useTags } from "~/composables/useTags"
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
const { categories } = useCategories(ref({ per_page: 100 }))
const { tags } = useTags(ref({ per_page: 200 }))

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
    tag_ids: props.post?.tags?.map((t: any) => t.id).filter(Boolean) ?? [],
  },
})

const [title, titleAttrs] = defineField("title")
const [content] = defineField("content" as any)
const [excerpt] = defineField("excerpt" as any)
const [status] = defineField("status" as any)
const [featured] = defineField("featured" as any)
const [category_id] = defineField("category_id" as any)
const [cover_image] = defineField("cover_image" as any)
const [tag_ids] = defineField("tag_ids" as any)

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
]

const categoryOptions = computed(() =>
  categories.value.map((cat: any) => ({ label: cat.name, value: String(cat.id) }))
)

const selectedTagIds = computed(() => tag_ids ?? [])

function toggleTag(tagId: number) {
  const current = selectedTagIds.value ?? []
  const updated = current.includes(tagId)
    ? current.filter((id: number) => id !== tagId)
    : [...current, tagId]
  setFieldValue("tag_ids", updated)
}

const onSubmit = handleSubmit((values) => {
  emit("submit", values)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
    <div class="space-y-2">
      <Label for="title">Title *</Label>
      <Input id="title" v-model="title" v-bind="titleAttrs" placeholder="Post title" :disabled="isSubmitting" />
      <p v-if="errors.title" class="text-sm text-destructive">{{ errors.title }}</p>
    </div>

    <div class="space-y-2">
      <Label for="excerpt">Excerpt</Label>
      <Textarea id="excerpt" v-model="excerpt" placeholder="Brief description" :disabled="isSubmitting" />
    </div>

    <div class="space-y-2">
      <Label for="content">Content *</Label>
      <textarea
        id="content"
        :value="content"
        @input="setFieldValue('content', ($event.target as HTMLTextAreaElement).value)"
        class="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Post content..."
        :disabled="isSubmitting"
      />
      <p v-if="errors.content" class="text-sm text-destructive">{{ errors.content }}</p>
    </div>

    <div class="space-y-2">
      <Label>Cover Image</Label>
      <ImageUpload :value="cover_image ?? ''" @change="(v: string) => setFieldValue('cover_image', v)" :disabled="isSubmitting" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label>Status</Label>
        <Select
          :model-value="status"
          @update:model-value="(v: string) => setFieldValue('status', v)"
          :options="statusOptions"
          :disabled="isSubmitting"
        />
      </div>
      <div class="space-y-2">
        <Label>Category</Label>
        <Select
          :model-value="category_id ? String(category_id) : ''"
          @update:model-value="(v: string) => setFieldValue('category_id', v ? Number(v) : undefined)"
          :options="categoryOptions"
          placeholder="Select category"
          :disabled="isSubmitting"
        />
      </div>
    </div>

    <div class="space-y-2">
      <Label>Tags</Label>
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="tag in tags"
          :key="tag.id"
          type="button"
          :variant="selectedTagIds.includes(tag.id) ? 'default' : 'outline'"
          size="sm"
          :disabled="isSubmitting"
          @click="toggleTag(tag.id)"
        >
          {{ tag.name }}
        </Button>
        <p v-if="tags.length === 0" class="text-sm text-muted-foreground">No tags available</p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <Switch :model-value="featured" @update:model-value="(v: boolean) => setFieldValue('featured', v)" :disabled="isSubmitting" />
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
