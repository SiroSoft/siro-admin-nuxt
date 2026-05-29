<script setup lang="ts">
definePageMeta({ middleware: "auth" })

import { useMutation } from "@tanstack/vue-query"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { Loader2, User, Lock } from "lucide-vue-next"
import { profileService } from "~/services/profile.service"
import { useAuthStore } from "~/stores/auth.store"
import PageHeader from "~/components/layout/PageHeader.vue"
import Card from "~/components/ui/Card.vue"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Avatar from "~/components/ui/Avatar.vue"
import Skeleton from "~/components/ui/Skeleton.vue"
import Separator from "~/components/ui/Separator.vue"
import ImageUpload from "~/components/ui/ImageUpload.vue"
import { useToast } from "~/composables/useToast"
import { formatDate } from "~/utils"

const authStore = useAuthStore()

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  avatar: z.string().optional(),
})

const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(8, "New password must be at least 8 characters"),
  new_password_confirmation: z.string(),
}).refine((data) => data.new_password === data.new_password_confirmation, {
  message: "Passwords do not match",
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
const [pAvatar] = defineProfileField("avatar" as any)

const [currentPassword, cpAttrs] = definePasswordField("current_password")
const [newPassword, npAttrs] = definePasswordField("new_password")
const [newPasswordConfirmation, npcAttrs] = definePasswordField("new_password_confirmation" as any)

const profileMutation = useMutation({
  mutationFn: (data: { name: string; email: string; avatar?: string }) => profileService.update(data),
  onSuccess: (userData) => {
    authStore.setUser(userData as any)
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
  passwordMutation.mutate(values as any)
})

const initials = computed(() => {
  if (!authStore.user) return ""
  return authStore.user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
})
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Profile" description="Manage your account settings" />

    <div class="grid gap-6 lg:grid-cols-3">
      <Card class="lg:col-span-1">
        <template #header>
          <span class="text-sm font-medium">Account Info</span>
        </template>
        <div class="flex flex-col items-center text-center">
          <Avatar :fallback="initials" class="h-24 w-24 mb-4 text-2xl" />
          <h3 class="text-lg font-semibold">{{ authStore.user?.name }}</h3>
          <p class="text-sm text-muted-foreground">{{ authStore.user?.email }}</p>
          <p class="text-xs text-muted-foreground mt-1 capitalize">{{ authStore.user?.role }}</p>
          <p v-if="authStore.user?.created_at" class="text-xs text-muted-foreground mt-4">
            Member since {{ formatDate(authStore.user.created_at) }}
          </p>
        </div>
      </Card>

      <div class="lg:col-span-2 space-y-6">
        <Card>
          <template #header>
            <div class="flex items-center gap-2">
              <User class="h-4 w-4" />
              <span class="text-sm font-medium">Profile Details</span>
            </div>
          </template>
          <form @submit="onProfileSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label>Avatar</Label>
              <ImageUpload
                :value="pAvatar"
                @change="(url: string) => setProfileFieldValue('avatar', url)"
                :disabled="profileMutation.isPending.value"
              />
            </div>
            <div class="space-y-2">
              <Label for="pName">Name</Label>
              <Input id="pName" v-model="pName" v-bind="pNameAttrs" placeholder="Your name" :disabled="profileMutation.isPending.value" />
              <p v-if="profileErrors.name" class="text-sm text-destructive">{{ profileErrors.name }}</p>
            </div>
            <div class="space-y-2">
              <Label for="pEmail">Email</Label>
              <Input id="pEmail" type="email" v-model="pEmail" v-bind="pEmailAttrs" placeholder="email@example.com" :disabled="profileMutation.isPending.value" />
              <p v-if="profileErrors.email" class="text-sm text-destructive">{{ profileErrors.email }}</p>
            </div>
            <div class="flex gap-2">
              <Button type="submit" :disabled="profileMutation.isPending.value">
                <Loader2 v-if="profileMutation.isPending.value" class="mr-2 h-4 w-4 animate-spin" />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                :disabled="profileMutation.isPending.value"
                @click="resetProfileForm({ values: { name: authStore.user?.name ?? '', email: authStore.user?.email ?? '', avatar: authStore.user?.avatar ?? '' } })"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <template #header>
            <div class="flex items-center gap-2">
              <Lock class="h-4 w-4" />
              <span class="text-sm font-medium">Change Password</span>
            </div>
          </template>
          <form @submit="onPasswordSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" v-model="currentPassword" v-bind="cpAttrs" placeholder="••••••••" :disabled="passwordMutation.isPending.value" />
              <p v-if="passwordErrors.current_password" class="text-sm text-destructive">{{ passwordErrors.current_password }}</p>
            </div>
            <Separator />
            <div class="space-y-2">
              <Label for="newPassword">New Password</Label>
              <Input id="newPassword" type="password" v-model="newPassword" v-bind="npAttrs" placeholder="••••••••" :disabled="passwordMutation.isPending.value" />
              <p v-if="passwordErrors.new_password" class="text-sm text-destructive">{{ passwordErrors.new_password }}</p>
            </div>
            <div class="space-y-2">
              <Label for="newPasswordConfirmation">Confirm New Password</Label>
              <Input id="newPasswordConfirmation" type="password" v-model="newPasswordConfirmation" v-bind="npcAttrs" placeholder="••••••••" :disabled="passwordMutation.isPending.value" />
              <p v-if="passwordErrors.new_password_confirmation" class="text-sm text-destructive">{{ passwordErrors.new_password_confirmation }}</p>
            </div>
            <div class="flex justify-end">
              <Button type="submit" :disabled="passwordMutation.isPending.value">
                <Loader2 v-if="passwordMutation.isPending.value" class="mr-2 h-4 w-4 animate-spin" />
                Change Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  </div>
</template>
