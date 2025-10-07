import type { MainResponse } from "./general.model";

export const channelOptions = [
  { value: "ISO", label: "کانال ISO" },
  { value: "REST", label: "کانال REST" },
];

export const serviceTypeOptions = [
  { value: "DEBIT_CARD", label: "کارت نقدی" },
  { value: "BON_CARD", label: "بن کارت" },
  { value: "BOTH", label: "هر دو نوع کارت" },
];

export const accessLevelOptions = [
  { value: "LEVEL1", label: "سطح 1" },
  { value: "LEVEL2", label: "سطح 2" },
  { value: "LEVEL3", label: "سطح 3" },
  { value: "LEVEL4", label: "سطح 4" },
  { value: "LEVEL5", label: "سطح 5" },
];

export interface GetBusinessInfoRequest {
  businessId: number;
  status?: string;
  name?: string;
}

export interface BusinessInfoItem {
  isOutPutTls: boolean;
  serviceType: string;
  accessLevel: string;
  businessId: number;
  outPutPort: number;
  outPutTimeOut: number;
  outPutHost: string;
  insertDateTime: string;
  outPutChannelType: string;
  inputPort: number;
  inputRate: number;
  name: string;
  abbreviationName: string;
  inputVolume: number;
  pinApi: string;
  updateDateTime: string;
  isInputTls: boolean;
  status: string;
}

export interface GetBusinessManagementListResponse extends MainResponse {
  businessInfoCount: number;
  businessInfoList: BusinessInfoItem[];
}

export type GetBusinessDepositInfoRequest = Pick<GetBusinessInfoRequest, "businessId">;

export interface GetBusinessDepositInfoResponse extends MainResponse {
  businessId: number;
  depositNumber: string;
  cifList: number[];
  balance: string;
  insertDateTime: string;
  updateDateTime: string;
  wageDepositNumber?: number;
}

export interface RegisterBusinessRequest {
  businessId?: number;
  name: string;
  abbreviationName: string;
  isInputTls?: boolean;
  inputPort?: number;
  inputVolume?: number;
  inputRate?: number;
  outPutChannelType?: string;
  isOutPutTls?: boolean;
  outPutHost?: string;
  outPutPort?: number;
  outPutTimeOut?: number;
  pinAPI?: string;
  serviceType?: string;
  accessLevel?: string;
}

export interface WalletServiceUserInfo {
  registerResultCode: number;
  registerResultMessage: string;
  userName: string;
  userId: string;
  userKey: string;
}

export interface RegisterBusinessResponse extends MainResponse {
  businessId: number;
  masterKey: string;
  walletServiceUserInfo?: WalletServiceUserInfo;
}

export interface RegisterBusinessDepositRequest {
  businessId: number;
  depositNumber: string;
  cifList: number[];
  wageDepositNumber?: number;
}

export interface ChangeStatusBusinessRequest
  extends Pick<RegisterBusinessResponse, "businessId"> {
  status: string;
}

export interface ResetBusinessMasterKeyRequest {
  businessId: number;
}

export interface ResetBusinessMasterKeyResponse extends MainResponse {
  masterKey: string;
}

export interface ResetBusinessServiceTemplateRequest {
  username: string;
}

export interface ResetBusinessServiceTemplateResponse extends MainResponse {
  userKey: string;
}