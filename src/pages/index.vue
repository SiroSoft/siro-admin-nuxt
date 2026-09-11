<script setup lang="ts">
definePageMeta({ middleware: "auth", ssr: false })

import { Users, ShoppingCart, Package, DollarSign, Activity, RefreshCw, ArrowRight, Eye, Settings, Database } from "lucide-vue-next"
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
import { formatCurrency, formatDate, formatNumber, formatRelativeTime, cn } from "~/utils"
import Avatar from "~/components/ui/Avatar.vue"

const statColors = [
  { icon: "bg-gradient-to-br from-blue-500/10 to-blue-600/20 text-blue-600 dark:from-blue-500/20 dark:to-blue-600/30 dark:text-blue-400 ring-1 ring-blue-500/20", grad: "from-blue-600 to-blue-400" },
  { icon: "bg-gradient-to-br from-cyan-500/10 to-cyan-600/20 text-cyan-600 dark:from-cyan-500/20 dark:to-cyan-600/30 dark:text-cyan-400 ring-1 ring-cyan-500/20", grad: "from-cyan-600 to-cyan-400" },
  { icon: "bg-gradient-to-br from-orange-500/10 to-orange-600/20 text-orange-600 dark:from-orange-500/20 dark:to-orange-600/30 dark:text-orange-400 ring-1 ring-orange-500/20", grad: "from-orange-600 to-orange-400" },
  { icon: "bg-gradient-to-br from-purple-500/10 to-purple-600/20 text-purple-600 dark:from-purple-500/20 dark:to-purple-600/30 dark:text-purple-400 ring-1 ring-purple-500/20", grad: "from-purple-600 to-purple-400" },
  { icon: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 text-emerald-600 dark:from-emerald-500/20 dark:to-emerald-600/30 dark:text-emerald-400 ring-1 ring-emerald-500/20", grad: "from-emerald-600 to-emerald-400" },
]

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
const { t } = useI18n()
const { user } = useAuth()
const hour = new Date().getHours()
const greeting = hour < 12 ? t("dashboard.goodMorning") : hour < 18 ? t("dashboard.goodAfternoon") : t("dashboard.goodEvening")

watch(data, () => {
  lastChecked.value = new Date().toISOString()
}, { immediate: true })

const stats = computed(() => [
  { key: 'totalUsers', title: t('dashboard.totalUsers'), value: formatNumber(data.value?.total_users ?? 0), icon: Users, href: "/users" },
  { key: 'activeUsers', title: t('dashboard.activeUsers'), value: formatNumber(data.value?.active_users ?? 0), icon: Activity, href: "/users" },
  { key: 'totalOrders', title: t('dashboard.totalOrders'), value: formatNumber(data.value?.total_orders ?? 0), icon: ShoppingCart, href: "/orders" },
  { key: 'totalProducts', title: t('dashboard.totalProducts'), value: formatNumber(data.value?.total_products ?? 0), icon: Package, href: "/products" },
  { key: 'revenue', title: t('dashboard.totalRevenue'), value: formatCurrency(data.value?.total_revenue ?? 0), icon: DollarSign, href: "/orders" },
])

const chartData = computed(() => {
  if (!data.value?.monthly_revenue?.length) return null
  return {
    labels: data.value.monthly_revenue.map((r: { month?: string; revenue?: number }) => r.month ?? ""),
    datasets: [
      {
        label: t('dashboard.totalRevenue'),
        data: data.value.monthly_revenue.map((r: { month?: string; revenue?: number }) => r.revenue ?? 0),
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
      <PageHeader :title="t('dashboard.title')" description="Overview of your application">
        <Button variant="outline" size="sm" @click="refetch()" :disabled="isRefetching">
          <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': isRefetching }" />
          {{ t('common.refresh') }}
        </Button>
      </PageHeader>
    </template>
    <template v-else>
      <div class="rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 border">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold tracking-tight">{{ greeting }}, {{ user?.name || "there" }} 👋</h1>
            <p class="text-muted-foreground mt-1">{{ t('dashboard.appOverview') }}</p>
          </div>
          <Button variant="outline" size="sm" @click="refetch()" :disabled="isRefetching">
            <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': isRefetching }" />
            {{ t('common.refresh') }}
          </Button>
        </div>
      </div>
    </template>

    <div v-if="isLoading">
      <StatsSkeleton />
      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <LoadingSkeleton :rows="4" />
        <LoadingSkeleton :rows="4" />
      </div>
    </div>

    <div v-else-if="isError">
      <ErrorState @retry="refetch()" />
    </div>

    <template v-else>
      <div v-if="(data?.total_users ?? 0) + (data?.total_products ?? 0) + (data?.total_orders ?? 0) === 0" class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3 mb-4">
        <Database class="h-5 w-5 mt-0.5 text-amber-500 shrink-0" />
        <div>
          <p class="font-medium">{{ t('dashboard.emptyDbTitle') }}</p>
          <p class="text-sm text-muted-foreground mt-1">
            {{ t('dashboard.emptyDbDesc') }} <code class="px-1 rounded bg-muted">php siro db:seed</code>
          </p>
        </div>
      </div>
      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <NuxtLink
          v-for="(stat, idx) in stats"
          :key="stat.key"
          :to="stat.href"
          class="relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer group"
        >
          <div class="absolute inset-0 opacity-[0.03] bg-gradient-to-br dark:opacity-[0.08]" :class="statColors[idx].grad" />
          <div class="p-6 relative">
            <div class="flex items-center justify-between">
              <div :class="['rounded-xl p-3 transition-transform group-hover:scale-110', statColors[idx].icon]">
                <component :is="stat.icon" class="h-5 w-5" />
              </div>
              <div class="h-16 w-16 rounded-full opacity-10 blur-2xl bg-gradient-to-br" :class="statColors[idx].grad" />
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
              <span class="text-sm font-medium">{{ t('dashboard.recentActivity') }}</span>
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
            <EmptyState :title="t('dashboard.noRecentActivity')" :description="t('dashboard.activityDescription')" />
          </div>
        </Card>

        <div class="space-y-4">
          <Card>
            <template #header>
              <span class="text-sm font-medium">{{ t('dashboard.apiHealth') }}</span>
            </template>
            <div v-if="data?.api_status" class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">{{ t('common.status') }}</span>
                <StatusBadge :status="data.api_status.status ?? 'healthy'" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">{{ t('dashboard.version') }}</span>
                <span class="text-sm font-medium">{{ data.api_status.version ?? '—' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">{{ t('dashboard.uptime') }}</span>
                <span class="text-sm font-medium">{{ data.api_status.uptime ? Math.round(data.api_status.uptime / 3600) + 'h' : '—' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">{{ t('dashboard.responseTime') }}</span>
                <span class="text-sm font-medium">{{ data.api_status.response_time ?? '—' }}ms</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">{{ t('dashboard.lastChecked') }}</span>
                <span class="text-sm font-medium">{{ lastChecked ? formatRelativeTime(lastChecked) : '—' }}</span>
              </div>
            </div>
            <div v-else>
              <p class="text-sm text-muted-foreground py-4 text-center">{{ t('dashboard.apiStatusUnavailable') }}</p>
            </div>
          </Card>

          <Card>
            <template #header>
              <span class="text-sm font-medium">{{ t('dashboard.ordersByStatus') }}</span>
            </template>
            <div v-if="data?.orders_by_status && Object.keys(data.orders_by_status).length" class="space-y-3">
              <div v-for="(count, status) in data.orders_by_status" :key="status" class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground capitalize">{{ status }}</span>
                <span class="text-sm font-medium">{{ formatNumber(count ?? 0) }}</span>
              </div>
            </div>
            <div v-else>
              <p class="text-sm text-muted-foreground py-4 text-center">{{ t('common.noData') }}</p>
            </div>
          </Card>

          <Card>
            <template #header>
              <span class="text-sm font-medium">{{ t('dashboard.quickActions') }}</span>
            </template>
            <div class="grid gap-2">
              <NuxtLink to="/users/new" class="group">
                <Button class="w-full justify-start">
                  <Plus class="mr-2 h-4 w-4" /> {{ t('dashboard.newUser') }}
                  <ArrowRight class="ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
              </NuxtLink>
              <NuxtLink to="/orders" class="group">
                <Button variant="secondary" class="w-full justify-start">
                  <Eye class="mr-2 h-4 w-4" /> {{ t('dashboard.viewOrders') }}
                  <ArrowRight class="ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
              </NuxtLink>
              <NuxtLink to="/products" class="group">
                <Button variant="secondary" class="w-full justify-start">
                  <Package class="mr-2 h-4 w-4" /> {{ t('dashboard.manageProducts') }}
                  <ArrowRight class="ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
              </NuxtLink>
              <NuxtLink to="/settings" class="group">
                <Button variant="secondary" class="w-full justify-start">
                  <Settings class="mr-2 h-4 w-4" /> {{ t('common.settings') }}
                  <ArrowRight class="ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
              </NuxtLink>
            </div>
          </Card>
        </div>
      </div>

      <Card v-if="data?.monthly_revenue?.length">
        <template #header>
          <span class="text-sm font-medium">{{ t('dashboard.monthlyRevenue') }}</span>
        </template>
        <div class="h-[300px]">
          <ClientOnly>
            <RevenueChart :chart-data="chartData" :chart-options="chartOptions" />
            <template #fallback>
              <div class="h-full flex items-center justify-center">
                <LoadingSkeleton :rows="5" />
              </div>
            </template>
          </ClientOnly>
        </div>
      </Card>
    </template>
  </div>
</template>
