export const ServiceType: Record<string, string> = {
  DEBIT_CARD: "کارت نقدی",
  BON_CARD: "ّبن کارت",
  BOTH: "مجاز به صدور هر دو نوع کارت",
};

export const StatusType: Record<string, string> = {
  ACTIVE: "فعال",
  INACTIVE: "غیرفعال",
};

export const AccessType: Record<string, string> = {
  LEVEL1: "سطح 1",
  LEVEL2: "سطح 2",
  LEVEL3: "سطح 3",
  LEVEL4: "سطح 4",
  LEVEL5: "سطح 5",
};

export const statusOptions = [
  { value: "ACTIVE", label: "فعال" },
  { value: "INACTIVE", label: "غیرفعال" },
];

export interface MainResponse {
  resultCode: number;
  resultMessage: string;
}

export interface MainPagingRequest {
  offset: number;
  count: number;
}

export const cardStatusOptions = [
  {
    value: "ACTIVE",
    label: "فعال",
  },
  {
    value: "ACTIVE_WARNING",
    label: "فعال هشدار",
  },
  {
    value: "BLOCK_DEPOSIT",
    label: "مسدود واریز",
  },
  {
    value: "BLOCK_WITHDRAW",
    label: "مسدود برداشت",
  },
  {
    value: "BLOCK",
    label: "مسدود",
  },
  {
    value: "CLOSE_TEMPORARY",
    label: "راکد موقت",
  },
  {
    value: "CLOSE_TEMPORARY_WARNING",
    label: "راکد موقت هشدار",
  },
  {
    value: "CLOSE",
    label: "راکد دائم",
  },
];
