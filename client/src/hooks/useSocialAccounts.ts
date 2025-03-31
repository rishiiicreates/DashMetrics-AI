import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/AuthContext";
import { SocialAccount } from "@shared/schema";

interface ConnectAccountPayload {
  platform: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: string;
  handle?: string;
  displayName?: string;
  profileUrl?: string;
  avatarUrl?: string;
}

export function useSocialAccounts() {
  const { user } = useAuth();
  
  return useQuery<{ accounts: SocialAccount[] }>({
    queryKey: ['/api/accounts'],
    enabled: !!user,
  });
}

export function useConnectSocialAccount() {
  return useMutation({
    mutationFn: async (payload: ConnectAccountPayload) => {
      const response = await apiRequest("POST", "/api/accounts/connect", payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
    },
  });
}

export function useDisconnectSocialAccount() {
  return useMutation({
    mutationFn: async (accountId: number) => {
      await apiRequest("POST", `/api/accounts/${accountId}/disconnect`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
    },
  });
}

export function useSyncSocialAccount() {
  return useMutation({
    mutationFn: async (accountId: number) => {
      const response = await apiRequest("POST", `/api/accounts/${accountId}/sync`);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate various queries that might be affected by the sync
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
    },
  });
}

export function useAccountStatistics(accountId: number) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: [`/api/accounts/${accountId}/statistics`],
    enabled: !!user && accountId > 0,
  });
}
