import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { postsService } from "~/services/posts.service"
import type { PaginationParams } from "~/types/api"
import type { CreatePostRequest, UpdatePostRequest } from "~/types/post"

export function usePosts(params?: Ref<PaginationParams | undefined>) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: computed(() => ["posts", params?.value]),
    queryFn: () => postsService.list(params?.value),
  })

  return {
    posts: computed(() => query.data.value?.data ?? []),
    meta: computed(() => query.data.value?.meta),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function usePost(id: Ref<number | null>) {
  return useQuery({
    queryKey: computed(() => ["posts", id.value]),
    queryFn: () => postsService.get(id.value!),
    enabled: computed(() => !!id.value),
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      useToast().success("Post created", "Post has been created successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to create post.")
    },
  })
}

export function useUpdatePost(id: Ref<number>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdatePostRequest) => postsService.update(id.value, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      useToast().success("Post updated", "Post has been updated successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to update post.")
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => postsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      useToast().success("Post deleted", "Post has been deleted successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to delete post.")
    },
  })
}
