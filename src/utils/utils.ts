export const getGenderText = (gender: string) => {
  return gender === "MALE" ? "مرد" : "زن";
};

export const getStatusText = (status: string) => {
  return status === "ACTIVE" ? "فعال" : "غیرفعال";
};

export const getCardTypeText = (type: string) => {
  switch (type) {
    case "BON_CARD":
      return "بن کارت";
    case "DEBIT_CARD":
      return "کارت نقدی";
    default:
      return type;
  }
};

export const getCardStatusText = (status: string): string => {
  switch (status) {
    case "ACTIVE":
      return "فعال";
    case "INACTIVE":
      return "غیرفعال";
    case "ACTIVE_WARNING":
      return "فعال هشدار";
    case "BLOCK_DEPOSIT":
      return "مسدود واریز";
    case "BLOCK_WITHDRAW":
      return "مسدود برداشت";
    case "BLOCK":
      return "مسدود";
    case "CLOSE_TEMPORARY":
      return "راکد موقت";
    case "CLOSE_TEMPORARY_WARNING":
      return "راکد موقت هشدار";
    case "CLOSE":
      return "راکد دائم";
    default:
      return status; // اگر وضعیت شناخته شده نبود، همان مقدار انگلیسی برگردانده می‌شود
  }
};

export const getTransactionStatusText = (status: number): string => {
  if (status === 0) return "ناقص";
  if (status >= 10 && status <= 19) return "کامل";
  if (status >= 20 && status <= 29) return "برگشت خورده";
  return `وضعیت ${status}`;
};

export const toPersianNumber = (num: number | string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

export const formatPersianNumber = (num: number | string): string => {
  const numStr = String(num);
  const parts = numStr.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return toPersianNumber(parts.join("."));
};

export const formatPersianDate = (dateString: string): string => {
  const parts = dateString.split("/");
  if (parts.length === 3) {
    return toPersianNumber(`${parts[1]}/${parts[2]}`);
  }
  return toPersianNumber(dateString);
};

export const toEnglishNumber = (str: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  
  return str
    .replace(/[۰-۹]/g, (d: string) => persianDigits.indexOf(d).toString())
    .replace(/[٠-٩]/g, (d: string) => arabicDigits.indexOf(d).toString());
};