<script setup lang="ts">
definePageMeta({ middleware: "auth" })

import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { Loader2, Moon, Sun } from "lucide-vue-next"
import { settingsService } from "~/services/settings.service"
import PageHeader from "~/components/layout/PageHeader.vue"
import Card from "~/components/ui/Card.vue"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Switch from "~/components/ui/Switch.vue"
import Select from "~/components/ui/Select.vue"
import LoadingSkeleton from "~/components/states/LoadingSkeleton.vue"
import ErrorState from "~/components/states/ErrorState.vue"
import Separator from "~/components/ui/Separator.vue"
import { useRuntimeConfig } from "nuxt/app"
import { useToast } from "~/composables/useToast"

const queryClient = useQueryClient()
const colorMode = useColorMode()
const config = useRuntimeConfig()

const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ["settings"],
  queryFn: () => settingsService.get(),
})

const settingsSchema = z.object({
  app_name: z.string().min(1, "App name is required"),
  app_description: z.string().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  pagination_per_page: z.number().int().min(1).max(100).default(15),
  maintenance_mode: z.boolean().default(false),
  email_notifications: z.boolean().default(true),
})

const { handleSubmit, errors, defineField, setFieldValue, isSubmitting, resetForm } = useForm({
  validationSchema: toTypedSchema(settingsSchema),
  initialValues: {
    app_name: "",
    app_description: "",
    language: "en",
    timezone: "UTC",
    currency: "USD",
    pagination_per_page: 15,
    maintenance_mode: false,
    email_notifications: true,
  },
})

watch(data, (val) => {
  if (val?.data) {
    resetForm({
      values: {
        app_name: val.data.app_name ?? "",
        app_description: val.data.app_description ?? "",
        language: val.data.language ?? "en",
        timezone: val.data.timezone ?? "UTC",
        currency: val.data.currency ?? "USD",
        pagination_per_page: val.data.pagination_per_page ?? 15,
        maintenance_mode: val.data.maintenance_mode ?? false,
        email_notifications: val.data.email_notifications ?? true,
      },
    })
  }
}, { immediate: true })

const [app_name, appNameAttrs] = defineField("app_name")
const [app_description] = defineField("app_description" as any)
const [language] = defineField("language" as any)
const [timezone] = defineField("timezone" as any)
const [currency] = defineField("currency" as any)
const [pagination_per_page] = defineField("pagination_per_page" as any)
const [maintenance_mode] = defineField("maintenance_mode" as any)
const [email_notifications] = defineField("email_notifications" as any)

const updateMutation = useMutation({
  mutationFn: (formData: any) => settingsService.update(formData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["settings"] })
    useToast().success("Settings saved", "Settings have been updated successfully.")
  },
  onError: () => {
    useToast().error("Error", "Failed to save settings.")
  },
})

const onSubmit = handleSubmit((values) => {
  updateMutation.mutate(values)
})

const languageOptions = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Vietnamese", value: "vi" },
]

const currencyOptions = [
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "GBP (£)", value: "GBP" },
  { label: "VND (₫)", value: "VND" },
]

function toggleTheme() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark"
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Settings" description="Application settings" />

    <div v-if="isLoading">
      <LoadingSkeleton />
    </div>

    <div v-else-if="isError">
      <ErrorState @retry="refetch()" />
    </div>

    <template v-else>
      <form @submit="onSubmit" class="space-y-6">
        <Card>
          <template #header>
            <span class="text-sm font-medium">Application</span>
          </template>
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="app_name">Application Name</Label>
              <Input id="app_name" v-model="app_name" v-bind="appNameAttrs" placeholder="Siro Admin" />
              <p v-if="errors.app_name" class="text-sm text-destructive">{{ errors.app_name }}</p>
            </div>
            <div class="space-y-2">
              <Label for="app_description">Description</Label>
              <Input id="app_description" v-model="app_description" placeholder="Brief description of your application" />
            </div>
          </div>
        </Card>

        <Card>
          <template #header>
            <span class="text-sm font-medium">Localization</span>
          </template>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <Label>Language</Label>
              <Select
                :model-value="language"
                @update:model-value="(v: string) => setFieldValue('language', v)"
                :options="languageOptions"
              />
            </div>
            <div class="space-y-2">
              <Label for="timezone">Timezone</Label>
              <Input id="timezone" v-model="timezone" placeholder="UTC" />
            </div>
            <div class="space-y-2">
              <Label>Currency</Label>
              <Select
                :model-value="currency"
                @update:model-value="(v: string) => setFieldValue('currency', v)"
                :options="currencyOptions"
              />
            </div>
          </div>
        </Card>

        <Card>
          <template #header>
            <span class="text-sm font-medium">Preferences</span>
          </template>
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="pagination_per_page">Items Per Page</Label>
              <Input id="pagination_per_page" type="number" v-model="pagination_per_page" min="1" max="100" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p class="text-xs text-muted-foreground">Disable public access to the application</p>
              </div>
              <Switch :model-value="maintenance_mode" @update:model-value="(v: boolean) => setFieldValue('maintenance_mode', v)" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p class="text-xs text-muted-foreground">Receive email notifications for system events</p>
              </div>
              <Switch :model-value="email_notifications" @update:model-value="(v: boolean) => setFieldValue('email_notifications', v)" />
            </div>
          </div>
        </Card>

        <Card>
          <template #header>
            <span class="text-sm font-medium">Theme</span>
          </template>
          <div class="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
              <p class="text-xs text-muted-foreground">Toggle between light and dark theme</p>
            </div>
            <Button variant="outline" size="icon" @click="toggleTheme">
              <Sun v-if="colorMode.value === 'dark'" class="h-4 w-4" />
              <Moon v-else class="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card>
          <template #header>
            <span class="text-sm font-medium">API Info</span>
          </template>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">API URL</span>
              <code class="font-mono text-xs">{{ config.public.apiUrl }}</code>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">App Name</span>
              <code class="font-mono text-xs">{{ config.public.appName }}</code>
            </div>
          </div>
        </Card>

        <div class="flex justify-end">
          <Button type="submit" :disabled="isSubmitting || updateMutation.isPending.value">
            <Loader2 v-if="updateMutation.isPending.value" class="mr-2 h-4 w-4 animate-spin" />
            Save Settings
          </Button>
        </div>
      </form>
    </template>
  </div>
</template>
