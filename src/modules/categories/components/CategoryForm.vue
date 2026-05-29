<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Switch from "~/components/ui/Switch.vue"
import { createCategorySchema, updateCategorySchema } from "~/modules/categories/schemas/category.schema"
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
const [is_active] = defineField("is_active" as any)

const onSubmit = handleSubmit((values) => {
  emit("submit", values)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="name">Name</Label>
      <Input id="name" v-model="name" v-bind="nameAttrs" placeholder="Category name" />
      <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
    </div>

    <div class="space-y-2">
      <Label for="description">Description</Label>
      <Input id="description" v-model="description" v-bind="description" placeholder="Optional description" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label for="icon">Icon</Label>
        <Input id="icon" v-model="icon" placeholder="folder" />
      </div>
      <div class="space-y-2">
        <Label for="color">Color</Label>
        <Input id="color" v-model="color" placeholder="#6366f1" />
      </div>
    </div>

    <div class="flex items-center gap-2">
      <Switch :model-value="is_active" @update:model-value="(v: boolean) => setFieldValue('is_active', v)" />
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
