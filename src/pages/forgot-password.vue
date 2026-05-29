<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Card from "~/components/ui/Card.vue"
import { useToast } from "~/composables/useToast"

definePageMeta({ layout: "auth" })

const router = useRouter()
const submitted = ref(false)

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

const { handleSubmit, errors, defineField, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
})

const [email, emailAttrs] = defineField("email")

const onSubmit = handleSubmit(async (values) => {
  try {
    submitted.value = true
    useToast().success("Email sent", "If an account exists with that email, you will receive a password reset link.")
  } catch {
    submitted.value = false
    useToast().error("Error", "Failed to send reset link. Please try again.")
  }
})
</script>

<template>
  <Card>
    <template #header>
      <div class="text-center">
        <h3 class="text-2xl font-bold">Forgot password?</h3>
        <p class="text-sm text-muted-foreground mt-1">
          {{ submitted ? "Check your email for a reset link" : "Enter your email and we'll send you a reset link" }}
        </p>
      </div>
    </template>

    <form v-if="!submitted" @submit="onSubmit" class="space-y-4">
      <div class="space-y-2">
        <Label for="email">Email</Label>
        <Input id="email" type="email" v-model="email" v-bind="emailAttrs" placeholder="name@example.com" autocomplete="email" />
        <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
      </div>

      <Button type="submit" class="w-full" :disabled="isSubmitting">
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        <Mail v-else class="mr-2 h-4 w-4" />
        Send reset link
      </Button>
    </form>

    <div v-else class="text-center space-y-4">
      <div class="rounded-full bg-primary/10 p-3 mx-auto w-fit">
        <CheckCircle2 class="h-6 w-6 text-primary" />
      </div>
      <p class="text-sm text-muted-foreground">
        We've sent a password reset link to <strong class="text-foreground">{{ email }}</strong>
      </p>
    </div>

    <div class="mt-4 text-center">
      <button type="button" @click="router.push('/login')" class="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        <ArrowLeft class="h-3 w-3" />
        Back to login
      </button>
    </div>
  </Card>
</template>
