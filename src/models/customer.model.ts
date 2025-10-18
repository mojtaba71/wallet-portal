import type { MainResponse } from "./general.model";

export interface CustomerSearchRequest {
  personId?: number;
  name?: string;
  lastName?: string;
  offset: number;
  count: number;
}

export interface CustomerAdditionalData {
  tagKey: number;
  tagValue: string;
}

export interface Customer {
  personType: "REAL" | "LEGAL" | "FOREIGN";
  personId: number;
  name: string;
  lastName: string;
  nameEN?: string;
  lastNameEN?: string;
  fatherName?: string;
  fatherNameEN?: string;
  gender?: "MALE" | "FEMALE";
  mobile?: number;
  email?: string;
  birthDate?: string;
  additionalData?: CustomerAdditionalData[];
}

export interface CustomerSearchResponse extends MainResponse {
  personCount: number;
  personList: Customer[];
}

export const PersonTypeLabels: Record<string, string> = {
  REAL: "حقیقی",
  LEGAL: "حقوقی",
  FOREIGN: "اتباع خارجی",
};

export const GenderLabels: Record<string, string> = {
  MALE: "مرد",
  FEMALE: "زن",
};

export interface RegisterPersonRequest {
  personType: "REAL" | "LEGAL" | "FOREIGN";
  personId: number;
  name: string;
  lastName: string;
  nameEN?: string;
  lastNameEN?: string;
  fatherName?: string;
  fatherNameEN?: string;
  gender?: "MALE" | "FEMALE";
  mobile?: number;
  email?: string;
  birthDate?: string;
  additionalData?: CustomerAdditionalData[];
}

export interface BulkCustomerData {
  rowIndex: number;
  personType: "REAL" | "LEGAL" | "FOREIGN";
  personId: number;
  name: string;
  lastName: string;
  fatherName?: string;
  gender?: "MALE" | "FEMALE";
  mobile?: number;
  email?: string;
  status: "idle" | "success" | "error";
  errorMessage?: string;
}

export interface CustomerRegistrationRequest {
  personType: "REAL" | "LEGAL" | "FOREIGN";
  personId: number;
  name: string;
  lastName: string;
  nameEN?: string;
  lastNameEN?: string;
  fatherName?: string;
  fatherNameEN?: string;
  gender?: "MALE" | "FEMALE";
  mobile?: number;
  email?: string;
  birthDate?: string;
  registerDate?: string;
  additionalData?: CustomerAdditionalData[];
}

export interface CustomerRegistrationResponse extends MainResponse {
  personType: "REAL" | "LEGAL" | "FOREIGN";
  personId: number;
}

export const personTypeOptions = [
  { value: "REAL", label: "حقیقی" },
  { value: "LEGAL", label: "حقوقی" },
  { value: "FOREIGN", label: "اتباع خارجی" },
];

export const genderOptions = [
  { value: "MALE", label: "مرد" },
  { value: "FEMALE", label: "زن" },
];
