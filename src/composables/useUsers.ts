import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { usersService } from "~/services/users.service"
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

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      useToast().success("User created", "User has been created successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to create user.")
    },
  })
}

export function useUpdateUser(id: Ref<number>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => usersService.update(id.value, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      useToast().success("User updated", "User has been updated successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to update user.")
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      useToast().success("User deleted", "User has been deleted successfully.")
    },
    onError: () => {
      useToast().error("Error", "Failed to delete user.")
    },
  })
}
