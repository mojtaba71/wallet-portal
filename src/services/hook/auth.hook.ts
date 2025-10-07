import client from "@/services/client.service";
import { useMutation } from "@tanstack/react-query";
import type { ChangePasswordRequest } from "@/models/auth.model";

export function useLogin() {
  const mutation = useMutation({
    mutationFn: (data: { userName: string; password: string }) => client.auth.login(data),
  });

  return {
    mutationLogin: mutation.mutate,
    isLoading: mutation.isPending,
  };
}

export function useLogout() {
  const mutation = useMutation({
    mutationFn: () => client.auth.logout(),
  });

  return {
    mutationLogout: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}

export function useChangePassword() {
  const mutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => client.auth.changePassword(data),
  });

  return {
    mutationChangePassword: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}

export function useRefreshToken() {
  const mutation = useMutation({
    mutationFn: () => client.auth.refreshToken(),
  });

  return {
    mutationRefreshToken: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
}


