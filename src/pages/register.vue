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
import VueTurnstile from "vue-turnstile"

definePageMeta({ layout: "auth" })

const { t } = useI18n()
const router = useRouter()

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
})

const { handleSubmit, errors, defineField, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
})

const [name, nameAttrs] = defineField("name")
const [email, emailAttrs] = defineField("email")
const [password, passwordAttrs] = defineField("password")
const [password_confirmation] = defineField("password_confirmation")

const serverError = ref<string | null>(null)
const turnstileToken = ref("")
const turnstileSiteKey = (useRuntimeConfig().public.turnstileSiteKey as string) || ""

const onSubmit = handleSubmit(async (values) => {
  serverError.value = null
  try {
    await authService.register({ ...values, ...(turnstileToken.value ? { "cf-turnstile-response": turnstileToken.value } : {}) })
    useToast().success(t('register.success'), '')
    router.push("/login")
  } catch (e: any) {
    serverError.value = e?.response?.data?.message || t('errors.unknown')
  }
})
</script>

<template>
  <Card>
    <template #header>
      <div class="text-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" class="mx-auto h-12 w-12"><rect width="32" height="32" rx="8" fill="#2563eb"/><path d="M12 5h10l-4 10h4l-6 14 2-12h-4l2-12z" fill="white"/></svg>
        <div>
          <h3 class="text-2xl font-bold">{{ t('register.title') }}</h3>
          <p class="text-sm text-muted-foreground mt-1">{{ t('auth.signUp') }}</p>
        </div>
      </div>
    </template>

    <form @submit="onSubmit" class="space-y-4">
      <div class="space-y-2">
        <Label for="name">{{ t('register.name') }} <span class="text-destructive">*</span></Label>
        <Input id="name" v-model="name" v-bind="nameAttrs" :placeholder="t('register.namePlaceholder')" autocomplete="name" autofocus />
        <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
      </div>
      <div class="space-y-2">
        <Label for="email">{{ t('auth.email') }} <span class="text-destructive">*</span></Label>
        <Input id="email" type="email" v-model="email" v-bind="emailAttrs" placeholder="admin@example.com" autocomplete="email" />
        <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
      </div>
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
      <ClientOnly><VueTurnstile v-if="turnstileSiteKey" :site-key="turnstileSiteKey" v-model="turnstileToken" /></ClientOnly> <p v-if="serverError" class="text-sm text-destructive">{{ serverError }}</p>
      <Button type="submit" class="w-full" :disabled="isSubmitting">
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        {{ t('register.submit') }}
      </Button>
      <div class="text-center text-sm text-muted-foreground">
        {{ t('register.haveAccount') }}
        <NuxtLink to="/login" class="text-primary hover:underline">{{ t('register.loginHere') }}</NuxtLink>
      </div>
    </form>
  </Card>
</template>
