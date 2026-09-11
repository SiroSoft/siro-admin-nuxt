<script setup lang="ts">
import { Bar } from "vue-chartjs"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend)

const { t } = useI18n()

defineProps<{
  chartData: {
    labels: string[]
    datasets: { label: string; data: number[]; backgroundColor: string; borderRadius: number }[]
  } | null
  chartOptions: Record<string, unknown>
}>()
</script>

<template>
  <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  <p v-else class="text-muted-foreground text-center py-8">{{ t('dashboard.noRevenueData') }}</p>
</template>
