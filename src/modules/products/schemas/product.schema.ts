import { z } from "zod"

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.number({ required_error: "Price is required" }).min(0, "Price must be positive"),
  compare_price: z.number().optional(),
  cost_price: z.number().optional(),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  stock: z.number().int().default(0),
  stock_min: z.number().int().optional(),
  weight: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  length: z.number().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  category_id: z.number().optional(),
})

export const updateProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.number().min(0, "Price must be positive").optional(),
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
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  category_id: z.number().optional(),
})

export type CreateProductFormData = z.infer<typeof createProductSchema>
export type UpdateProductFormData = z.infer<typeof updateProductSchema>
