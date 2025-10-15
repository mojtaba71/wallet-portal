import type { CustomerSearchRequest, CustomerRegistrationRequest } from "@/models/customer.model";
import { useMutation } from "@tanstack/react-query";
import client from "@/services/client.service";

export const useSearchCustomer = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: (input: CustomerSearchRequest) =>
      client.customer.searchCustomer(input),
  });
  return { isLoading: isPending, mutate };
};

export const useRegisterCustomer = () => {
  const { isPending, mutate, data } = useMutation({
    mutationFn: (input: CustomerRegistrationRequest) =>
      client.customer.registerCustomer(input),
  });
  return { isLoading: isPending, mutate, data };
};
