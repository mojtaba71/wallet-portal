import { useQuery } from "@tanstack/react-query";
import client from "@/services/client.service";

export const useTodayTransactionSummary = () => {
  const { isPending, data, error, refetch } = useQuery({
    queryKey: ["todayTransactionSummary"],
    queryFn: () => client.dashboard.getTodayTransactionSummary(),
  });

  return { isLoading: isPending, data: data, error, refetch };
};

export const useTotalBalance = () => {
  const { isPending, data, error, refetch } = useQuery({
    queryKey: ["totalBalance"],
    queryFn: () => client.dashboard.getTotalBalance(),
  });

  return { isLoading: isPending, data: data, error, refetch };
};

export const useBusinessBalance = () => {
  const { isPending, data, error, refetch } = useQuery({
    queryKey: ["businessBalance"],
    queryFn: () => client.dashboard.getBusinessBalance(),
  });

  return { isLoading: isPending, data: data, error, refetch };
};

export const useDailyTransactionSummary = () => {
  const { isPending, data, error, refetch } = useQuery({
    queryKey: ["dailyTransactionSummary"],
    queryFn: () => client.dashboard.getDailyTransactionSummary(),
  });

  return { isLoading: isPending, data: data, error, refetch };
};

export const useBusinessSummary = () => {
  const { isPending, data, error, refetch } = useQuery({
    queryKey: ["businessSummary"],
    queryFn: () => client.dashboard.getBusinessSummary(),
  });
  return { isLoading: isPending, data: data, error, refetch };
};
