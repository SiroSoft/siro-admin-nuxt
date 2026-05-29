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
import { useToast } from "~/composables/useToast"
import { formatDate } from "~/utils"

const authStore = useAuthStore()

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
})

const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(8, "New password must be at least 8 characters"),
  new_password_confirmation: z.string(),
}).refine((data) => data.new_password === data.new_password_confirmation, {
  message: "Passwords do not match",
  path: ["new_password_confirmation"],
})

const { handleSubmit: handleProfileSubmit, errors: profileErrors, defineField: defineProfileField, isSubmitting: isProfileSubmitting, resetForm: resetProfileForm } = useForm({
  validationSchema: toTypedSchema(profileSchema),
  initialValues: {
    name: authStore.user?.name ?? "",
    email: authStore.user?.email ?? "",
  },
})

const { handleSubmit: handlePasswordSubmit, errors: passwordErrors, defineField: definePasswordField, isSubmitting: isPasswordSubmitting, resetForm: resetPasswordForm } = useForm({
  validationSchema: toTypedSchema(passwordSchema),
})

const [pName, pNameAttrs] = defineProfileField("name")
const [pEmail, pEmailAttrs] = defineProfileField("email")

const [currentPassword, cpAttrs] = definePasswordField("current_password")
const [newPassword, npAttrs] = definePasswordField("new_password")
const [newPasswordConfirmation, npcAttrs] = definePasswordField("new_password_confirmation" as any)

const profileMutation = useMutation({
  mutationFn: (data: { name: string; email: string }) => profileService.update(data),
  onSuccess: (userData) => {
    authStore.setUser(userData as any)
    useToast().success("Profile updated", "Your profile has been updated successfully.")
  },
  onError: () => {
    useToast().error("Error", "Failed to update profile.")
  },
})

const passwordMutation = useMutation({
  mutationFn: (data: { current_password: string; new_password: string; new_password_confirmation: string }) => profileService.changePassword(data),
  onSuccess: () => {
    useToast().success("Password changed", "Your password has been changed successfully.")
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
    <PageHeader title="Profile" description="Manage your account" />

    <Card>
      <template #header>
        <div class="flex items-center gap-4">
          <Avatar :fallback="initials" class="h-16 w-16 text-lg" />
          <div>
            <h2 v-if="authStore.user" class="text-lg font-semibold">{{ authStore.user.name }}</h2>
            <p v-if="authStore.user" class="text-sm text-muted-foreground">{{ authStore.user.email }}</p>
            <p v-if="authStore.user" class="text-xs text-muted-foreground mt-1">Member since {{ formatDate(authStore.user.created_at) }}</p>
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #header>
        <div class="flex items-center gap-2">
          <User class="h-4 w-4" />
          <span class="text-sm font-medium">Account Information</span>
        </div>
      </template>
      <form @submit="onProfileSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="pName">Name</Label>
          <Input id="pName" v-model="pName" v-bind="pNameAttrs" placeholder="Your name" />
          <p v-if="profileErrors.name" class="text-sm text-destructive">{{ profileErrors.name }}</p>
        </div>
        <div class="space-y-2">
          <Label for="pEmail">Email</Label>
          <Input id="pEmail" type="email" v-model="pEmail" v-bind="pEmailAttrs" placeholder="email@example.com" />
          <p v-if="profileErrors.email" class="text-sm text-destructive">{{ profileErrors.email }}</p>
        </div>
        <div class="flex justify-end">
          <Button type="submit" :disabled="isProfileSubmitting || profileMutation.isPending.value">
            <Loader2 v-if="profileMutation.isPending.value" class="mr-2 h-4 w-4 animate-spin" />
            Update Profile
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
          <Input id="currentPassword" type="password" v-model="currentPassword" v-bind="cpAttrs" placeholder="••••••••" />
          <p v-if="passwordErrors.current_password" class="text-sm text-destructive">{{ passwordErrors.current_password }}</p>
        </div>
        <div class="space-y-2">
          <Label for="newPassword">New Password</Label>
          <Input id="newPassword" type="password" v-model="newPassword" v-bind="npAttrs" placeholder="••••••••" />
          <p v-if="passwordErrors.new_password" class="text-sm text-destructive">{{ passwordErrors.new_password }}</p>
        </div>
        <div class="space-y-2">
          <Label for="newPasswordConfirmation">Confirm New Password</Label>
          <Input id="newPasswordConfirmation" type="password" v-model="newPasswordConfirmation" v-bind="npcAttrs" placeholder="••••••••" />
          <p v-if="passwordErrors.new_password_confirmation" class="text-sm text-destructive">{{ passwordErrors.new_password_confirmation }}</p>
        </div>
        <div class="flex justify-end">
          <Button type="submit" :disabled="isPasswordSubmitting || passwordMutation.isPending.value">
            <Loader2 v-if="passwordMutation.isPending.value" class="mr-2 h-4 w-4 animate-spin" />
            Change Password
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>
