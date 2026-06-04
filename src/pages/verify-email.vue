<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { Loader2, CheckCircle2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Card from "~/components/ui/Card.vue"
import { useToast } from "~/composables/useToast"
import { authService } from "~/services/auth.service"

definePageMeta({ layout: "auth" })

const { t } = useI18n()
const route = useRoute()
const queryToken = (route.query.token as string) || ""

const schema = z.object({
  token: z.string().min(1, "Token is required"),
})

const { handleSubmit, errors, defineField, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: { token: queryToken },
})

const [token] = defineField("token")
const verified = ref(false)

const onSubmit = handleSubmit(async (values) => {
  try {
    await authService.verifyEmail(values)
    verified.value = true
  } catch {
    useToast().error(t('verifyEmail.invalidToken'), '')
  }
})
</script>

<template>
  <Card>
    <template #header>
      <div class="text-center">
        <h3 class="text-2xl font-bold">{{ t('verifyEmail.title') }}</h3>
      </div>
    </template>

    <div v-if="verified" class="text-center space-y-4">
      <div class="rounded-full bg-emerald-500/10 p-3 mx-auto w-fit">
        <CheckCircle2 class="h-6 w-6 text-emerald-500" />
      </div>
      <p class="text-sm text-muted-foreground">{{ t('verifyEmail.success') }}</p>
      <NuxtLink to="/login">
        <Button>{{ t('common.login') }}</Button>
      </NuxtLink>
    </div>

    <form v-else @submit="onSubmit" class="space-y-4">
      <div class="space-y-2">
        <Label for="token">Token</Label>
        <Input id="token" v-model="token" placeholder="Enter verification token" />
        <p v-if="errors.token" class="text-sm text-destructive">{{ errors.token }}</p>
      </div>
      <Button type="submit" class="w-full" :disabled="isSubmitting">
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        {{ t('verifyEmail.submit') }}
      </Button>
    </form>
  </Card>
</template>
