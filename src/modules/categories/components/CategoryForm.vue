<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Textarea from "~/components/ui/Textarea.vue"
import Label from "~/components/ui/Label.vue"
import Switch from "~/components/ui/Switch.vue"
import Select from "~/components/ui/Select.vue"
import ImageUpload from "~/components/ui/ImageUpload.vue"
import { createCategorySchema, updateCategorySchema } from "~/modules/categories/schemas/category.schema"
import { useCategories } from "~/composables/useCategories"
import type { Category } from "~/types/category"

interface Props {
  category?: Category
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: any]
}>()

const isEdit = computed(() => !!props.category)
const schema = computed(() => isEdit.value ? updateCategorySchema : createCategorySchema)
const { categories } = useCategories(ref({ per_page: 100 }))

const { handleSubmit, errors, defineField, setFieldValue, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema.value),
  initialValues: {
    name: props.category?.name ?? "",
    description: props.category?.description ?? "",
    icon: props.category?.icon ?? "",
    color: props.category?.color ?? "",
    parent_id: props.category?.parent_id ?? undefined,
    sort_order: props.category?.sort_order ?? 0,
    is_active: props.category?.is_active ?? true,
  },
})

const [name, nameAttrs] = defineField("name")
const [description] = defineField("description" as any)
const [icon] = defineField("icon" as any)
const [color] = defineField("color" as any)
const [sort_order] = defineField("sort_order" as any)
const [is_active] = defineField("is_active" as any)
const [parent_id] = defineField("parent_id" as any)

const parentCategories = computed(() =>
  categories.value.filter((cat: any) => !isEdit.value || cat.id !== props.category?.id)
)

const parentOptions = computed(() =>
  parentCategories.value.map((cat: any) => ({ label: cat.name, value: String(cat.id) }))
)

const onSubmit = handleSubmit((values) => {
  emit("submit", values)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="name">Name *</Label>
      <Input id="name" v-model="name" v-bind="nameAttrs" placeholder="Category name" :disabled="isSubmitting" />
      <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
    </div>

    <div class="space-y-2">
      <Label for="description">Description</Label>
      <Textarea id="description" v-model="description" placeholder="Category description" :disabled="isSubmitting" />
    </div>

    <div class="space-y-2">
      <Label>Image</Label>
      <ImageUpload :value="icon ?? ''" @change="(v: string) => setFieldValue('icon', v)" :disabled="isSubmitting" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label for="color">Color</Label>
        <div class="flex gap-2">
          <input
            id="color"
            type="color"
            :value="color || '#6366f1'"
            @input="setFieldValue('color', ($event.target as HTMLInputElement).value)"
            class="h-9 w-12 rounded-md border border-input bg-transparent px-1 disabled:opacity-50"
            :disabled="isSubmitting"
          />
          <Input v-model="color" placeholder="#6366f1" class="flex-1" :disabled="isSubmitting" />
        </div>
      </div>
      <div class="space-y-2">
        <Label for="sort_order">Sort Order</Label>
        <Input id="sort_order" type="number" v-model="sort_order" :disabled="isSubmitting" />
      </div>
    </div>

    <div class="space-y-2">
      <Label>Parent Category</Label>
      <Select
        :model-value="parent_id ? String(parent_id) : ''"
        @update:model-value="(v: string) => setFieldValue('parent_id', v ? Number(v) : undefined)"
        :options="parentOptions"
        placeholder="None (top level)"
        :disabled="isSubmitting"
      />
    </div>

    <div class="flex items-center gap-2">
      <Switch :model-value="is_active" @update:model-value="(v: boolean) => setFieldValue('is_active', v)" :disabled="isSubmitting" />
      <Label>Active</Label>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button type="submit" :disabled="isSubmitting">
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        {{ isEdit ? "Update" : "Create" }} Category
      </Button>
    </div>
  </form>
</template>
