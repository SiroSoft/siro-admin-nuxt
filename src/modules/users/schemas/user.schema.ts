import { z } from "zod"
import { tSchema } from "~/utils/schema-i18n"

export const createUserSchema = z
  .object({
    name: z.string().min(2, tSchema("validation.nameMin", { min: 2 })),
    email: z.string().email(tSchema("validation.invalidEmail")),
    password: z.string().min(8, tSchema("validation.passwordMin", { min: 8 })),
    password_confirmation: z.string(),
    role: z.string().min(1, tSchema("validation.roleRequired")),
    status: z.string().min(1, tSchema("validation.statusRequired")),
    avatar: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: tSchema("validation.passwordMismatch"),
    path: ["password_confirmation"],
  })

export const updateUserSchema = z.object({
  name: z.string().min(2, tSchema("validation.nameMin", { min: 2 })),
  email: z.string().email(tSchema("validation.invalidEmail")),
  role: z.string().min(1, tSchema("validation.roleRequired")),
  status: z.string().min(1, tSchema("validation.statusRequired")),
  avatar: z.string().optional(),
  phone: z.string().optional(),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>
