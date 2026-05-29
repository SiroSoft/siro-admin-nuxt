<script setup lang="ts">
import Dialog from "~/components/ui/Dialog.vue"
import OrderForm from "~/modules/orders/components/OrderForm.vue"
import type { Order } from "~/types/order"

interface Props {
  open?: boolean
  order?: Order
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "update:open": [value: boolean]
  submit: [data: any]
}>()

const title = computed(() => props.order ? "Edit Order" : "Create Order")
const description = computed(() => props.order ? "Update the order details below." : "Fill in the details to create a new order.")
</script>

<template>
  <Dialog
    :open="props.open"
    :title="title"
    :description="description"
    @update:open="emit('update:open', $event)"
  >
    <OrderForm :order="props.order" @submit="emit('submit', $event)" />
  </Dialog>
</template>
