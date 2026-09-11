<script setup lang="ts">
definePageMeta({ middleware: "auth" })

import { useMutation } from "@tanstack/vue-query"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { Loader2, User, Lock, CheckCircle2, AlertTriangle, Mail } from "lucide-vue-next"
import { profileService } from "~/services/profile.service"
import { authService } from "~/services/auth.service"
import { useAuthStore } from "~/stores/auth.store"
import PageHeader from "~/components/layout/PageHeader.vue"
import Card from "~/components/ui/Card.vue"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Avatar from "~/components/ui/Avatar.vue"

import Separator from "~/components/ui/Separator.vue"
import ImageUpload from "~/components/ui/ImageUpload.vue"
import { useToast } from "~/composables/useToast"
import { formatDate } from "~/utils"

const { t } = useI18n()
const authStore = useAuthStore()

const profileSchema = z.object({
  name: z.string().min(2, t("validation.nameMin", { min: 2 })),
  email: z.string().email(t("validation.invalidEmail")),
  avatar: z.string().optional(),
})

const passwordSchema = z.object({
  current_password: z.string().min(1, t("validation.currentPasswordRequired")),
  new_password: z.string().min(8, t("validation.newPasswordMin", { min: 8 })),
  new_password_confirmation: z.string(),
}).refine((data) => data.new_password === data.new_password_confirmation, {
  message: t("validation.passwordMismatch"),
  path: ["new_password_confirmation"],
})

const { handleSubmit: handleProfileSubmit, errors: profileErrors, defineField: defineProfileField, isSubmitting: isProfileSubmitting, resetForm: resetProfileForm, setFieldValue: setProfileFieldValue } = useForm({
  validationSchema: toTypedSchema(profileSchema),
  initialValues: {
    name: authStore.user?.name ?? "",
    email: authStore.user?.email ?? "",
    avatar: authStore.user?.avatar ?? "",
  },
})

const { handleSubmit: handlePasswordSubmit, errors: passwordErrors, defineField: definePasswordField, isSubmitting: isPasswordSubmitting, resetForm: resetPasswordForm } = useForm({
  validationSchema: toTypedSchema(passwordSchema),
})

const [pName, pNameAttrs] = defineProfileField("name")
const [pEmail, pEmailAttrs] = defineProfileField("email")
const [pAvatar] = defineProfileField("avatar")

const [currentPassword, cpAttrs] = definePasswordField("current_password")
const [newPassword, npAttrs] = definePasswordField("new_password")
const [newPasswordConfirmation, npcAttrs] = definePasswordField("new_password_confirmation")

const profileMutation = useMutation({
  mutationFn: (data: { name: string; email: string; avatar?: string }) => profileService.update(data),
  onSuccess: (userData) => {
    authStore.setUser(userData)
    useToast().success("Profile updated", "Your profile has been updated.")
  },
  onError: () => {
    useToast().error("Error", "Failed to update profile.")
  },
})

const passwordMutation = useMutation({
  mutationFn: (data: { current_password: string; new_password: string; new_password_confirmation: string }) => profileService.changePassword(data),
  onSuccess: () => {
    useToast().success("Password changed", "Your password has been changed.")
    resetPasswordForm()
  },
  onError: () => {
    useToast().error("Error", "Failed to change password.")
  },
})

const onProfileSubmit = handleProfileSubmit((values) => {
  profileMutation.mutate(values)
})

const onPasswordSubmit = handlePasswordSubmit((values) => {
  passwordMutation.mutate(values)
})

const initials = computed(() => {
  if (!authStore.user?.name) return ""
  return authStore.user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
})

const isResending = ref(false)

const handleResendVerification = async () => {
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
  <div class="space-y-6">
    <PageHeader :title="t('profile.title')" :description="t('profile.description')" />

    <div class="grid gap-6 lg:grid-cols-3">
      <Card class="lg:col-span-1">
        <template #header>
          <span class="text-sm font-medium">{{ t('profile.accountInfo') }}</span>
        </template>
        <div class="flex flex-col items-center text-center">
          <Avatar :fallback="initials" class="h-24 w-24 mb-4 text-2xl" />
          <h3 class="text-lg font-semibold">{{ authStore.user?.name }}</h3>
          <p class="text-sm text-muted-foreground">{{ authStore.user?.email }}</p>
          <p class="text-xs text-muted-foreground mt-1 capitalize">{{ authStore.user?.role }}</p>
          <div class="mt-3 flex items-center gap-2">
            <template v-if="authStore.user?.email_verified_at">
              <span class="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400">
                <CheckCircle2 class="h-3 w-3" />
                {{ t('profile.emailVerified') }}
              </span>
            </template>
            <template v-else>
              <span class="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
                <AlertTriangle class="h-3 w-3" />
                {{ t('profile.emailNotVerified') }}
              </span>
              <Button size="sm" variant="ghost" :disabled="isResending" @click="handleResendVerification" class="text-xs h-7 px-2">
                <Loader2 v-if="isResending" class="h-3 w-3 animate-spin mr-1" />
                <Mail v-else class="h-3 w-3 mr-1" />
                {{ t('profile.resendVerification') }}
              </Button>
            </template>
          </div>
          <p v-if="authStore.user?.created_at" class="text-xs text-muted-foreground mt-4">
            {{ t('profile.memberSince', { date: formatDate(authStore.user.created_at) }) }}
          </p>
        </div>
      </Card>

      <div class="lg:col-span-2 space-y-6">
        <Card>
          <template #header>
            <div class="flex items-center gap-2">
              <User class="h-4 w-4" />
              <span class="text-sm font-medium">{{ t('profile.profileDetails') }}</span>
            </div>
          </template>
          <form @submit="onProfileSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label>{{ t('profile.avatar') }}</Label>
              <ImageUpload
                :value="pAvatar"
                @change="(url: string) => setProfileFieldValue('avatar', url)"
                :disabled="profileMutation.isPending.value"
              />
            </div>
            <div class="space-y-2">
              <Label for="pName">{{ t('common.name') }}</Label>
              <Input id="pName" v-model="pName" v-bind="pNameAttrs" :placeholder="t('placeholders.profileName')" :disabled="profileMutation.isPending.value" />
              <p v-if="profileErrors.name" class="text-sm text-destructive">{{ profileErrors.name }}</p>
            </div>
            <div class="space-y-2">
              <Label for="pEmail">{{ t('common.email') }}</Label>
              <Input id="pEmail" type="email" v-model="pEmail" v-bind="pEmailAttrs" :placeholder="t('placeholders.profileEmail')" :disabled="profileMutation.isPending.value" />
              <p v-if="profileErrors.email" class="text-sm text-destructive">{{ profileErrors.email }}</p>
            </div>
            <div class="flex gap-2">
              <Button type="submit" :disabled="profileMutation.isPending.value">
                <Loader2 v-if="profileMutation.isPending.value" class="mr-2 h-4 w-4 animate-spin" />
                {{ t('profile.saveChanges') }}
              </Button>
              <Button
                type="button"
                variant="outline"
                :disabled="profileMutation.isPending.value"
                @click="resetProfileForm({ values: { name: authStore.user?.name ?? '', email: authStore.user?.email ?? '', avatar: authStore.user?.avatar ?? '' } })"
              >
                {{ t('common.cancel') }}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <template #header>
            <div class="flex items-center gap-2">
              <Lock class="h-4 w-4" />
              <span class="text-sm font-medium">{{ t('profile.changePassword') }}</span>
            </div>
          </template>
          <form @submit="onPasswordSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="currentPassword">{{ t('profile.currentPassword') }}</Label>
              <Input id="currentPassword" type="password" v-model="currentPassword" v-bind="cpAttrs" placeholder="••••••••" :disabled="passwordMutation.isPending.value" />
              <p v-if="passwordErrors.current_password" class="text-sm text-destructive">{{ passwordErrors.current_password }}</p>
            </div>
            <Separator />
            <div class="space-y-2">
              <Label for="newPassword">{{ t('profile.newPassword') }}</Label>
              <Input id="newPassword" type="password" v-model="newPassword" v-bind="npAttrs" placeholder="••••••••" :disabled="passwordMutation.isPending.value" />
              <p v-if="passwordErrors.new_password" class="text-sm text-destructive">{{ passwordErrors.new_password }}</p>
            </div>
            <div class="space-y-2">
              <Label for="newPasswordConfirmation">{{ t('profile.confirmNewPassword') }}</Label>
              <Input id="newPasswordConfirmation" type="password" v-model="newPasswordConfirmation" v-bind="npcAttrs" placeholder="••••••••" :disabled="passwordMutation.isPending.value" />
              <p v-if="passwordErrors.new_password_confirmation" class="text-sm text-destructive">{{ passwordErrors.new_password_confirmation }}</p>
            </div>
            <div class="flex justify-end">
              <Button type="submit" :disabled="passwordMutation.isPending.value">
                <Loader2 v-if="passwordMutation.isPending.value" class="mr-2 h-4 w-4 animate-spin" />
                {{ t('profile.changePassword') }}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  </div>
</template>
