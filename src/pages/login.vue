<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { Eye, EyeOff, Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Card from "~/components/ui/Card.vue"
import { loginSchema } from "~/modules/auth/schemas/login.schema"
import { useAuth } from "~/composables/useAuth"

definePageMeta({
  layout: "auth",
})

const { login, isLoginPending, loginError, isLoading } = useAuth()
const showPassword = ref(false)
const rememberMe = ref(false)

const { handleSubmit, errors, defineField, setFieldValue } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const [email, emailAttrs] = defineField("email")
const [password, passwordAttrs] = defineField("password")

onMounted(() => {
  const saved = localStorage.getItem("remembered_email")
  if (saved) {
    setFieldValue("email", saved)
    rememberMe.value = true
  }
})

const onSubmit = handleSubmit((values) => {
  if (rememberMe.value) {
    localStorage.setItem("remembered_email", values.email)
  } else {
    localStorage.removeItem("remembered_email")
  }
  login(values)
})

const serverError = computed(() => {
  if (loginError.value) {
    return (loginError.value as any)?.response?.data?.message || "Invalid credentials"
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
          <p class="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>
      </div>
    </template>

    <div v-if="isLoading && !isLoginPending" class="flex items-center justify-center py-8">
      <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
    </div>

    <form v-else @submit="onSubmit" class="space-y-4">
      <div class="space-y-2">
        <Label for="email">Email</Label>
        <Input id="email" type="email" v-model="email" v-bind="emailAttrs" placeholder="admin@example.com" autocomplete="email" />
        <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
      </div>

      <div class="space-y-2">
        <Label for="password">Password</Label>
        <div class="relative">
          <Input id="password" :type="showPassword ? 'text' : 'password'" v-model="password" v-bind="passwordAttrs" placeholder="••••••••" autocomplete="current-password" />
          <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" :aria-label="showPassword ? 'Hide password' : 'Show password'">
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
          Remember me
        </label>
        <NuxtLink to="/forgot-password" class="text-sm text-primary hover:underline">Forgot password?</NuxtLink>
      </div>

      <Button type="submit" class="w-full" :disabled="isLoginPending">
        <Loader2 v-if="isLoginPending" class="mr-2 h-4 w-4 animate-spin" />
        Sign in
      </Button>
    </form>
  </Card>
</template>
