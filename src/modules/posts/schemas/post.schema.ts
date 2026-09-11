import { z } from "zod"
import { tSchema } from "~/utils/schema-i18n"

export const createPostSchema = z.object({
  title: z.string().min(2, tSchema("validation.titleMin", { min: 2 })),
  content: z.string().min(1, tSchema("validation.contentRequired")),
  excerpt: z.string().optional(),
  cover_image: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  category_id: z.number().optional(),
  tag_ids: z.array(z.number()).optional(),
})

export const updatePostSchema = z.object({
  title: z.string().min(2, tSchema("validation.titleMin", { min: 2 })).optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  cover_image: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.boolean().optional(),
  category_id: z.number().optional(),
  tag_ids: z.array(z.number()).optional(),
})

export type CreatePostFormData = z.infer<typeof createPostSchema>
export type UpdatePostFormData = z.infer<typeof updatePostSchema>
