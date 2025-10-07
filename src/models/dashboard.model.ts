import type { MainResponse } from "@/models/general.model";

export interface GetTodayTransactionSummaryResponse extends MainResponse {
  todaySuccessCount: number;
  todaySuccessAmount: number;
  todayFailedCount: number;
  weeklyTotalAmount: number;
}

export interface GetTotalBalanceResponse extends MainResponse {
  balance: number;
}

export interface BusinessSummary {
  businessId: number;
  businessName: string;
  transactionCount: number;
}

export interface GetBusinessSummaryResponse extends MainResponse {
  businessSummaryList: BusinessSummary[];
}

export interface TransactionSummary {
  date: string;
  successCount: number;
  failureCount: number;
}

export interface GetDailyTransactionSummaryResponse extends MainResponse {
  transactionSummaryList: TransactionSummary[];
}

export interface BusinessBalanceItem {
  businessId: number;
  name: string;
  abbreviationName: string;
  balance: number;
  lastStatementId: string | null;
  lastGetStatementTime: string | null;
}
export interface GetBusinessBalanceResponse extends MainResponse {
  businessInfoCount: number;
  businessInfoList: BusinessBalanceItem[];
}
