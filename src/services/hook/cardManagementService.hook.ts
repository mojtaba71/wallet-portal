import type {
  ChangeStatusCardRequest,
  GetCardDetailsRequest,
  GetSearchCardListRequest,
} from "@/models/cardManagement.model";
import client from "@/services/client.service";
import { useMutation } from "@tanstack/react-query";

export const useCardList = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: (input: GetSearchCardListRequest) =>
      client.cardManagement.getCardList(input),
  });
  return { isLoading: isPending, mutate };
};

export const useCardDetails = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: (input: GetCardDetailsRequest) =>
      client.cardManagement.getCardDetails(input),
  });
  return { isLoading: isPending, mutate };
};

export const useChangeStatusCard = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: (input: ChangeStatusCardRequest) =>
      client.cardManagement.changeStatusCard(input),
  });
  return { isLoading: isPending, mutate };
};
