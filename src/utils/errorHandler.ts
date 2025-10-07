import { getPersianErrorMessage } from "@/models/enum/resultCode";

/**
 * مدیریت خطاهای API با نمایش پیام فارسی
 * @param error خطای دریافتی از API
 * @param defaultMessage پیام پیش‌فرض در صورت عدم وجود ResultCode
 */
export const handleApiError = (error: any, defaultMessage: string = "خطای سیستمی رخ داده است") => {
  const resultCode = error?.response?.data?.resultCode;
  
  if (resultCode) {
    return getPersianErrorMessage(resultCode);
  }
  
  return defaultMessage;
};

/**
 * بررسی اینکه آیا خطا باید نمایش داده بشه یا نه
 * @param resultCode کد خطا
 * @param suppressedCodes آرایه کدهای خطایی که نباید نمایش داده بشن
 */
export const shouldShowError = (resultCode: number, suppressedCodes: number[] = []): boolean => {
  return !suppressedCodes.includes(resultCode);
};

/**
 * نمایش خطا با toast
 * @param error خطای دریافتی
 * @param suppressedCodes کدهای خطایی که نباید نمایش داده بشن
 */
export const showApiError = (error: any, suppressedCodes: number[] = []) => {
  const resultCode = error?.response?.data?.resultCode;
  
  if (resultCode && shouldShowError(resultCode, suppressedCodes)) {
    const errorMessage = getPersianErrorMessage(resultCode);
    // اینجا می‌تونید از toast یا هر notification system دیگه‌ای استفاده کنید
    console.error(errorMessage);
    return errorMessage;
  }
  
  return null;
};
