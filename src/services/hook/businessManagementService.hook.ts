import { useMutation } from "@tanstack/react-query";
import client from "@/services/client.service";
import type {
  ChangeStatusBusinessRequest,
  GetBusinessInfoRequest,
  RegisterBusinessDepositRequest,
  RegisterBusinessRequest,
  ResetBusinessMasterKeyRequest,
  ResetBusinessServiceTemplateRequest,
} from "@/models/businessManagement.model";

export const useBusinessInfo = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: (input: GetBusinessInfoRequest) =>
      client.businessManagement.getBusinessInfo(input),
  });
  return { isLoading: isPending, mutate };
};

export const useBusinessDepositInfo = () => {
  const { isPending, mutate, data } = useMutation({
    mutationFn: (input: GetBusinessInfoRequest) =>
      client.businessManagement.getBusinessDepositInfo(input),
  });
  return { isLoading: isPending, mutate, data };
};

export const useRegisterBusinessInfo = () => {
  const { isPending, mutate, data } = useMutation({
    mutationFn: (input: RegisterBusinessRequest) =>
      client.businessManagement.registerBusinessInfo(input),
  });
  return { isLoading: isPending, mutate, data };
};

export const useModifyBusinessInfo = () => {
  const { isPending, mutate, data } = useMutation({
    mutationFn: (input: RegisterBusinessRequest) =>
      client.businessManagement.modifyBusinessInfo(input),
  });
  return { isLoading: isPending, mutate, data };
};

export const useRegisterBusinessDeposit = () => {
  const { isPending, mutate, data } = useMutation({
    mutationFn: (input: RegisterBusinessDepositRequest) =>
      client.businessManagement.registerBusinessDeposit(input),
  });
  return { isLoading: isPending, mutate, data };
};

export const useModifyBusinessDeposit = () => {
  const { isPending, mutate, data } = useMutation({
    mutationFn: (input: RegisterBusinessDepositRequest) =>
      client.businessManagement.modifyBusinessDeposit(input),
  });
  return { isLoading: isPending, mutate, data };
};

export const useChangeStatusBusiness = () => {
  const { isPending, mutate, data } = useMutation({
    mutationFn: (input: ChangeStatusBusinessRequest) =>
      client.businessManagement.changeBusinessStatus(input),
  });
  return { isLoading: isPending, mutate, data };
};

export const useLoadBusiness = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: (input: { businessId: string }) =>
      client.businessManagement.loadBusiness(input),
  });
  return { isLoading: isPending, mutate };
};

export const useResetBusinessMasterKey = () => {
  const { isPending, mutate, data } = useMutation({
    mutationFn: (input: ResetBusinessMasterKeyRequest) =>
      client.businessManagement.resetBusinessMasterKey(input),
  });
  return { isLoading: isPending, mutate, data };
};

export const useResetBusinessServiceTemplate = () => {
  const { isPending, mutate, data } = useMutation({
    mutationFn: (input: ResetBusinessServiceTemplateRequest) =>
      client.businessManagement.resetBusinessServiceTemplate(input),
  });
  return { isLoading: isPending, mutate, data };
};
