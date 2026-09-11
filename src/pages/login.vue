<script setup lang="ts">
import { AxiosError } from "axios"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { Eye, EyeOff, Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Card from "~/components/ui/Card.vue"
import { loginSchema } from "~/modules/auth/schemas/login.schema"
import { useAuth } from "~/composables/useAuth"
import VueTurnstile from "vue-turnstile"

definePageMeta({
  layout: "auth",
  ssr: false,
})

const { t } = useI18n()
const { login, isLoginPending, loginError, isLoading } = useAuth()
const showPassword = ref(false)
const rememberMe = ref(false)

const { handleSubmit, errors, defineField, setFieldValue } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const [email, emailAttrs] = defineField("email")
const [password, passwordAttrs] = defineField("password")

onMounted(() => {
  const saved = localStorage.getItem("siro_remember_email")
  if (saved) {
    setFieldValue("email", saved)
    rememberMe.value = true
  }
})

const demoEmail = "demo@skeleton.sirophp.com"
const demoPassword = "Demo123!"
const turnstileSiteKey = (useRuntimeConfig().public.turnstileSiteKey as string) || ""
const turnstileToken = ref("")
function onDemoLogin() {
  login({ email: demoEmail, password: demoPassword, ...(turnstileToken.value ? { "cf-turnstile-response": turnstileToken.value } : {}) })
}
const onSubmit = handleSubmit((values) => {
  if (rememberMe.value) {
    localStorage.setItem("siro_remember_email", values.email)
  } else {
    localStorage.removeItem("siro_remember_email")
  }
  login({ ...values, ...(turnstileToken.value ? { "cf-turnstile-response": turnstileToken.value } : {}) })
})

const serverError = computed(() => {
  if (loginError.value) {
    const err = loginError.value
    if (err instanceof AxiosError) {
      return err.response?.data?.message || t('auth.invalidCredentials')
    }
    return t('auth.invalidCredentials')
  }
  return null
})
</script>

<template>
  <Card>
    <template #header>
      <div class="text-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" class="mx-auto h-12 w-12"><rect width="32" height="32" rx="8" fill="#2563eb"/><path d="M12 5h10l-4 10h4l-6 14 2-12h-4l2-12z" fill="white"/></svg>
        <div>
          <h3 class="text-2xl font-bold">Siro Admin</h3>
          <p class="text-sm text-muted-foreground mt-1">{{ t('auth.signIn') }}</p>
        </div>
      </div>
    </template>

    <div v-if="isLoading && !isLoginPending" class="flex items-center justify-center py-8">
      <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
    </div>

    <form v-else @submit="onSubmit" class="space-y-4">
      <div class="space-y-2">
        <Label for="email">{{ t('auth.email') }} <span class="text-destructive">*</span></Label>
        <Input id="email" type="email" v-model="email" v-bind="emailAttrs" :placeholder="t('placeholders.email')" autocomplete="email" autofocus />
        <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
      </div>

      <div class="space-y-2">
        <Label for="password">{{ t('auth.password') }} <span class="text-destructive">*</span></Label>
        <div class="relative">
          <Input id="password" :type="showPassword ? 'text' : 'password'" v-model="password" v-bind="passwordAttrs" placeholder="••••••••" autocomplete="current-password" />
          <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" :aria-label="showPassword ? t('auth.hidePassword') : t('auth.showPassword')">
            <EyeOff v-if="showPassword" class="h-4 w-4" />
            <Eye v-else class="h-4 w-4" />
          </button>
        </div>
        <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
      </div>

      <p v-if="serverError" class="text-sm text-destructive">{{ serverError }}</p>

      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="rememberMe" class="h-4 w-4 rounded border-primary text-primary focus:ring-ring" />
          {{ t('auth.rememberMe') }}
        </label>
        <NuxtLink to="/forgot-password" class="text-sm text-primary hover:underline">{{ t('auth.forgotPassword') }}</NuxtLink>
      </div>

      <ClientOnly>
        <VueTurnstile v-if="turnstileSiteKey" :site-key="turnstileSiteKey" v-model="turnstileToken" />
      </ClientOnly>
      <Button type="button" variant="outline" class="w-full" :disabled="isLoginPending" @click="onDemoLogin">{{ t('auth.tryDemo') }}</Button> <Button type="submit" class="w-full" :disabled="isLoginPending">
        <Loader2 v-if="isLoginPending" class="mr-2 h-4 w-4 animate-spin" />
        {{ t('common.login') }}
      </Button>
      <OpenSourceLinks class="mt-4" />
      <ApiStatusFooter />
      <p class="text-sm text-center text-muted-foreground mt-4">
        {{ t('auth.noAccount') }}
        <NuxtLink to="/register" class="text-primary hover:underline">        {{ t('auth.signUp') }}</NuxtLink>
      </p>
    </form>
  </Card>
</template>
