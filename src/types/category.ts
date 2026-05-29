import type { components, PaginationMeta } from "./api"

export type Category = components["schemas"]["Category"]
export type CreateCategoryRequest = components["schemas"]["CreateCategoryRequest"]
export type UpdateCategoryRequest = components["schemas"]["UpdateCategoryRequest"]

export interface CategoriesResponse {
  data: Category[]
  meta: PaginationMeta
}
