import { z } from "zod"
import { tSchema } from "~/utils/schema-i18n"

export const createProductSchema = z.object({
  name: z.string().min(2, tSchema("validation.nameMin", { min: 2 })),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.number({ required_error: tSchema("validation.priceRequired") }).min(0, tSchema("validation.pricePositive")),
  compare_price: z.number().optional(),
  cost_price: z.number().optional(),
  sku: z.string().min(1, tSchema("validation.skuRequired")),
  barcode: z.string().optional(),
  stock: z.number().int().default(0),
  stock_min: z.number().int().optional(),
  weight: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  length: z.number().optional(),
  cover_image: z.string().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  category_id: z.number().optional(),
})

export const updateProductSchema = z.object({
  name: z.string().min(2, tSchema("validation.nameMin", { min: 2 })).optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.number().min(0, tSchema("validation.pricePositive")).optional(),
  compare_price: z.number().optional(),
  cost_price: z.number().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  stock: z.number().int().optional(),
  stock_min: z.number().int().optional(),
  weight: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  length: z.number().optional(),
  cover_image: z.string().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  category_id: z.number().optional(),
})

export type CreateProductFormData = z.infer<typeof createProductSchema>
export type UpdateProductFormData = z.infer<typeof updateProductSchema>
