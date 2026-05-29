<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
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

const { handleSubmit, errors, defineField, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema.value),
  initialValues: {
    name: props.tag?.name ?? "",
    color: props.tag?.color ?? "",
  },
})

const [name, nameAttrs] = defineField("name")
const [color] = defineField("color" as any)

const onSubmit = handleSubmit((values) => {
  emit("submit", values)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="name">Name</Label>
      <Input id="name" v-model="name" v-bind="nameAttrs" placeholder="Tag name" />
      <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
    </div>

    <div class="space-y-2">
      <Label for="color">Color</Label>
      <Input id="color" v-model="color" placeholder="#6366f1" />
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button type="submit" :disabled="isSubmitting">
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        {{ isEdit ? "Update" : "Create" }} Tag
      </Button>
    </div>
  </form>
</template>
