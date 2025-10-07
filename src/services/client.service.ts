import type {
  LoginRequest,
  ChangePasswordRequest,
  RefreshTokenResponse,
  LoginResponse,
} from "@/models/auth.model";
import type {
  ChangeStatusBusinessRequest,
  GetBusinessDepositInfoRequest,
  GetBusinessDepositInfoResponse,
  GetBusinessInfoRequest,
  GetBusinessManagementListResponse,
  RegisterBusinessDepositRequest,
  RegisterBusinessRequest,
  RegisterBusinessResponse,
  ResetBusinessMasterKeyRequest,
  ResetBusinessMasterKeyResponse,
  ResetBusinessServiceTemplateRequest,
  ResetBusinessServiceTemplateResponse,
} from "@/models/businessManagement.model";
import type {
  CardDetailsResponse,
  ChangeStatusCardRequest,
  GetCardDetailsRequest,
  GetSearchCardListRequest,
  GetSearchCardListResponse,
} from "@/models/cardManagement.model";
import type { MainResponse } from "@/models/general.model";
import { API_ENDPOINTS } from "./api-endpoints";
import { HttpClient } from "./http-client";
import type {
  GetBusinessBalanceResponse,
  GetBusinessSummaryResponse,
  GetDailyTransactionSummaryResponse,
  GetTodayTransactionSummaryResponse,
  GetTotalBalanceResponse,
} from "@/models/dashboard.model";
import type {
  GetTransactionCardRequest,
  GetTransactionCardResponse,
  GetCardEventsRequest,
  GetCardEventsResponse,
  GetBusinessDepositStatementsRequest,
  GetBusinessDepositStatementsResponse,
} from "@/models/reports.model";

class Client {
  auth = {
    login: (input: LoginRequest) =>
      HttpClient.post<LoginResponse>(API_ENDPOINTS.LOGIN, input),
    logout: () => HttpClient.post<MainResponse>(API_ENDPOINTS.LOGOUT, {}),
    changePassword: (input: ChangePasswordRequest) =>
      HttpClient.post<MainResponse>(API_ENDPOINTS.CHANGE_PASSWORD, input),
    refreshToken: () =>
      HttpClient.post<RefreshTokenResponse>(API_ENDPOINTS.REFRESH_TOKEN, {}),
  };
  dashboard = {
    getTodayTransactionSummary: () =>
      HttpClient.get<GetTodayTransactionSummaryResponse>(
        API_ENDPOINTS.GET_TODAY_TRANSACTION_SUMMARY
      ),
    getTotalBalance: () =>
      HttpClient.get<GetTotalBalanceResponse>(API_ENDPOINTS.GET_TOTAL_BALANCE),
    getBusinessBalance: () =>
      HttpClient.get<GetBusinessBalanceResponse>(
        API_ENDPOINTS.GET_BUSINESS_BALANCE
      ),
    getDailyTransactionSummary: () =>
      HttpClient.get<GetDailyTransactionSummaryResponse>(
        API_ENDPOINTS.GET_DAILY_TRANSACTION_SUMMARY
      ),
    getBusinessSummary: () =>
      HttpClient.get<GetBusinessSummaryResponse>(
        API_ENDPOINTS.GET_BUSINESS_SUMMARY
      ),
  };
  businessManagement = {
    getBusinessInfo: (input: GetBusinessInfoRequest) =>
      HttpClient.post<GetBusinessManagementListResponse>(
        API_ENDPOINTS.GET_BUSINESS_INFO,
        input
      ),
    getBusinessDepositInfo: (input: GetBusinessDepositInfoRequest) =>
      HttpClient.post<GetBusinessDepositInfoResponse>(
        API_ENDPOINTS.GET_BUSINESS_DEPOSIT_INFO,
        input
      ),
    registerBusinessInfo: (input: RegisterBusinessRequest) =>
      HttpClient.post<RegisterBusinessResponse>(
        API_ENDPOINTS.REGISTER_BUSINESS_INFO,
        input
      ),
    modifyBusinessInfo: (input: RegisterBusinessRequest) =>
      HttpClient.post<RegisterBusinessResponse>(
        API_ENDPOINTS.MODIFY_BUSINESS_INFO,
        input
      ),
    registerBusinessDeposit: (input: RegisterBusinessDepositRequest) =>
      HttpClient.post<MainResponse>(
        API_ENDPOINTS.REGISTER_BUSINESS_DEPOSIT,
        input
      ),
    modifyBusinessDeposit: (input: RegisterBusinessDepositRequest) =>
      HttpClient.post<MainResponse>(
        API_ENDPOINTS.MODIFY_BUSINESS_DEPOSIT,
        input
      ),
    changeBusinessStatus: (input: ChangeStatusBusinessRequest) =>
      HttpClient.post<MainResponse>(
        API_ENDPOINTS.CHANGE_STATUS_BUSINESS,
        input
      ),
    resetBusinessMasterKey: (input: ResetBusinessMasterKeyRequest) =>
      HttpClient.post<ResetBusinessMasterKeyResponse>(
        API_ENDPOINTS.RESET_BUSINESS_MASTER_KEY,
        input
      ),
    resetBusinessServiceTemplate: (input: ResetBusinessServiceTemplateRequest) =>
      HttpClient.post<ResetBusinessServiceTemplateResponse>(
        API_ENDPOINTS.RESET_BUSINESS_SERVICE_TEMPLATE,
        input
      ),
    loadBusiness: (input: { businessId: string }) =>
      HttpClient.post<MainResponse>(API_ENDPOINTS.LOAD_BUSINESS, input),
  };
  cardManagement = {
    getCardList: (input: GetSearchCardListRequest) =>
      HttpClient.post<GetSearchCardListResponse>(
        API_ENDPOINTS.SEARCH_CARD_LIST,
        input
      ),
    getCardDetails: (input: GetCardDetailsRequest) =>
      HttpClient.post<CardDetailsResponse>(API_ENDPOINTS.GET_CARD_INFO, input),

    changeStatusCard: (input: ChangeStatusCardRequest) =>
      HttpClient.post<MainResponse>(API_ENDPOINTS.CHANGE_STATUS_CARD, input),
  };
  reports = {
    getTransactionCard: (input: GetTransactionCardRequest) =>
      HttpClient.post<GetTransactionCardResponse>(
        API_ENDPOINTS.GET_CARD_TRANSACTION,
        input
      ),
    getCardEvents: (input: GetCardEventsRequest) =>
      HttpClient.post<GetCardEventsResponse>(
        API_ENDPOINTS.GET_CARD_EVENTS,
        input
      ),
    getBusinessDepositStatements: (input: GetBusinessDepositStatementsRequest) =>
      HttpClient.post<GetBusinessDepositStatementsResponse>(
        API_ENDPOINTS.GET_BUSINESS_DEPOSIT_STATEMENTS,
        input
      ),
    getSettlementReport: (input: import("@/models/reports.model").GetSettlementReportRequest) =>
      HttpClient.post<import("@/models/reports.model").GetSettlementReportResponse>(
        API_ENDPOINTS.GET_SETTLEMENT_REPORT,
        input
      ),
  };
}

export default new Client();
