import type { components, PaginationMeta } from "./api"

export type Order = components["schemas"]["Order"]
export type OrderItem = components["schemas"]["OrderItem"]
export type CreateOrderRequest = components["schemas"]["CreateOrderRequest"]
export type UpdateOrderRequest = components["schemas"]["UpdateOrderRequest"]

export interface OrdersResponse {
  data: Order[]
  meta: PaginationMeta
}
