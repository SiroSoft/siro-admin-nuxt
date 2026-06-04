import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { usersService } from "~/services/users.service"
import { useI18n } from "~/composables/useI18n"
import type { PaginationParams } from "~/types/api"
import type { CreateUserRequest, UpdateUserRequest } from "~/types/user"

export function useUsers(params?: Ref<PaginationParams | undefined>) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: computed(() => ["users", params?.value]),
    queryFn: () => usersService.list(params?.value),
  })

  return {
    users: computed(() => query.data.value?.data ?? []),
    meta: computed(() => query.data.value?.meta),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useUser(id: Ref<number | null>) {
  return useQuery({
    queryKey: computed(() => ["users", id.value]),
    queryFn: () => usersService.get(id.value!),
    enabled: computed(() => !!id.value),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      useToast().success(t('toast.userCreated'), t('toast.userCreatedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.userCreateError'))
    },
  })
}

export function useUpdateUser(id: Ref<number>) {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => usersService.update(id.value, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      useToast().success(t('toast.userUpdated'), t('toast.userUpdatedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.userUpdateError'))
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  const { t } = useI18n()

  return useMutation({
    mutationFn: (id: number) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      useToast().success(t('toast.userDeleted'), t('toast.userDeletedDesc'))
    },
    onError: () => {
      useToast().error(t('toast.error'), t('toast.userDeleteError'))
    },
  })
}
