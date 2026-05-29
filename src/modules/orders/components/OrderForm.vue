<script setup lang="ts">
import { useForm, useFieldArray } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { Loader2, Plus, Trash2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Select from "~/components/ui/Select.vue"
import { createOrderSchema, updateOrderSchema } from "~/modules/orders/schemas/order.schema"
import type { Order } from "~/types/order"

interface Props {
  order?: Order
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: any]
}>()

const isEdit = computed(() => !!props.order)
const schema = computed(() => isEdit.value ? updateOrderSchema : createOrderSchema)

const { handleSubmit, errors, defineField, setFieldValue, isSubmitting, values, resetForm } = useForm({
  validationSchema: toTypedSchema(schema.value),
  initialValues: {
    status: props.order?.status ?? "pending",
    shipping_address: props.order?.shipping_address ?? "",
    billing_address: props.order?.billing_address ?? "",
    notes: props.order?.notes ?? "",
    payment_method: props.order?.payment_method ?? "credit_card",
    items: props.order?.items?.map(i => ({ product_id: i.product_id, quantity: i.quantity })) ?? [{ product_id: undefined as any, quantity: 1 }],
  },
})

const [status] = defineField("status" as any)
const [shipping_address, shippingAttrs] = defineField("shipping_address" as any)
const [billing_address, billingAttrs] = defineField("billing_address" as any)
const [notes, notesAttrs] = defineField("notes" as any)
const [payment_method] = defineField("payment_method" as any)

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
]

const paymentOptions = [
  { label: "Credit Card", value: "credit_card" },
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "Cash", value: "cash" },
  { label: "PayPal", value: "paypal" },
]

const { push: addItem, remove: removeItem, fields: itemFields } = useFieldArray("items")

const onSubmit = handleSubmit((values) => {
  emit("submit", values)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <template v-if="isEdit">
      <div class="space-y-2">
        <Label>Status</Label>
        <Select
          :model-value="status"
          @update:model-value="(v: string) => setFieldValue('status', v)"
          :options="statusOptions"
        />
        <p v-if="errors.status" class="text-sm text-destructive">{{ errors.status }}</p>
      </div>
    </template>

    <template v-if="!isEdit">
      <div class="space-y-2">
        <Label>Order Items</Label>
        <div v-for="(field, idx) in itemFields" :key="field.key" class="flex items-end gap-2">
          <div class="flex-1 space-y-1">
            <Label>Product ID</Label>
            <Input
              type="number"
              :model-value="values.items?.[idx]?.product_id"
              @input="setFieldValue(`items.${idx}.product_id`, Number(($event.target as HTMLInputElement).value))"
              placeholder="Product ID"
            />
          </div>
          <div class="w-24 space-y-1">
            <Label>Qty</Label>
            <Input
              type="number"
              :model-value="values.items?.[idx]?.quantity"
              @input="setFieldValue(`items.${idx}.quantity`, Number(($event.target as HTMLInputElement).value))"
              min="1"
            />
          </div>
          <Button type="button" variant="ghost" size="icon" @click="removeItem(idx)">
            <Trash2 class="h-4 w-4 text-destructive" />
          </Button>
        </div>
        <Button type="button" variant="outline" size="sm" @click="addItem({ product_id: undefined, quantity: 1 })">
          <Plus class="mr-1 h-3 w-3" /> Add Item
        </Button>
        <p v-if="errors.items" class="text-sm text-destructive">{{ errors.items }}</p>
      </div>

      <div class="space-y-2">
        <Label>Payment Method</Label>
        <Select
          :model-value="payment_method"
          @update:model-value="(v: string) => setFieldValue('payment_method', v)"
          :options="paymentOptions"
        />
      </div>
    </template>

    <div class="space-y-2">
      <Label for="shipping_address">Shipping Address</Label>
      <Input id="shipping_address" v-model="shipping_address" v-bind="shippingAttrs" placeholder="123 Main St" />
    </div>

    <div class="space-y-2">
      <Label for="billing_address">Billing Address</Label>
      <Input id="billing_address" v-model="billing_address" v-bind="billingAttrs" placeholder="123 Main St" />
    </div>

    <div class="space-y-2">
      <Label for="notes">Notes</Label>
      <Input id="notes" v-model="notes" v-bind="notesAttrs" placeholder="Optional notes" />
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button type="submit" :disabled="isSubmitting">
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        {{ isEdit ? "Update" : "Create" }} Order
      </Button>
    </div>
  </form>
</template>
