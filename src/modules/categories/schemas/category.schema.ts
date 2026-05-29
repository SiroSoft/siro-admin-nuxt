import { z } from "zod"

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  parent_id: z.number().optional(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().default(true),
})

export const updateCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  parent_id: z.number().optional(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
})

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>
