import dayjs, { Dayjs } from "dayjs";
import moment from "jalali-moment";
import { toEnglishNumber } from "./utils";

export const dateFn = (date: dayjs.Dayjs) => {
  const value = date.toISOString();
  const idx = value.indexOf("T");
  const result = value.slice(0, idx);
  return result;
};

/**
 * تبدیل dayjs تاریخ شمسی به تاریخ میلادی (فقط به صورت رشته YYYY-MM-DD بدون انحراف UTC)
 */
export const toGregorian = (input: Dayjs | null | undefined): string => {
  if (!input?.isValid?.()) return "";
  const raw = input.format("YYYY/MM/DD");

  const m = moment.from(raw, "fa", "jYYYY/MM/DD").locale("en");

  return m.isValid() ? m.format("YYYY-MM-DD") : "";
};

/**
 * تبدیل تاریخ میلادی به شمسی (string یا Date)
 */
export const toJalali = (
  input: string | Date,
  returnType: "string" | "date" = "string"
): string | Date | null => {
  if (!input) return returnType === "string" ? "" : null;
  const m = moment(input);
  if (!m.isValid()) return returnType === "string" ? "" : null;

  const jalali = m.locale("fa");
  return returnType === "string"
    ? jalali.format("jYYYY/jMM/jDD")
    : jalali.toDate();
};

/**
 * گرفتن مقدار dayjs از مقدارهای string, Date, یا moment
 * در صورتی که مقدار نامعتبر باشد null برمی‌گرداند
 */

export const toDayjsSafely = (input: string | Date | Dayjs | moment.Moment): dayjs.Dayjs | null => {
  if (!input) return null;

  try {
    const date =
      typeof input === "string" || input instanceof Date
        ? dayjs(input)
        : dayjs(input.toDate?.() ?? input);

    return date.isValid() ? date : null;
  } catch {
    return null;
  }
};

/**
 * Helper function to safely convert Dayjs date to Jalali string
 * @param date Dayjs object
 * @returns Jalali string or undefined if conversion fails
 */
export const convertToJalaliString = (date: any): string | undefined => {
  if (!date) return undefined;
  
  // Handle react-multi-date-picker DateObject
  if (date && typeof date.format === 'function' && date.isValid) {
    try {
      const persianDate = date.format("YYYY/MM/DD");
      return toEnglishNumber(persianDate);
    } catch {
      return undefined;
    }
  }
  
  // Handle Dayjs objects
  if (date && typeof date.isValid === 'function' && date.format) {
    try {
      const raw = date.format("YYYY/MM/DD");
      const m = moment.from(raw, "fa", "jYYYY/MM/DD").locale("fa");
      const jalaliDate = m.isValid() ? m.format("jYYYY/jMM/jDD") : undefined;
      if (jalaliDate) {
        return toEnglishNumber(jalaliDate);
      }
      return undefined;
    } catch {
      return undefined;
    }
  }
  
  return undefined;
};
