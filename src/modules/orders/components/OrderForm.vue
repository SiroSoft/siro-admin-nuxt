<script setup lang="ts">
import { useForm, useFieldArray } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { Loader2, Plus, Trash2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Textarea from "~/components/ui/Textarea.vue"
import Label from "~/components/ui/Label.vue"
import Select from "~/components/ui/Select.vue"
import SearchableSelect from "~/components/ui/SearchableSelect.vue"
import { createOrderSchema, updateOrderSchema } from "~/modules/orders/schemas/order.schema"
import { useProducts } from "~/composables/useProducts"
import { useUsers } from "~/composables/useUsers"
import type { Product } from "~/types/product"
import type { User } from "~/types/user"
import type { Order, CreateOrderRequest, UpdateOrderRequest } from "~/types/order"

interface Props {
  order?: Order
}

const props = defineProps<Props>()

interface OrderFormType {
  status: string
  shipping_address: string
  billing_address: string
  notes: string
  items?: { product_id: number | undefined; quantity: number }[]
  customer_id?: number | undefined
}

const emit = defineEmits<{
  submit: [data: CreateOrderRequest | UpdateOrderRequest]
}>()

const isEdit = computed(() => !!props.order)
const schema = computed(() => isEdit.value ? updateOrderSchema : createOrderSchema)
const { products } = useProducts(ref({ per_page: 200 }))
const { users } = useUsers(ref({ per_page: 200 }))

const productOptions = computed(() =>
  products.value.map((p: Product) => ({
    label: `${p.name} (${p.sku})`,
    value: String(p.id),
  }))
)

const userOptions = computed(() =>
  users.value.map((u: User) => ({
    label: `${u.name} (${u.email})`,
    value: String(u.id),
  }))
)

const { handleSubmit, errors, defineField, setFieldValue, isSubmitting, values } = useForm<OrderFormType>({
  validationSchema: toTypedSchema(schema.value),
  initialValues: isEdit.value
    ? {
        status: props.order?.status ?? "pending",
        shipping_address: props.order?.shipping_address ?? "",
        billing_address: props.order?.billing_address ?? "",
        notes: props.order?.notes ?? "",
      }
    : {
        items: [{ product_id: undefined, quantity: 1 }] as { product_id: number | undefined; quantity: number }[],
        status: "pending",
        customer_id: undefined,
        shipping_address: "",
        billing_address: "",
        notes: "",
      },
})

const [status] = defineField("status")
const [shipping_address] = defineField("shipping_address")
const [billing_address] = defineField("billing_address")
const [notes] = defineField("notes")
const [customer_id] = defineField("customer_id")

const statusOptions = computed(() => [
  { label: t('orders.status_pending'), value: "pending" },
  { label: t('orders.status_confirmed'), value: "confirmed" },
  { label: t('orders.status_processing'), value: "processing" },
  { label: t('orders.status_shipped'), value: "shipped" },
  { label: t('orders.status_delivered'), value: "delivered" },
  { label: t('orders.status_cancelled'), value: "cancelled" },
])

const { t } = useI18n()
const { push: addItem, remove: removeItem, fields: itemFields } = useFieldArray("items")

const onSubmit = handleSubmit((values) => {
  emit("submit", values)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
    <template v-if="isEdit">
      <div class="space-y-2">
        <Label>{{ t('common.status') }}</Label>
        <Select
          :model-value="status"
          @update:model-value="(v: string) => setFieldValue('status', v)"
          :options="statusOptions"
          :disabled="isSubmitting"
        />
        <p v-if="errors.status" class="text-sm text-destructive">{{ errors.status }}</p>
      </div>
      <div class="space-y-2">
        <Label for="shipping_address">{{ t('orders.shippingAddress') }}</Label>
        <Textarea id="shipping_address" v-model="shipping_address" :disabled="isSubmitting" />
      </div>
      <div class="space-y-2">
        <Label for="billing_address">{{ t('orders.billingAddress') }}</Label>
        <Textarea id="billing_address" v-model="billing_address" :disabled="isSubmitting" />
      </div>
      <div class="space-y-2">
        <Label for="notes">{{ t('orders.notes') }}</Label>
        <Textarea id="notes" v-model="notes" :disabled="isSubmitting" />
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <Button type="submit" :disabled="isSubmitting">
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          {{ t('orders.update') }}
        </Button>
      </div>
    </template>

    <template v-else>
      <div class="space-y-3">
        <Label>{{ t('orders.orderItems') }}</Label>
        <div v-for="(field, idx) in itemFields" :key="field.key" class="flex items-end gap-2">
          <div class="flex-1 space-y-1">
            <Label class="text-xs">{{ t('orders.product') }}</Label>
            <SearchableSelect
              :options="productOptions"
              :value="values.items?.[idx]?.product_id ? String(values.items[idx].product_id) : ''"
              @change="(v: string) => setFieldValue(`items.${idx}.product_id`, Number(v))"
              :placeholder="t('common.search') + '...'"
              :disabled="isSubmitting"
            />
          </div>
          <div class="w-24 space-y-1">
            <Label class="text-xs">{{ t('orders.qty') }}</Label>
            <Input
              type="number"
              :model-value="values.items?.[idx]?.quantity"
              @update:model-value="(v: string) => setFieldValue(`items.${idx}.quantity`, Number(v))"
              placeholder="1"
              :disabled="isSubmitting"
            />
          </div>
          <Button type="button" variant="ghost" size="icon" :disabled="isSubmitting" @click="removeItem(idx)">
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
        <Button type="button" variant="outline" size="sm" :disabled="isSubmitting" @click="addItem({ product_id: undefined, quantity: 1 })">
          <Plus class="mr-2 h-4 w-4" />
          {{ t('orders.addItem') }}
        </Button>
        <p v-if="errors.items" class="text-sm text-destructive">{{ errors.items || "Items validation error" }}</p>
      </div>

      <div class="space-y-2">
        <Label>{{ t('common.status') }}</Label>
        <Select
          :model-value="status"
          @update:model-value="(v: string) => setFieldValue('status', v)"
          :options="statusOptions"
          :disabled="isSubmitting"
        />
      </div>

      <div class="space-y-2">
        <Label>{{ t('orders.customer') }}</Label>
        <SearchableSelect
          :options="userOptions"
          :value="customer_id ? String(customer_id) : ''"
          @change="(v: string) => setFieldValue('customer_id', v ? Number(v) : undefined)"
          :placeholder="t('common.search') + '...'"
          :disabled="isSubmitting"
        />
      </div>

      <div class="space-y-2">
        <Label for="shipping_address">{{ t('orders.shippingAddress') }}</Label>
        <Textarea id="shipping_address" v-model="shipping_address" :disabled="isSubmitting" />
      </div>
      <div class="space-y-2">
        <Label for="billing_address">{{ t('orders.billingAddress') }}</Label>
        <Textarea id="billing_address" v-model="billing_address" :disabled="isSubmitting" />
      </div>
      <div class="space-y-2">
        <Label for="notes">{{ t('orders.notes') }}</Label>
        <Textarea id="notes" v-model="notes" :disabled="isSubmitting" />
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <Button type="submit" :disabled="isSubmitting">
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          {{ t('orders.create') }}
        </Button>
      </div>
    </template>
  </form>
</template>
