import type { 
  GetTransactionCardRequest,
  GetCardEventsRequest,
  GetBusinessDepositStatementsRequest,
  GetSettlementReportRequest
} from "@/models/reports.model";
import { useMutation } from "@tanstack/react-query";
import client from "@/services/client.service";

export const useTransactionCard = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: (input: GetTransactionCardRequest) =>
      client.reports.getTransactionCard(input),
  });
  return { isLoading: isPending, mutate };
};

export const useSettlementReport = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: (input: GetSettlementReportRequest) =>
      client.reports.getSettlementReport(input),
  });
  return { isLoading: isPending, mutate };
};

export const useCardEvents = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: (input: GetCardEventsRequest) =>
      client.reports.getCardEvents(input),
  });
  return { isLoading: isPending, mutate };
};

export const useBusinessDepositStatements = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: (input: GetBusinessDepositStatementsRequest) =>
      client.reports.getBusinessDepositStatements(input),
  });
  return { isLoading: isPending, mutate };
};
