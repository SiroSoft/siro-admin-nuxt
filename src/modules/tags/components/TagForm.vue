<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Textarea from "~/components/ui/Textarea.vue"
import Label from "~/components/ui/Label.vue"
import Switch from "~/components/ui/Switch.vue"
import { createTagSchema, updateTagSchema } from "~/modules/tags/schemas/tag.schema"
import type { Tag } from "~/types/tag"

interface Props {
  tag?: Tag
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: any]
}>()

const isEdit = computed(() => !!props.tag)
const schema = computed(() => isEdit.value ? updateTagSchema : createTagSchema)

const { handleSubmit, errors, defineField, setFieldValue, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema.value),
  initialValues: {
    name: props.tag?.name ?? "",
    color: props.tag?.color ?? "",
    description: (props.tag as any)?.description ?? "",
    is_active: (props.tag as any)?.is_active ?? true,
  },
})

const [name, nameAttrs] = defineField("name")
const [color] = defineField("color" as any)
const [description] = defineField("description" as any)
const [is_active] = defineField("is_active" as any)

const onSubmit = handleSubmit((values) => {
  emit("submit", values)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="name">Name *</Label>
      <Input id="name" v-model="name" v-bind="nameAttrs" placeholder="Tag name" :disabled="isSubmitting" />
      <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
    </div>

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
      <Label for="description">Description</Label>
      <Textarea id="description" v-model="description" placeholder="Tag description" :disabled="isSubmitting" />
    </div>

    <div class="flex items-center gap-2">
      <Switch :model-value="is_active" @update:model-value="(v: boolean) => setFieldValue('is_active', v)" :disabled="isSubmitting" />
      <Label>Active</Label>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button type="submit" :disabled="isSubmitting">
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        {{ isEdit ? "Update" : "Create" }} Tag
      </Button>
    </div>
  </form>
</template>
