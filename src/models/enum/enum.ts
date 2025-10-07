export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ResultType {
  Success,
  Failed,
}

export enum CardEventType {
  CHANGE_STATUS = "CHANGE_STATUS",
  GENERATE_TRACK = "GENERATE_TRACK",
  REISSUE = "REISSUE",
  CHANGE_MOBILE = "CHANGE_MOBILE",
}

export const CardEventTypeText: Record<CardEventType, string> = {
  [CardEventType.CHANGE_STATUS]: "تغییر وضعیت",
  [CardEventType.GENERATE_TRACK]: "صدور کارت",
  [CardEventType.REISSUE]: "صدور مجدد",
  [CardEventType.CHANGE_MOBILE]: "تغییر موبایل",
};

export enum SettlementType {
  WAGE_SETTLE = "WAGE_SETTLE",
  TRANSFER_SETTLE = "TRANSFER_SETTLE",
  FINANCIAL_SETTLE = "FINANCIAL_SETTLE",
}

export const SettlementTypeText: Record<SettlementType, string> = {
  [SettlementType.WAGE_SETTLE]: "تسویه کارمزد",
  [SettlementType.TRANSFER_SETTLE]: "انتقال وجه",
  [SettlementType.FINANCIAL_SETTLE]: "تراکنش مالی",
};