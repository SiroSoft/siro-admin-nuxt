<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Select from "~/components/ui/Select.vue"
import ImageUpload from "~/components/ui/ImageUpload.vue"
import { createUserSchema, updateUserSchema} from "~/modules/users/schemas/user.schema"
import type { CreateUserRequest, UpdateUserRequest, User } from "~/types/user"

interface UserFormType {
  name: string
  email: string
  password?: string
  password_confirmation?: string
  role: string
  status: string
  avatar: string
  phone: string
}

interface Props {
  user?: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: CreateUserRequest | UpdateUserRequest]
  cancel: []
  "dirty-change": [dirty: boolean]
}>()

const { t } = useI18n()

const isEdit = computed(() => !!props.user)
const schema = computed(() => isEdit.value ? updateUserSchema : createUserSchema)

const { handleSubmit, errors, defineField, setFieldValue, isSubmitting, meta } = useForm<UserFormType>({
  validationSchema: toTypedSchema(schema.value),
  initialValues: {
    name: props.user?.name ?? "",
    email: props.user?.email ?? "",
    ...(isEdit.value ? {} : { password: "", password_confirmation: "" }),
    role: props.user?.role ?? "viewer",
    status: String(props.user?.status ?? "") || "active",
    avatar: props.user?.avatar ?? "",
    phone: props.user?.phone ?? "",
  },
})

watch(
  () => meta.value.dirty,
  (dirty) => emit("dirty-change", dirty),
)

const [name, nameAttrs] = defineField("name")
const [email, emailAttrs] = defineField("email")
const [password, passwordAttrs] = defineField("password")
const [passwordConfirmation, passwordConfirmationAttrs] = defineField("password_confirmation")
const [role] = defineField("role")
const [status] = defineField("status")
const [avatar] = defineField("avatar")
const [phone] = defineField("phone")

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
  emit("submit", values as CreateUserRequest | UpdateUserRequest)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
    <div class="space-y-2">
      <Label>Avatar</Label>
      <ImageUpload :value="avatar ?? ''" @change="(v: string) => setFieldValue('avatar', v)" :disabled="isSubmitting" />
    </div>

    <div class="space-y-2">
      <Label for="name">Name <span class="text-destructive">*</span></Label>
      <Input id="name" v-model="name" v-bind="nameAttrs" :placeholder="t('placeholders.fullName')" :disabled="isSubmitting" />
      <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
    </div>

    <div class="space-y-2">
      <Label for="email">Email <span class="text-destructive">*</span></Label>
      <Input id="email" type="email" v-model="email" v-bind="emailAttrs" :placeholder="t('placeholders.userEmail')" :disabled="isSubmitting" />
      <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
    </div>

    <div class="space-y-2">
      <Label for="phone">Phone</Label>
      <Input id="phone" type="tel" v-model="phone" :placeholder="t('placeholders.phone')" :disabled="isSubmitting" />
    </div>

    <template v-if="!isEdit">
      <div class="space-y-2">
        <Label for="password">Password <span class="text-destructive">*</span></Label>
        <Input id="password" type="password" v-model="password" v-bind="passwordAttrs" placeholder="••••••••" :disabled="isSubmitting" />
        <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
      </div>
      <div class="space-y-2">
        <Label for="password_confirmation">Confirm Password <span class="text-destructive">*</span></Label>
        <Input id="password_confirmation" type="password" v-model="passwordConfirmation" v-bind="passwordConfirmationAttrs" placeholder="••••••••" :disabled="isSubmitting" />
        <p v-if="errors.password_confirmation" class="text-sm text-destructive">{{ errors.password_confirmation }}</p>
      </div>
    </template>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label>Role</Label>
        <Select
          :model-value="role"
          @update:model-value="(v: string) => setFieldValue('role', v)"
          :options="roleOptions"
          :disabled="isSubmitting"
        />
        <p v-if="errors.role" class="text-sm text-destructive">{{ errors.role }}</p>
      </div>

      <div class="space-y-2">
        <Label>Status</Label>
        <Select
          :model-value="status"
          @update:model-value="(v: string) => setFieldValue('status', v)"
          :options="statusOptions"
          :disabled="isSubmitting"
        />
        <p v-if="errors.status" class="text-sm text-destructive">{{ errors.status }}</p>
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button type="button" variant="outline" :disabled="isSubmitting" @click="emit('cancel')">
        {{ t('common.cancel') }}
      </Button>
      <Button type="submit" :disabled="isSubmitting">
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        {{ isEdit ? "Update" : "Create" }} User
      </Button>
    </div>
  </form>
</template>
