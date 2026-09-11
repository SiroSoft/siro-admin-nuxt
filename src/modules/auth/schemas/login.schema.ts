import { z } from "zod"
import { tSchema } from "~/utils/schema-i18n"

export const loginSchema = z.object({
  email: z.string().email(tSchema("validation.invalidEmail")),
  password: z.string().min(8, tSchema("validation.passwordMin", { min: 8 })),
})

export type LoginFormData = z.infer<typeof loginSchema>
