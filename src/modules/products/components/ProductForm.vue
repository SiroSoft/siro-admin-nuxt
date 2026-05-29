<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Label from "~/components/ui/Label.vue"
import Switch from "~/components/ui/Switch.vue"
import { createProductSchema, updateProductSchema } from "~/modules/products/schemas/product.schema"
import type { Product } from "~/types/product"

interface Props {
  product?: Product
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: any]
}>()

const isEdit = computed(() => !!props.product)
const schema = computed(() => isEdit.value ? updateProductSchema : createProductSchema)

const { handleSubmit, errors, defineField, setFieldValue, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema.value),
  initialValues: {
    name: props.product?.name ?? "",
    description: props.product?.description ?? "",
    short_description: props.product?.short_description ?? "",
    price: props.product?.price ?? 0,
    compare_price: props.product?.compare_price ?? undefined,
    cost_price: props.product?.cost_price ?? undefined,
    sku: props.product?.sku ?? "",
    barcode: props.product?.barcode ?? "",
    stock: props.product?.stock ?? 0,
    stock_min: props.product?.stock_min ?? undefined,
    weight: props.product?.weight ?? undefined,
    width: props.product?.width ?? undefined,
    height: props.product?.height ?? undefined,
    length: props.product?.length ?? undefined,
    is_active: props.product?.is_active ?? true,
    is_featured: props.product?.is_featured ?? false,
    category_id: props.product?.category_id ?? undefined,
  },
})

const [name, nameAttrs] = defineField("name")
const [description] = defineField("description" as any)
const [short_description] = defineField("short_description" as any)
const [price] = defineField("price" as any)
const [sku] = defineField("sku" as any)
const [stock] = defineField("stock" as any)
const [is_active] = defineField("is_active" as any)
const [is_featured] = defineField("is_featured" as any)
const [category_id] = defineField("category_id" as any)

const onSubmit = handleSubmit((values) => {
  emit("submit", values)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="name">Name</Label>
      <Input id="name" v-model="name" v-bind="nameAttrs" placeholder="Product name" />
      <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label for="price">Price</Label>
        <Input id="price" type="number" step="0.01" v-model="price" />
        <p v-if="errors.price" class="text-sm text-destructive">{{ errors.price }}</p>
      </div>
      <div class="space-y-2">
        <Label for="sku">SKU</Label>
        <Input id="sku" v-model="sku" placeholder="SKU-001" />
        <p v-if="errors.sku" class="text-sm text-destructive">{{ errors.sku }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label for="stock">Stock</Label>
        <Input id="stock" type="number" v-model="stock" />
      </div>
      <div class="space-y-2">
        <Label for="category_id">Category ID</Label>
          <Input id="category_id" type="number" :model-value="category_id" @input="setFieldValue('category_id', Number(($event.target as HTMLInputElement).value) || undefined)" placeholder="Optional" />
      </div>
    </div>

    <div class="space-y-2">
      <Label for="description">Description</Label>
      <textarea
        id="description"
        v-model="description"
        class="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        placeholder="Product description"
      />
    </div>

    <div class="flex items-center gap-6">
      <div class="flex items-center gap-2">
        <Switch :model-value="is_active" @update:model-value="(v: boolean) => setFieldValue('is_active', v)" />
        <Label>Active</Label>
      </div>
      <div class="flex items-center gap-2">
        <Switch :model-value="is_featured" @update:model-value="(v: boolean) => setFieldValue('is_featured', v)" />
        <Label>Featured</Label>
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button type="submit" :disabled="isSubmitting">
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        {{ isEdit ? "Update" : "Create" }} Product
      </Button>
    </div>
  </form>
</template>
