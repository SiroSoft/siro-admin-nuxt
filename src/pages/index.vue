<script setup lang="ts">
definePageMeta({ middleware: "auth" })

import { Users, ShoppingCart, Package, DollarSign, Activity, RefreshCw, TrendingUp, ArrowRight, Plus, Eye, Settings } from "lucide-vue-next"
import { Bar } from "vue-chartjs"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from "chart.js"
import Card from "~/components/ui/Card.vue"
import PageHeader from "~/components/layout/PageHeader.vue"
import StatsSkeleton from "~/components/states/StatsSkeleton.vue"
import LoadingSkeleton from "~/components/states/LoadingSkeleton.vue"
import ErrorState from "~/components/states/ErrorState.vue"
import EmptyState from "~/components/states/EmptyState.vue"
import StatusBadge from "~/components/layout/StatusBadge.vue"
import Button from "~/components/ui/Button.vue"
import { useDashboard } from "~/composables/useDashboard"
import { useAuth } from "~/composables/useAuth"
import { formatDate, formatNumber, formatRelativeTime, cn } from "~/utils"
import Avatar from "~/components/ui/Avatar.vue"

const iconColors: Record<string, string> = {
  "Total Users": "bg-gradient-to-br from-blue-500/10 to-blue-600/20 text-blue-600 dark:from-blue-500/20 dark:to-blue-600/30 dark:text-blue-400 ring-1 ring-blue-500/20",
  "Active Users": "bg-gradient-to-br from-cyan-500/10 to-cyan-600/20 text-cyan-600 dark:from-cyan-500/20 dark:to-cyan-600/30 dark:text-cyan-400 ring-1 ring-cyan-500/20",
  "Total Orders": "bg-gradient-to-br from-orange-500/10 to-orange-600/20 text-orange-600 dark:from-orange-500/20 dark:to-orange-600/30 dark:text-orange-400 ring-1 ring-orange-500/20",
  "Total Products": "bg-gradient-to-br from-purple-500/10 to-purple-600/20 text-purple-600 dark:from-purple-500/20 dark:to-purple-600/30 dark:text-purple-400 ring-1 ring-purple-500/20",
  Revenue: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 text-emerald-600 dark:from-emerald-500/20 dark:to-emerald-600/30 dark:text-emerald-400 ring-1 ring-emerald-500/20",
}

const gradColors: Record<string, string> = {
  "Total Users": "from-blue-600 to-blue-400",
  "Active Users": "from-cyan-600 to-cyan-400",
  "Total Orders": "from-orange-600 to-orange-400",
  "Total Products": "from-purple-600 to-purple-400",
  Revenue: "from-emerald-600 to-emerald-400",
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { ticks: { color: "hsl(var(--muted-foreground))" }, grid: { color: "hsl(var(--border))" } },
    y: { ticks: { color: "hsl(var(--muted-foreground))" }, grid: { color: "hsl(var(--border))" } },
  },
  plugins: {
    tooltip: {
      backgroundColor: "hsl(var(--popover))",
      borderColor: "hsl(var(--border))",
      borderWidth: 1,
      titleColor: "hsl(var(--foreground))",
      bodyColor: "hsl(var(--foreground))",
    },
  },
}

const { data, isLoading, isRefetching, isError, error, refetch } = useDashboard()
const lastChecked = ref<string | null>(null)
const { user } = useAuth()
const hour = new Date().getHours()
const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

watch(data, () => {
  lastChecked.value = new Date().toISOString()
}, { immediate: true })

const stats = computed(() => [
  { title: "Total Users", value: formatNumber(data.value?.total_users ?? 0), icon: Users, href: "/users" },
  { title: "Active Users", value: formatNumber(data.value?.active_users ?? 0), icon: Activity, href: "/users" },
  { title: "Total Orders", value: formatNumber(data.value?.total_orders ?? 0), icon: ShoppingCart, href: "/orders" },
  { title: "Total Products", value: formatNumber(data.value?.total_products ?? 0), icon: Package, href: "/products" },
  { title: "Revenue", value: `$${formatNumber(data.value?.total_revenue ?? 0)}`, icon: DollarSign, href: "/orders" },
])

const chartData = computed(() => {
  if (!data.value?.monthly_revenue?.length) return null
  return {
    labels: data.value.monthly_revenue.map((r: any) => r.month),
    datasets: [
      {
        label: "Revenue",
        data: data.value.monthly_revenue.map((r: any) => r.revenue),
        backgroundColor: "hsl(var(--primary))",
        borderRadius: 4,
      },
    ],
  }
})
</script>

<template>
  <div class="space-y-6">
    <template v-if="isError">
      <PageHeader title="Dashboard" description="Overview of your application">
        <Button variant="outline" size="sm" @click="refetch()" :disabled="isRefetching">
          <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': isRefetching }" />
          Refresh
        </Button>
      </PageHeader>
    </template>
    <template v-else>
      <div class="rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 border">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold tracking-tight">{{ greeting }}, {{ user?.name || "there" }} 👋</h1>
            <p class="text-muted-foreground mt-1">Here's what's happening with your application today.</p>
          </div>
          <Button variant="outline" size="sm" @click="refetch()" :disabled="isRefetching">
            <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': isRefetching }" />
            Refresh
          </Button>
        </div>
      </div>
    </template>

    <div v-if="isLoading">
      <StatsSkeleton />
      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <LoadingSkeleton rows="4" />
        <LoadingSkeleton rows="4" />
      </div>
    </div>

    <div v-else-if="isError">
      <ErrorState @retry="refetch()" />
    </div>

    <template v-else>
      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <NuxtLink
          v-for="stat in stats"
          :key="stat.title"
          :to="stat.href"
          class="relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer group"
        >
          <div class="absolute inset-0 opacity-[0.03] bg-gradient-to-br dark:opacity-[0.08]" :class="gradColors[stat.title]" />
          <div class="p-6 relative">
            <div class="flex items-center justify-between">
              <div :class="['rounded-xl p-3 transition-transform group-hover:scale-110', iconColors[stat.title] || 'bg-muted']">
                <component :is="stat.icon" class="h-5 w-5" />
              </div>
              <div class="h-16 w-16 rounded-full opacity-10 blur-2xl bg-gradient-to-br" :class="gradColors[stat.title]" />
            </div>
            <div class="mt-4">
              <p class="text-sm font-medium text-muted-foreground">{{ stat.title }}</p>
              <p class="text-2xl font-bold tracking-tight mt-1">{{ stat.value }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Recent Activity</span>
              <Button variant="ghost" size="icon" @click="refetch()" :disabled="isRefetching">
                <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isRefetching }" />
              </Button>
            </div>
          </template>
          <div v-if="data?.recent_activity?.length" class="space-y-4">
            <div v-for="activity in data.recent_activity.slice(0, 8)" :key="activity.id" class="flex items-start gap-3">
              <Avatar class="h-8 w-8 shrink-0" :fallback="(activity.user ?? '?').charAt(0).toUpperCase()" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ activity.action }}</p>
                <p class="text-xs text-muted-foreground truncate">{{ activity.description }}</p>
                <p class="text-xs text-muted-foreground mt-1">{{ formatRelativeTime(activity.created_at) }}</p>
              </div>
            </div>
          </div>
          <div v-else>
            <EmptyState title="No recent activity" description="Activity will appear here as users interact with the system." />
          </div>
        </Card>

        <div class="space-y-4">
          <Card>
            <template #header>
              <span class="text-sm font-medium">API Health</span>
            </template>
            <div v-if="data?.api_status" class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Status</span>
                <StatusBadge :status="data.api_status.status ?? 'healthy'" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Version</span>
                <span class="text-sm font-medium">{{ data.api_status.version ?? '—' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Uptime</span>
                <span class="text-sm font-medium">{{ data.api_status.uptime ? Math.round(data.api_status.uptime / 3600) + 'h' : '—' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Response Time</span>
                <span class="text-sm font-medium">{{ data.api_status.response_time ?? '—' }}ms</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Last Checked</span>
                <span class="text-sm font-medium">{{ lastChecked ? formatRelativeTime(lastChecked) : '—' }}</span>
              </div>
            </div>
            <div v-else>
              <p class="text-sm text-muted-foreground py-4 text-center">API status unavailable</p>
            </div>
          </Card>

          <Card>
            <template #header>
              <span class="text-sm font-medium">Quick Actions</span>
            </template>
            <div class="grid gap-2">
              <NuxtLink to="/users/new" class="group">
                <Button class="w-full justify-start">
                  <Plus class="mr-2 h-4 w-4" /> New User
                  <ArrowRight class="ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
              </NuxtLink>
              <NuxtLink to="/orders" class="group">
                <Button variant="secondary" class="w-full justify-start">
                  <Eye class="mr-2 h-4 w-4" /> View Orders
                  <ArrowRight class="ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
              </NuxtLink>
              <NuxtLink to="/products" class="group">
                <Button variant="secondary" class="w-full justify-start">
                  <Package class="mr-2 h-4 w-4" /> Manage Products
                  <ArrowRight class="ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
              </NuxtLink>
              <NuxtLink to="/settings" class="group">
                <Button variant="secondary" class="w-full justify-start">
                  <Settings class="mr-2 h-4 w-4" /> Settings
                  <ArrowRight class="ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
              </NuxtLink>
            </div>
          </Card>
        </div>
      </div>

      <Card v-if="data?.monthly_revenue?.length">
        <template #header>
          <span class="text-sm font-medium">Monthly Revenue</span>
        </template>
        <div class="h-[300px]">
          <Bar
            v-if="chartData"
            :data="chartData"
            :options="chartOptions"
          />
          <p v-else class="text-muted-foreground text-center py-8">No revenue data available</p>
        </div>
      </Card>
    </template>
  </div>
</template>
