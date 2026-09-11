import { z } from "zod"
import { tSchema } from "~/utils/schema-i18n"

export const createOrderSchema = z.object({
  status: z.string().default("pending"),
  customer_id: z.number().optional(),
  shipping_address: z.string().optional(),
  billing_address: z.string().optional(),
  notes: z.string().optional(),
  payment_method: z.string().optional(),
  items: z.array(
    z.object({
      product_id: z.number({ required_error: tSchema("validation.productRequired") }),
      quantity: z.number().min(1, tSchema("validation.quantityMin", { min: 1 })),
    }),
  ).min(1, tSchema("validation.itemsMin")),
})

export const updateOrderSchema = z.object({
  status: z.string().min(1, tSchema("validation.statusRequired")),
  shipping_address: z.string().optional(),
  billing_address: z.string().optional(),
  notes: z.string().optional(),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
})

export type CreateOrderFormData = z.infer<typeof createOrderSchema>
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>
