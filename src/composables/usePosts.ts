import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { postsService } from "~/services/posts.service"
import { useI18n } from "~/composables/useI18n"
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
  const { t } = useI18n()

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      useToast().success(t('toast.postCreated'), t('toast.postCreatedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.postCreateError'))
    },
  })
}

export function useUpdatePost(id: Ref<number>) {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (data: UpdatePostRequest) => postsService.update(id.value, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      useToast().success(t('toast.postUpdated'), t('toast.postUpdatedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.postUpdateError'))
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (id: number) => postsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      useToast().success(t('toast.postDeleted'), t('toast.postDeletedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.postDeleteError'))
    },
  })
}
