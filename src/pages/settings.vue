<script setup lang="ts">
definePageMeta({ middleware: "auth" })

import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { Loader2, Moon, Sun, Monitor } from "lucide-vue-next"
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
import AlertDialog from "~/components/ui/AlertDialog.vue"
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
  language: z.string().min(1),
  timezone: z.string().min(1),
  currency: z.string().min(1),
  pagination_per_page: z.coerce.number().int().min(1).max(100),
  maintenance_mode: z.boolean(),
  email_notifications: z.boolean(),
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
    useToast().success("Settings saved", "Application settings have been updated.")
  },
  onError: () => {
    useToast().error("Error", "Failed to save settings.")
  },
})

const onSubmit = handleSubmit((values) => {
  updateMutation.mutate(values)
})

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "vi", label: "Vietnamese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
]

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Ho_Chi_Minh",
  "Asia/Singapore",
  "Asia/Seoul",
  "Asia/Dubai",
  "Australia/Sydney",
  "Pacific/Auckland",
]

const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "VND", label: "VND - Vietnamese Dong" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
  { value: "KRW", label: "KRW - Korean Won" },
  { value: "SGD", label: "SGD - Singapore Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "BRL", label: "BRL - Brazilian Real" },
]

const timezoneOptions = computed(() =>
  TIMEZONES.map((tz) => ({ label: tz, value: tz }))
)

const showMaintenanceAlert = ref(false)
const maintenanceTarget = ref(false)
const previousMaintenance = ref(false)

function handleMaintenanceChange(v: boolean) {
  maintenanceTarget.value = v
  previousMaintenance.value = maintenance_mode.value
  showMaintenanceAlert.value = true
}

function confirmMaintenanceToggle() {
  setFieldValue("maintenance_mode", maintenanceTarget.value)
  showMaintenanceAlert.value = false
}

function cancelMaintenanceToggle() {
  setFieldValue("maintenance_mode", previousMaintenance.value)
  showMaintenanceAlert.value = false
}

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Settings" description="Manage your application settings" />

    <div v-if="isLoading">
      <LoadingSkeleton />
    </div>

    <div v-else-if="isError">
      <ErrorState @retry="refetch()" />
    </div>

    <template v-else>
      <div class="grid gap-6 lg:grid-cols-2">
        <Card>
          <template #header>
            <span class="text-sm font-medium">Application</span>
          </template>
          <form @submit="onSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="app_name">App Name</Label>
              <Input id="app_name" v-model="app_name" v-bind="appNameAttrs" placeholder="My App" :disabled="updateMutation.isPending.value" />
              <p v-if="errors.app_name" class="text-sm text-destructive">{{ errors.app_name }}</p>
            </div>
            <div class="space-y-2">
              <Label for="app_description">Description</Label>
              <Input id="app_description" v-model="app_description" placeholder="Brief description" :disabled="updateMutation.isPending.value" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Language</Label>
                <Select
                  :model-value="language"
                  @update:model-value="(v: string) => setFieldValue('language', v)"
                  :options="LANGUAGES"
                  :disabled="updateMutation.isPending.value"
                />
              </div>
              <div class="space-y-2">
                <Label>Timezone</Label>
                <Select
                  :model-value="timezone"
                  @update:model-value="(v: string) => setFieldValue('timezone', v)"
                  :options="timezoneOptions"
                  :disabled="updateMutation.isPending.value"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Currency</Label>
                <Select
                  :model-value="currency"
                  @update:model-value="(v: string) => setFieldValue('currency', v)"
                  :options="CURRENCIES"
                  :disabled="updateMutation.isPending.value"
                />
              </div>
              <div class="space-y-2">
                <Label for="pagination_per_page">Items Per Page</Label>
                <Input id="pagination_per_page" type="number" v-model="pagination_per_page" :disabled="updateMutation.isPending.value" />
                <p v-if="errors.pagination_per_page" class="text-sm text-destructive">{{ errors.pagination_per_page }}</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2">
                <Switch :model-value="maintenance_mode" @update:model-value="handleMaintenanceChange" :disabled="updateMutation.isPending.value" />
                <Label>Maintenance Mode</Label>
              </div>
              <div class="flex items-center gap-2">
                <Switch :model-value="email_notifications" @update:model-value="(v: boolean) => setFieldValue('email_notifications', v)" :disabled="updateMutation.isPending.value" />
                <Label>Email Notifications</Label>
              </div>
            </div>
            <div class="flex justify-end">
              <Button type="submit" :disabled="updateMutation.isPending.value">
                <Loader2 v-if="updateMutation.isPending.value" class="mr-2 h-4 w-4 animate-spin" />
                Save Settings
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <template #header>
            <span class="text-sm font-medium">Theme</span>
          </template>
          <div class="flex gap-2">
            <Button
              v-for="opt in themeOptions"
              :key="opt.value"
              :variant="colorMode.value === opt.value ? 'default' : 'outline'"
              class="flex-1"
              @click="colorMode.preference = opt.value"
            >
              <component :is="opt.icon" class="mr-2 h-4 w-4" />
              {{ opt.label }}
            </Button>
          </div>
        </Card>

        <Card class="lg:col-span-2">
          <template #header>
            <span class="text-sm font-medium">API Info</span>
          </template>
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="space-y-1">
              <p class="text-xs text-muted-foreground">API URL</p>
              <p class="text-sm font-mono">{{ config.public.apiUrl }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-muted-foreground">App Name</p>
              <p class="text-sm font-medium">{{ config.public.appName }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-muted-foreground">Environment</p>
              <p class="text-sm font-medium">{{ config.public.nodeEnv || config.public.appName }}</p>
            </div>
          </div>
        </Card>
      </div>
    </template>

    <AlertDialog
      :open="showMaintenanceAlert"
      @update:open="(v: boolean) => { if (!v) cancelMaintenanceToggle(); showMaintenanceAlert = v }"
      @confirm="confirmMaintenanceToggle"
      title="Confirm Maintenance Mode"
      description="Enabling maintenance mode will prevent users from accessing the application. Are you sure?"
      confirmText="Enable"
    />
  </div>
</template>
