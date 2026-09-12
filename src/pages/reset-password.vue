<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Card from "~/components/ui/Card.vue"
import { useToast } from "~/composables/useToast"
import { authService } from "~/services/auth.service"

definePageMeta({ layout: "auth" })

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const token = (route.query.token as string) || ""

const schema = computed(() =>
  toTypedSchema(
    z
      .object({
        password: z.string().min(8, t("validation.passwordMin", { min: 8 })),
        password_confirmation: z.string(),
      })
      .refine((d) => d.password === d.password_confirmation, {
        message: t("validation.passwordMismatch"),
        path: ["password_confirmation"],
      }),
  ),
)

const { handleSubmit, errors, defineField, isSubmitting } = useForm({
  validationSchema: schema,
})

const [password, passwordAttrs] = defineField("password")
const [password_confirmation] = defineField("password_confirmation")

const serverError = ref<string | null>(null)

const onSubmit = handleSubmit(async (values) => {
  serverError.value = null
  try {
    await authService.resetPassword({ token, ...values })
    useToast().success(t('resetPassword.success'), '')
    router.push("/login")
  } catch (e: any) {
    serverError.value = e?.response?.data?.message || t('resetPassword.invalidToken')
  }
})
</script>

<template>
  <Card>
    <template #header>
      <div class="text-center">
        <h3 class="text-2xl font-bold">{{ t('resetPassword.title') }}</h3>
      </div>
    </template>

    <div v-if="!token" class="text-center py-4">
      <p class="text-sm text-destructive">{{ t('resetPassword.invalidToken') }}</p>
      <div class="mt-4">
        <NuxtLink to="/forgot-password">
          <Button variant="link">{{ t('auth.forgotPassword') }}</Button>
        </NuxtLink>
      </div>
    </div>

    <form v-else @submit="onSubmit" class="space-y-4">
      <input type="hidden" :value="token" />
      <div class="space-y-2">
        <Label for="password">{{ t('auth.password') }} <span class="text-destructive">*</span></Label>
        <Input id="password" type="password" v-model="password" v-bind="passwordAttrs" autocomplete="new-password" />
        <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
      </div>
      <div class="space-y-2">
        <Label for="password_confirmation">{{ t('validation.passwordMismatch') }} <span class="text-destructive">*</span></Label>
        <Input id="password_confirmation" type="password" v-model="password_confirmation" autocomplete="new-password" />
        <p v-if="errors.password_confirmation" class="text-sm text-destructive">{{ errors.password_confirmation }}</p>
      </div>
      <p v-if="serverError" class="text-sm text-destructive">{{ serverError }}</p>
      <Button type="submit" class="w-full" :disabled="isSubmitting">
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        {{ t('resetPassword.submit') }}
      </Button>
    </form>
  </Card>
</template>
