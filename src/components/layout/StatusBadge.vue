<script setup lang="ts">
import Badge from "~/components/ui/Badge.vue"

interface Props {
  status: string
}

const props = defineProps<Props>()

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" | "default" }> = {
  active: { label: "Active", variant: "success" },
  approved: { label: "Approved", variant: "success" },
  completed: { label: "Completed", variant: "success" },
  published: { label: "Published", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "warning" },
  inactive: { label: "Inactive", variant: "secondary" },
  suspended: { label: "Suspended", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  archived: { label: "Archived", variant: "secondary" },
  admin: { label: "Admin", variant: "default" },
  editor: { label: "Editor", variant: "warning" },
  viewer: { label: "Viewer", variant: "secondary" },
  healthy: { label: "Healthy", variant: "success" },
  degraded: { label: "Degraded", variant: "warning" },
  down: { label: "Down", variant: "destructive" },
}

const config = computed(() => {
  const key = props.status.toLowerCase()
  return statusMap[key] ?? { label: props.status, variant: "secondary" as const }
})
</script>

<template>
  <Badge :variant="config.variant">{{ config.label }}</Badge>
</template>
