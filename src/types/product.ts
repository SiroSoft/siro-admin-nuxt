import type { components, PaginationMeta } from "./api"

export type Product = components["schemas"]["Product"]
export type ProductImage = components["schemas"]["ProductImage"]
export type CreateProductRequest = components["schemas"]["CreateProductRequest"]
export type UpdateProductRequest = components["schemas"]["UpdateProductRequest"]

export interface ProductsResponse {
  data: Product[]
  meta: PaginationMeta
}
