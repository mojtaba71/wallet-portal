import type { CustomerSearchRequest } from "@/models/customer.model";
import { useMutation } from "@tanstack/react-query";
import client from "@/services/client.service";

export const useSearchCustomer = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: (input: CustomerSearchRequest) =>
      client.customer.searchCustomer(input),
  });
  return { isLoading: isPending, mutate };
};
