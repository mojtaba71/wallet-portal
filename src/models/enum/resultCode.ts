export interface ResultCodeInfo {
  code: number;
  message: string;
  persianMessage: string;
}

export const RESULT_CODE_DICTIONARY: Record<number, ResultCodeInfo> = {
  // خطاهای عمومی و سیستمی
  [-1000]: { code: -1000, message: "General Error", persianMessage: "خطای سیستمی" },
  [-100]: { code: -100, message: "General Error", persianMessage: "خطای سیستمی" },
  [-2]: { code: -2, message: "General Error", persianMessage: "اطلاعات یافت نشد" },
  [-1]: { code: -1, message: "General Error", persianMessage: "خطای سیستمی" },
  
  // خطاهای سیستمی
  [101]: { code: 101, message: "Not Supported Action", persianMessage: "خطای سیستمی" },
  [102]: { code: 102, message: "Action Empty Request Data", persianMessage: "خطای سیستمی" },
  [103]: { code: 103, message: "Bad JSON Format", persianMessage: "خطای سیستمی" },
  [200000]: { code: 200000, message: "System Error", persianMessage: "خطای سیستمی" },
  
  // خطاهای اعتبارسنجی
  [10000]: { code: 10000, message: "Request Validation Error", persianMessage: "خطای اعتبارسنجی" },
  [20000]: { code: 20000, message: "Request Validation Error", persianMessage: "درخواست ارسال شده دارای خطای اعتبارسنجی می‌باشد" },
  
  // خطاهای احراز هویت و دسترسی
  [401]: { code: 401, message: "Unauthorized", persianMessage: "عدم دسترسی" },
  [403]: { code: 403, message: "Forbidden", persianMessage: "عدم دسترسی" },
  [107]: { code: 107, message: "Token not found or already logged out", persianMessage: "مهلت استفاده از توکن منقضی شده است" },
  [13000]: { code: 13000, message: "Unauthorized", persianMessage: "عدم دسترسی" },
  [230000]: { code: 230000, message: "Unauthorized", persianMessage: "عدم دسترسی" },
  [230001]: { code: 230001, message: "Invalid Credential", persianMessage: "نام کاربری یا رمز عبور اشتباه است" },
  [230002]: { code: 230002, message: "Domain Not Allowed", persianMessage: "عدم دسترسی" },
  [230003]: { code: 230003, message: "Time Not Allowed", persianMessage: "ساعت کاری کاربر تمام شده است" },
  [230004]: { code: 230004, message: "Inactive User", persianMessage: "کاربر غیر فعال می باشد" },
  [230005]: { code: 230005, message: "Token Limit Exceeded", persianMessage: "محدودیت کاربر" },
  [230006]: { code: 230006, message: "Grant Type Not Allowed", persianMessage: "عدم دسترسی" },
  [230007]: { code: 230007, message: "Not Supported Grant Type", persianMessage: "خطا در عملیات" },
  [230008]: { code: 230008, message: "Refresh Token Failed", persianMessage: "خطا در عملیات" },
  [230009]: { code: 230009, message: "Invalid Refresh Token", persianMessage: "خطا در عملیات" },
  [230010]: { code: 230010, message: "Invalid Access Token", persianMessage: "عدم دسترسی" },
  [230013]: { code: 230013, message: "Not Authorized Client", persianMessage: "عدم دسترسی" },
  [230014]: { code: 230014, message: "Redirect Uri Not Allowed", persianMessage: "خطا در عملیات" },
  [230015]: { code: 230015, message: "Authorization Failed", persianMessage: "تایید دسترسی انجام نشد" },
  [230016]: { code: 230016, message: "Invalid User", persianMessage: "کاربر معتبر نمی باشد" },
  [230017]: { code: 230017, message: "Invalid Client", persianMessage: "کاربر معتبر نمی باشد" },
  [230018]: { code: 230018, message: "Invalid Authorization Code", persianMessage: "خطا در عملیات" },
  [230019]: { code: 230019, message: "Inactive Client", persianMessage: "کاربر غیر فعال می باشد" },
  [230020]: { code: 230020, message: "Get Token Failed", persianMessage: "خطا در عملیات" },
  [230021]: { code: 230021, message: "Unsupported Token Type", persianMessage: "خطا در عملیات" },
  [230022]: { code: 230022, message: "Change Password Failed", persianMessage: "عملیات تغییر رمز عبور با خطا مواجه شد" },
  [230023]: { code: 230023, message: "New password cannot be the same as current password", persianMessage: "رمز عبور جدید نمی تواند با رمز عبور قدیمی یکسان باشد" },
  [230024]: { code: 230024, message: "Banned User", persianMessage: "کاربر به طور موقت مسدود شده است" },
  [230026]: { code: 230026, message: "Acquire From Token Bucket Failed", persianMessage: "خطا در عملیات" },
  
  // خطاهای مربوط به کسب و کار
  [1001]: { code: 1001, message: "Invalid Service Name", persianMessage: "خطای سیستمی" },
  [1002]: { code: 1002, message: "Service Not Available", persianMessage: "خطای سیستمی" },
  [13001]: { code: 13001, message: "Business Not Found", persianMessage: "شناسه کسب و کار ارسال شده در سیستم موجود نمی باشد" },
  [13002]: { code: 13002, message: "Duplicate 'abbreviationName'", persianMessage: "نام اختصاری کسب و کار تکراری است" },
  [13003]: { code: 13003, message: "businessId Limit Exceeded", persianMessage: "شناسه کسب و کار به محدودیت خود رسیده است. حداکثر ۹۹ کسب و کار مجاز است" },
  [13004]: { code: 13004, message: "'outPuthost' is Mandatory For This outPutChannel Type", persianMessage: "پارامتر آدرس خروجی برای این نوع کانال اجباری می باشد" },
  [13005]: { code: 13005, message: "'outPutPort' is Mandatory For This outPutChannel Type", persianMessage: "پارامتر پورت خروجی برای این نوع کانال اجباری می باشد" },
  [13006]: { code: 13006, message: "outputChannel Type Is Not Set", persianMessage: "پارامتر نوع کانال خروجی برای کسب و کار ثبت نشده است" },
  [13007]: { code: 13007, message: "Please Send At Least One Of Update Parameters", persianMessage: "ارسال حداقل یک پارامتر ویرایش اجباری است" },
  [13008]: { code: 13008, message: "Business Already Has A Registered Deposit", persianMessage: "کسب و کار دارای حساب ثبت شده می باشد. جهت تغییر حساب اقدام به ویرایش حساب نمایید" },
  [13009]: { code: 13009, message: "Business Is Not Active", persianMessage: "کسب و کار فعال نمی باشد" },
  [13010]: { code: 13010, message: "cifList Array Parameter is Empty", persianMessage: "لیست شماره مشتری خالی می باشد" },
  
  // خطاهای مربوط به کارت
  [23001]: { code: 23001, message: "Business Permission Denied", persianMessage: "کسب و کار غیر مجاز است" },
  [23002]: { code: 23002, message: "Card Type Permission Denied", persianMessage: "نوع کارت غیر مجاز است" },
  [23003]: { code: 23003, message: "This User Already Owns a Card Of The Specified Type In The Business", persianMessage: "کاربر از قبل دارای کارتی از نوع ارسال شده در کسب و کار جاری می باشد" },
  [23004]: { code: 23004, message: "Card Not Exists", persianMessage: "کارت ارسال شده یافت نشد" },
  [23005]: { code: 23005, message: "Operation Not Allowed For The Current Card Status", persianMessage: "عملیات برای وضعیت جاری کارت غیر مجاز می باشد" },
  [23006]: { code: 23006, message: "Please Send At Least One Of Card Parameters", persianMessage: "ارسال حداقل یکی از پارامترهای کارت اجباری می باشد" },
  [23007]: { code: 23007, message: "No Card Found", persianMessage: "نتیجه ای برای جستجو کارت یافت نشد" },
  [23008]: { code: 23008, message: "Please Send At Least One Of Search Parameters", persianMessage: "ارسال حداقل یکی از پارامترهای جستجو اجباری است" },
  [23009]: { code: 23009, message: "No Card Transaction Found", persianMessage: "تراکنشی برای کارت یافت نشد" },
  [23010]: { code: 23010, message: "No Card Event Founds", persianMessage: "اطلاعات رخداد کارت یافت نشد" },
};

/**
 * دریافت پیام خطای فارسی بر اساس ResultCode
 * @param resultCode کد خطا
 * @returns پیام خطای فارسی یا پیام پیش‌فرض
 */
export const getPersianErrorMessage = (resultCode: number): string => {
  const errorInfo = RESULT_CODE_DICTIONARY[resultCode];
  return errorInfo ? errorInfo.persianMessage : "خطای سیستمی رخ داده است";
};

/**
 * دریافت اطلاعات کامل خطا بر اساس ResultCode
 * @param resultCode کد خطا
 * @returns اطلاعات کامل خطا یا null
 */
export const getErrorInfo = (resultCode: number): ResultCodeInfo | null => {
  return RESULT_CODE_DICTIONARY[resultCode] || null;
};
