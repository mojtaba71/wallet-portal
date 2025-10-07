import type { MainPagingRequest, MainResponse } from "./general.model";

export const FunctionCodeType: Record<number, string> = {
  281: " پرداخت قسط",
  101: "درخواست تایید اولیه خرید",
  103: "درخواست تایید اولیه خرید جایگزین",
  107: "درخواست تایید اولیه خرید مکمل",
  108: "درخواست دریافت موجودی",
  113: "درخواست بررسی کیف پول مقصد",
  160: "درخواست دریافت شناسه های روش پرداخت مشترک بین کیف پول و ترمینال",
  162: "درخواست دریافت اطلاعات ویژه پذیرنده",
  163: "درخواست استعلام وضعیت تراکنش",
  200: "خرید",
  201: "خرید بر اساس  تایید اولیه قبلی با مبلغ یکسان",
  202: "خرید بر اساس تایید اولیه قبلی با مبلغ کمتر",
  260: "برگشت از خرید",
  262: "انتقال وجه",
  279: "دشارژ",
  280: "پرداخت قبض‌های خدمات عمومی",
  282: "خرید شارژ کارت",
  283: "پرداخت قبض‌های ویژه",
  284: "خرید شارژ کارت آنی",
  420: "ابطال تراکنش",
  400: "اصلاحیه سیستمی کامل وجه",
  299: "استرداد وجه",
  294: "سروش",
};

export const TerminalType: Record<number, string> = {
  14: "پایانه‌ی فروش",
  59: "پایانه‌ی اینترنتی",
  60: "برنامک های همراه",
  72: "سیستم",
  61: "بارکد",
  2: "خودپرداز",
  3: "تحویل داری شعبه",
  5: "تلفن همراه یا پایانه ی فروش همراه",
  7: "تلفن ثابت",
  43: "کیوسک یا پایانه فروش خودکار",
};

export interface GetTransactionCardRequest extends MainPagingRequest {
  startDate?: string;
  endDate?: string;
  pan?: number;
}

export interface TransactionCardItem {
  acquiringInstitute: number;
  amount: number;
  functionCode: number;
  destinationPan: number;
  transactionDateTime: string;
  terminalId: number;
  mcc: number;
  receivingBusiness: number;
  rrn: number;
  merchantName: string;
  terminalType: number;
  responseCode: number;
  merchantId: number;
  merchantCityCode: number;
  stan: number;
  pan: number;
  status: number;
}

export interface GetTransactionCardResponse extends MainResponse {
  cardTransactionCount: number;
  cardTransactionList: TransactionCardItem[];
}

export interface GetCardEventsRequest extends MainPagingRequest {
  pan?: number;
  startDate?: string;
  endDate?: string;
}

export interface CardEventItem {
  cardEventType: string;
  lastValue: string | null;
  description: string;
  insertDateTime: string;
  currentValue: string | null;
}

export interface GetCardEventsResponse extends MainResponse {
  cardEventCount: number;
  cardEventList: CardEventItem[];
}

// Business Deposit Statements Report Models
export interface GetBusinessDepositStatementsRequest extends MainPagingRequest {
  businessId: string;
  startDate?: string;
  endDate?: string;
}

export interface BusinessDepositStatementItem {
  cif: string;
  amount: number;
  depositNumber: string;
  balance: number;
  statementDateTime: string;
  statementId: string;
  description: string;
  insertDateTime: string;
  referenceId: string | null;
}

export interface GetBusinessDepositStatementsResponse extends MainResponse {
  depositStatementCount: number;
  depositStatementList: BusinessDepositStatementItem[];
}

export interface GetSettlementReportRequest extends MainPagingRequest {
  fromDate?: string;
  toDate?: string;
  sourceDeposit?: string;
  destinationDeposit?: string;
  paymentRrn?: string;
  settleType?: string;
  paymentStatus?: number;
}

export interface SettlementPaymentItem {
  trackerId: number;
  insertDT: string;
  settleType: string;
  settleCycleId: string;
  sourceDeposit: string;
  sourceOwnerId: string;
  sourceOwnerType: string;
  sourceCif: string;
  destinationDeposit: string;
  destinationOwnerId: string;
  destinationOwnerType: string;
  tryCounter: number;
  paymentRrn: string;
  paymentStatusCode: number;
  paymentStatusDescription: string;
  paymentDT: string;
  paymentType: string;
  description: string | null;
  amount: number;
  updateDT: string;
}

export interface GetSettlementReportResponse extends MainResponse {
  settlementPayments: SettlementPaymentItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}