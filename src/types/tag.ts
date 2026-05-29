import type { components, PaginationMeta } from "./api"

export type Tag = components["schemas"]["Tag"]
export type CreateTagRequest = components["schemas"]["CreateTagRequest"]
export type UpdateTagRequest = components["schemas"]["UpdateTagRequest"]

export interface TagsResponse {
  data: Tag[]
  meta: PaginationMeta
}
