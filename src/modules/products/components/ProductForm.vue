<script setup lang="ts">
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { Loader2 } from "lucide-vue-next"
import Button from "~/components/ui/Button.vue"
import Input from "~/components/ui/Input.vue"
import Textarea from "~/components/ui/Textarea.vue"
import Label from "~/components/ui/Label.vue"
import Switch from "~/components/ui/Switch.vue"
import Select from "~/components/ui/Select.vue"
import ImageUpload from "~/components/ui/ImageUpload.vue"
import { createProductSchema, updateProductSchema } from "~/modules/products/schemas/product.schema"
import { useCategories } from "~/composables/useCategories"
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
const { categories } = useCategories(ref({ per_page: 100 }))

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
    cover_image: (props.product as any)?.images?.[0]?.url ?? "",
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
const [stock_min] = defineField("stock_min" as any)
const [weight] = defineField("weight" as any)
const [width] = defineField("width" as any)
const [height] = defineField("height" as any)
const [length] = defineField("length" as any)
const [barcode] = defineField("barcode" as any)
const [compare_price] = defineField("compare_price" as any)
const [cost_price] = defineField("cost_price" as any)
const [is_active] = defineField("is_active" as any)
const [is_featured] = defineField("is_featured" as any)
const [cover_image] = defineField("cover_image" as any)
const [category_id] = defineField("category_id" as any)

const categoryOptions = computed(() =>
  categories.value.map((cat: any) => ({ label: cat.name, value: String(cat.id) }))
)

const onSubmit = handleSubmit((values) => {
  emit("submit", values)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label for="name">Name *</Label>
        <Input id="name" v-model="name" v-bind="nameAttrs" placeholder="Product name" :disabled="isSubmitting" />
        <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
      </div>
      <div class="space-y-2">
        <Label for="sku">SKU *</Label>
        <Input id="sku" v-model="sku" placeholder="PROD-001" :disabled="isSubmitting" />
        <p v-if="errors.sku" class="text-sm text-destructive">{{ errors.sku }}</p>
      </div>
    </div>

    <div class="space-y-2">
      <Label for="description">Description</Label>
      <Textarea id="description" v-model="description" placeholder="Full product description" :disabled="isSubmitting" />
    </div>

    <div class="space-y-2">
      <Label for="short_description">Short Description</Label>
      <Textarea id="short_description" v-model="short_description" placeholder="Brief product summary" :disabled="isSubmitting" />
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="space-y-2">
        <Label for="price">Price *</Label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">$</span>
          <Input id="price" type="number" step="0.01" v-model="price" class="pl-7" :disabled="isSubmitting" />
        </div>
        <p v-if="errors.price" class="text-sm text-destructive">{{ errors.price }}</p>
      </div>
      <div class="space-y-2">
        <Label for="compare_price">Compare Price</Label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">$</span>
          <Input id="compare_price" type="number" step="0.01" v-model="compare_price" class="pl-7" :disabled="isSubmitting" />
        </div>
      </div>
      <div class="space-y-2">
        <Label for="cost_price">Cost Price</Label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">$</span>
          <Input id="cost_price" type="number" step="0.01" v-model="cost_price" class="pl-7" :disabled="isSubmitting" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label for="stock">Stock</Label>
        <Input id="stock" type="number" v-model="stock" :disabled="isSubmitting" />
      </div>
      <div class="space-y-2">
        <Label for="stock_min">Min Stock</Label>
        <Input id="stock_min" type="number" v-model="stock_min" :disabled="isSubmitting" />
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="space-y-2">
        <Label for="weight">Weight</Label>
        <Input id="weight" type="number" step="0.01" v-model="weight" :disabled="isSubmitting" />
      </div>
      <div class="space-y-2">
        <Label for="width">Width</Label>
        <Input id="width" type="number" step="0.01" v-model="width" :disabled="isSubmitting" />
      </div>
      <div class="space-y-2">
        <Label for="height">Height</Label>
        <Input id="height" type="number" step="0.01" v-model="height" :disabled="isSubmitting" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label for="barcode">Barcode</Label>
        <Input id="barcode" v-model="barcode" :disabled="isSubmitting" />
      </div>
      <div class="space-y-2">
        <Label>Category</Label>
        <Select
          :model-value="category_id ? String(category_id) : ''"
          @update:model-value="(v: string) => setFieldValue('category_id', v ? Number(v) : undefined)"
          :options="categoryOptions"
          :disabled="isSubmitting"
        />
      </div>
    </div>

    <div class="space-y-2">
      <Label>Cover Image</Label>
      <ImageUpload :value="cover_image" @change="(v: string) => setFieldValue('cover_image', v)" :disabled="isSubmitting" />
    </div>

    <div class="flex items-center gap-6">
      <div class="flex items-center gap-2">
        <Switch :model-value="is_active" @update:model-value="(v: boolean) => setFieldValue('is_active', v)" :disabled="isSubmitting" />
        <Label>Active</Label>
      </div>
      <div class="flex items-center gap-2">
        <Switch :model-value="is_featured" @update:model-value="(v: boolean) => setFieldValue('is_featured', v)" :disabled="isSubmitting" />
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
