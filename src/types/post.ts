import type { components, PaginationMeta } from "./api"

export type Post = components["schemas"]["Post"]
export type CreatePostRequest = components["schemas"]["CreatePostRequest"]
export type UpdatePostRequest = components["schemas"]["UpdatePostRequest"]

export interface PostsResponse {
  data: Post[]
  meta: PaginationMeta
}
