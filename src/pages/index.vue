<script setup lang="ts">
definePageMeta({ middleware: "auth" })

import { Users, ShoppingCart, Package, DollarSign, Activity, RefreshCw, ExternalLink } from "lucide-vue-next"
import Card from "~/components/ui/Card.vue"
import PageHeader from "~/components/layout/PageHeader.vue"
import StatsSkeleton from "~/components/states/StatsSkeleton.vue"
import LoadingSkeleton from "~/components/states/LoadingSkeleton.vue"
import ErrorState from "~/components/states/ErrorState.vue"
import EmptyState from "~/components/states/EmptyState.vue"
import StatusBadge from "~/components/layout/StatusBadge.vue"
import Button from "~/components/ui/Button.vue"
import { useDashboard } from "~/composables/useDashboard"
import { formatDate, formatNumber } from "~/utils"

const { data, isLoading, isError, error, refetch } = useDashboard()

const stats = computed(() => [
  { title: "Total Users", value: formatNumber(data.value?.total_users ?? 0), icon: Users, href: "/users" },
  { title: "Active Users", value: formatNumber(data.value?.active_users ?? 0), icon: Activity, href: "/users" },
  { title: "Total Orders", value: formatNumber(data.value?.total_orders ?? 0), icon: ShoppingCart, href: "/orders" },
  { title: "Total Products", value: formatNumber(data.value?.total_products ?? 0), icon: Package, href: "/products" },
  { title: "Revenue", value: `$${formatNumber(data.value?.total_revenue ?? 0)}`, icon: DollarSign, href: "/orders" },
])
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="Dashboard" description="Overview of your application" />

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
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <NuxtLink
          v-for="stat in stats"
          :key="stat.title"
          :to="stat.href"
          class="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex flex-row items-center justify-between pb-2">
            <span class="text-sm font-medium text-muted-foreground">{{ stat.title }}</span>
            <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
          </div>
          <div class="text-2xl font-bold">{{ stat.value }}</div>
        </NuxtLink>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Recent Activity</span>
              <Button variant="ghost" size="icon" @click="refetch()">
                <RefreshCw class="h-4 w-4" />
              </Button>
            </div>
          </template>
          <div v-if="data?.recent_activity?.length" class="space-y-4">
            <div v-for="activity in data.recent_activity.slice(0, 10)" :key="activity.id" class="flex items-start gap-3">
              <div class="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ activity.action }}</p>
                <p class="text-xs text-muted-foreground truncate">{{ activity.description }}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-xs text-muted-foreground">{{ activity.user }}</span>
                  <span class="text-xs text-muted-foreground">·</span>
                  <span class="text-xs text-muted-foreground">{{ formatDate(activity.created_at) }}</span>
                </div>
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
            </div>
            <div v-else>
              <p class="text-sm text-muted-foreground py-4 text-center">API status unavailable</p>
            </div>
          </Card>

          <Card>
            <template #header>
              <span class="text-sm font-medium">Quick Actions</span>
            </template>
            <div class="grid grid-cols-2 gap-2">
              <NuxtLink to="/users" class="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-accent transition-colors">
                <Users class="h-4 w-4" />
                <span>Users</span>
                <ExternalLink class="h-3 w-3 ml-auto text-muted-foreground" />
              </NuxtLink>
              <NuxtLink to="/orders" class="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-accent transition-colors">
                <ShoppingCart class="h-4 w-4" />
                <span>Orders</span>
                <ExternalLink class="h-3 w-3 ml-auto text-muted-foreground" />
              </NuxtLink>
              <NuxtLink to="/products" class="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-accent transition-colors">
                <Package class="h-4 w-4" />
                <span>Products</span>
                <ExternalLink class="h-3 w-3 ml-auto text-muted-foreground" />
              </NuxtLink>
              <NuxtLink to="/posts" class="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-accent transition-colors">
                <Activity class="h-4 w-4" />
                <span>Posts</span>
                <ExternalLink class="h-3 w-3 ml-auto text-muted-foreground" />
              </NuxtLink>
            </div>
          </Card>
        </div>
      </div>

      <div v-if="data?.orders_by_status" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="(count, status) in data.orders_by_status" :key="status">
          <template #header>
            <span class="text-sm font-medium capitalize">{{ status }} Orders</span>
          </template>
          <div class="text-2xl font-bold">{{ formatNumber(count) }}</div>
        </Card>
      </div>
    </template>
  </div>
</template>
