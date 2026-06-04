import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { profileService } from "~/services/profile.service"
import { useToast } from "~/composables/useToast"
import type { UpdateProfileRequest, ChangePasswordRequest } from "~/types/api"

export function useProfile() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.get(),
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      useToast().success("Profile updated", "Your profile has been updated.")
    },
    onError: () => {
      useToast().error("Error", "Failed to update profile.")
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileService.changePassword(data),
    onSuccess: () => {
      useToast().success("Password changed", "Your password has been changed.")
    },
    onError: () => {
      useToast().error("Error", "Failed to change password.")
    },
  })

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    update: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
  }
}
