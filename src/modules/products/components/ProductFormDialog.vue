<script setup lang="ts">
import Dialog from "~/components/ui/Dialog.vue"
import ProductForm from "~/modules/products/components/ProductForm.vue"
import type { Product } from "~/types/product"

interface Props {
  open?: boolean
  product?: Product
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "update:open": [value: boolean]
  submit: [data: any]
}>()

const title = computed(() => props.product ? "Edit Product" : "Create Product")
const description = computed(() => props.product ? "Update the product details below." : "Fill in the details to create a new product.")
</script>

<template>
  <Dialog
    :open="props.open"
    :title="title"
    :description="description"
    class="sm:max-w-2xl"
    @update:open="emit('update:open', $event)"
  >
    <ProductForm :product="props.product" @submit="emit('submit', $event)" />
  </Dialog>
</template>
