import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { tagsService } from "~/services/tags.service"
import { useI18n } from "~/composables/useI18n"
import type { PaginationParams } from "~/types/api"
import type { CreateTagRequest, UpdateTagRequest } from "~/types/tag"

export function useTags(params?: Ref<PaginationParams | undefined>) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: computed(() => ["tags", params?.value]),
    queryFn: () => tagsService.list(params?.value),
  })

  return {
    tags: computed(() => query.data.value?.data ?? []),
    meta: computed(() => query.data.value?.meta),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useTag(id: Ref<number | null>) {
  return useQuery({
    queryKey: computed(() => ["tags", id.value]),
    queryFn: () => tagsService.get(id.value!),
    enabled: computed(() => !!id.value),
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (data: CreateTagRequest) => tagsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      useToast().success(t('toast.tagCreated'), t('toast.tagCreatedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.tagCreateError'))
    },
  })
}

export function useUpdateTag(id: Ref<number>) {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (data: UpdateTagRequest) => tagsService.update(id.value, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      useToast().success(t('toast.tagUpdated'), t('toast.tagUpdatedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.tagUpdateError'))
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (id: number) => tagsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      useToast().success(t('toast.tagDeleted'), t('toast.tagDeletedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.tagDeleteError'))
    },
  })
}
