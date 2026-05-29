<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Select from "~/components/ui/Select.vue"
import { createUserSchema, updateUserSchema} from "~/modules/users/schemas/user.schema"
import type { User } from "~/types/user"

interface Props {
  user?: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: any]
}>()

const isEdit = computed(() => !!props.user)
const schema = computed(() => isEdit.value ? updateUserSchema : createUserSchema)

const { handleSubmit, errors, defineField, setFieldValue, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema.value),
  initialValues: {
    name: props.user?.name ?? "",
    email: props.user?.email ?? "",
    password: "",
    password_confirmation: "",
    role: props.user?.role ?? "viewer",
    status: props.user?.status ?? "active",
  },
})

const [name, nameAttrs] = defineField("name")
const [email, emailAttrs] = defineField("email")
const [password, passwordAttrs] = defineField("password" as any)
const [passwordConfirmation, passwordConfirmationAttrs] = defineField("password_confirmation" as any)
const [role] = defineField("role" as any)
const [status] = defineField("status" as any)

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Viewer", value: "viewer" },
]

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
]

const onSubmit = handleSubmit((values) => {
  emit("submit", values)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="name">Name</Label>
      <Input id="name" v-model="name" v-bind="nameAttrs" placeholder="John Doe" />
      <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
    </div>

    <div class="space-y-2">
      <Label for="email">Email</Label>
      <Input id="email" type="email" v-model="email" v-bind="emailAttrs" placeholder="john@example.com" />
      <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
    </div>

    <template v-if="!isEdit">
      <div class="space-y-2">
        <Label for="password">Password</Label>
        <Input id="password" type="password" v-model="password" v-bind="passwordAttrs" placeholder="••••••••" />
        <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
      </div>
      <div class="space-y-2">
        <Label for="password_confirmation">Confirm Password</Label>
        <Input id="password_confirmation" type="password" v-model="passwordConfirmation" v-bind="passwordConfirmationAttrs" placeholder="••••••••" />
        <p v-if="errors.password_confirmation" class="text-sm text-destructive">{{ errors.password_confirmation }}</p>
      </div>
    </template>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label>Role</Label>
        <Select
          :model-value="role"
          @update:model-value="(v: string) => setFieldValue('role', v)"
          :options="roleOptions"
        />
        <p v-if="errors.role" class="text-sm text-destructive">{{ errors.role }}</p>
      </div>

      <div class="space-y-2">
        <Label>Status</Label>
        <Select
          :model-value="status"
          @update:model-value="(v: string) => setFieldValue('status', v)"
          :options="statusOptions"
        />
        <p v-if="errors.status" class="text-sm text-destructive">{{ errors.status }}</p>
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button type="submit" :disabled="isSubmitting">
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        {{ isEdit ? "Update" : "Create" }} User
      </Button>
    </div>
  </form>
</template>
