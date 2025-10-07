import type { MainPagingRequest, MainResponse } from "./general.model";

export interface GetSearchCardListRequest extends MainPagingRequest {
  personId?: number;
  name?: string;
  lastName?: string;
  cif?: number;
  mobile?: number;
  pan?: number;
  iban?: string;
  depositNumber?: string;
}

export interface CardItem {
  lastName: string;
  cif: number;
  name: string;
  cardType: string;
  businessId: number;
  businessName: string;
  personId: number;
  expireDate: string;
  pan: number;
  status: string;
}

export interface GetSearchCardListResponse extends MainResponse {
  cardCount: number;
  cardList: CardItem[];
}

export interface PersonInfo {
  cif: number;
  lastName: string;
  gender: string;
  name: string;
  personId: number;
  nameEN: string;
  personType: string;
  insertDateTime: string;
  lastNameEN: string;
}

export interface CardInfo {
  businessId: number;
  businessName: string;
  mobile: number;
  cardType: string;
  expireDate: string;
  pan: number;
  iban: string | null;
  insertDateTime: string;
  updateDateTime: string | null;
  depositNumber: string;
  status: string;
}

export interface CardDetailsResponse {
  resultCode: number;
  resultMessage: string;
  personInfo: PersonInfo;
  cardCount: number;
  cardList: CardInfo[];
}

export type GetCardDetailsRequest = Pick<GetSearchCardListRequest, "personId" | "pan">;

export interface ChangeStatusCardRequest {
  pan: number;
  status: string;
  description: string;
}
