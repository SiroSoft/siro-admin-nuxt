<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Card from "~/components/ui/Card.vue"
import { useToast } from "~/composables/useToast"
import { authService } from "~/services/auth.service"
import { useAuthStore } from "~/stores/auth.store"

definePageMeta({ layout: "auth" })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const queryToken = (route.query.token as string) || ""

const schema = z.object({
  token: z.string().min(1, t("validation.tokenRequired")),
})

const { handleSubmit, errors, defineField, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: { token: queryToken },
})

const [token] = defineField("token")
const verified = ref(false)
const isResending = ref(false)

const isAlreadyVerified = computed(() => !!authStore.user?.email_verified_at)

const onSubmit = handleSubmit(async (values) => {
  try {
    await authService.verifyEmail(values)
    verified.value = true
    setTimeout(() => router.push("/"), 1500)
  } catch {
    useToast().error(t('verifyEmail.invalidToken'), '')
  }
})

const handleResend = async () => {
  isResending.value = true
  try {
    await authService.resendVerificationEmail()
    useToast().success(t('profile.verificationSent'), '')
  } catch {
    useToast().error(t('errors.networkError'), '')
  } finally {
    isResending.value = false
  }
}
</script>

<template>
  <Card>
    <template #header>
      <div class="text-center">
        <h3 class="text-2xl font-bold">{{ t('verifyEmail.title') }}</h3>
        <p v-if="isAlreadyVerified" class="flex items-center justify-center gap-2 mt-2 text-emerald-600">
          <CheckCircle2 class="h-5 w-5" />
          <span class="text-sm font-medium">{{ t('profile.emailVerified') }}</span>
        </p>
      </div>
    </template>

    <div v-if="verified" class="text-center space-y-4">
      <div class="rounded-full bg-emerald-500/10 p-3 mx-auto w-fit">
        <CheckCircle2 class="h-6 w-6 text-emerald-500" />
      </div>
      <p class="text-sm text-muted-foreground">{{ t('verifyEmail.success') }}</p>
      <NuxtLink to="/">
        <Button>{{ t('common.dashboard') }}</Button>
      </NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div v-if="!isAlreadyVerified && authStore.user" class="flex items-center justify-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
        <AlertTriangle class="h-5 w-5 text-amber-500" />
        <span class="text-sm text-amber-700 dark:text-amber-400">{{ t('profile.emailNotVerified') }}</span>
      </div>

      <form @submit="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="token">{{ t('verifyEmail.token') }}</Label>
          <Input id="token" v-model="token" :placeholder="t('placeholders.verificationToken')" />
          <p v-if="errors.token" class="text-sm text-destructive">{{ errors.token }}</p>
        </div>
        <Button type="submit" class="w-full" :disabled="isSubmitting || isAlreadyVerified">
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          {{ t('verifyEmail.submit') }}
        </Button>
      </form>

      <Button
        v-if="!isAlreadyVerified"
        type="button"
        variant="outline"
        class="w-full"
        :disabled="isResending"
        @click="handleResend"
      >
        <Loader2 v-if="isResending" class="mr-2 h-4 w-4 animate-spin" />
        {{ t('profile.resendVerification') }}
      </Button>
    </div>
  </Card>
</template>
