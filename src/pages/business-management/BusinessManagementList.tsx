import InputNumber from "@/components/kits/number-input/NumberInput";
import { useTheme } from "@/hooks/useTheme";
import type {
  BusinessInfoItem,
  GetBusinessManagementListResponse,
} from "@/models/businessManagement.model";
import { ResultType } from "@/models/enum/enum";
import { AccessType, ServiceType, StatusType } from "@/models/general.model";
import { UrlRoutes } from "@/routes/url.routes";
import {
  useBusinessDepositInfo,
  useBusinessInfo,
  useLoadBusiness,
  useResetBusinessMasterKey,
  useResetBusinessServiceTemplate,
} from "@/services/hook/businessManagementService.hook";
import {
  PlusOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  BaseInfoIcon,
  NetworkIcon,
  SecurityIcon,
  ServiceIcon,
  AccountIcon,
} from "@/assets/icons";
import { Button, Form, Modal, Space, Spin, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleBar from "simplebar-react";
import { toast } from "react-toastify";
import ChangeStatusBusinessModal from "./modal/ChangeStatusBusinessModal";
import { toJalali } from "@/utils/dateConfig";

interface SearchBusinessForm {
  businessId?: number;
  name?: string;
  status?: string;
}

const { Text } = Typography;

const BusinessManagementListView: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [data, setData] = useState<BusinessInfoItem[]>([]);
  const [activeKey, setActiveKey] = useState<string>();
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessInfoItem>();
  const [depositDataCache, setDepositDataCache] = useState<Record<number, any>>(
    {}
  );
  const [showMasterKeyModal, setShowMasterKeyModal] = useState(false);
  const [showServiceKeyModal, setShowServiceKeyModal] = useState(false);
  const [printedBusiness, setPrintedBusiness] =
    useState<BusinessInfoItem | null>(null);
  const [lastMasterKey, setLastMasterKey] = useState<string>("");
  const [lastServiceKey, setLastServiceKey] = useState<string>("");

  const [openChangeStatusModal, setChangeStatusModal] =
    useState<boolean>(false);
  const { mutate: mutateBusinessInfo, isLoading } = useBusinessInfo();
  const {
    mutate: fetchDeposit,
    data: depositData,
    isLoading: depositLoading,
  } = useBusinessDepositInfo();

  const { mutate: mutateLoadBusiness, isLoading: loadBusinessLoading } =
    useLoadBusiness();
  const { mutate: resetMasterKey } = useResetBusinessMasterKey();
  const { mutate: resetServiceTemplate } = useResetBusinessServiceTemplate();
  const [searchForm] = useForm<SearchBusinessForm>();

  const getBusinessInfo = useCallback(() => {
    mutateBusinessInfo(
      {
        businessId: searchForm.getFieldValue("businessId") || 0,
      },
      {
        onSuccess: (successData: GetBusinessManagementListResponse) => {
          if (successData.resultCode === ResultType.Success) {
            setData(successData.businessInfoList);
          }
        },
      }
    );
  }, [mutateBusinessInfo, searchForm]);

  useEffect(() => {
    getBusinessInfo();
  }, [getBusinessInfo]);

  useEffect(() => {
    if (depositData && activeKey) {
      const businessId = parseInt(activeKey);
      setDepositDataCache((prev) => ({
        ...prev,
        [businessId]: depositData,
      }));
    }
  }, [depositData, activeKey]);
  const renderBusinessRow = (biz: BusinessInfoItem, index: number) => {
    const isExpanded = activeKey === biz.businessId.toString();

    return (
      <div key={biz.businessId} className="bg-white dark:bg-gray-800 border-0">
        {/* Header Row */}
        <div
          className="flex items-center w-full p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => {
            const newActiveKey = isExpanded
              ? undefined
              : biz.businessId.toString();
            setActiveKey(newActiveKey);

            if (newActiveKey) {
              if (depositDataCache[biz.businessId] !== undefined) {
                return;
              }
              fetchDeposit({ businessId: biz.businessId });
            }
          }}
        >
          <div className="w-12 text-center">
            <Text className="!text-xs md:!text-sm !font-medium dark:!text-gray-50">
              {index + 1}
            </Text>
          </div>

          <div className="flex-1 text-center">
            <Text
              strong
              className="!text-sm md:!text-base !font-medium dark:!text-gray-50"
            >
              {biz.name}
            </Text>
          </div>

          <div className="flex-1 text-center">
            <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
              کد کسب و کار: {biz.businessId}
            </Text>
          </div>

          <div className="flex-1 text-center">
            <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
              نام اختصاری: {biz.abbreviationName}
            </Text>
          </div>

          <div className="flex-1 text-center">
            <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
              <span>وضعیت: </span>
              <span
                className={
                  biz.status === "ACTIVE"
                    ? "!text-green-600 dark:!text-green-400"
                    : "!text-red-600 dark:!text-red-400"
                }
              >
                {biz.status === "ACTIVE" ? "فعال" : "غیرفعال"}
              </span>
            </Text>
          </div>

          {/* فلش */}
          <div className="w-12 text-center">
            <div
              className={`transform transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <MdKeyboardArrowDown className="w-4 h-4 text-gray-600 dark:text-gray-50" />
            </div>
          </div>
        </div>

        <div className="mx-4 border-t border-dashed border-gray-250"></div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6 bg-white dark:bg-gray-800 space-y-4">
            {/* اطلاعات پایه */}
            <div className="border border-gray-400 dark:border-gray-400 rounded-lg overflow-hidden">
              <div className="bg-[#FBFBFB] dark:bg-gray-700 px-4 py-3 border-b border-gray-400 dark:border-gray-400 flex items-center gap-8">
                <BaseInfoIcon
                  width={20}
                  height={20}
                  color={isDark ? "#F2F2F2" : "#625F6D"}
                />
                <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                  اطلاعات پایه
                </Text>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    کد کسب‌وکار :
                  </Text>
                  <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                    {biz.businessId}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    نام کسب‌وکار :
                  </Text>
                  <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                    {biz.name}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    نام اختصاری :
                  </Text>
                  <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                    {biz.abbreviationName}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    وضعیت :
                  </Text>
                  <Text
                    className={`!text-sm md:!text-base !font-medium ${
                      biz.status === "ACTIVE"
                        ? "!text-green-600"
                        : "!text-red-600"
                    }`}
                  >
                    {StatusType[biz.status]}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    تاریخ ثبت اطلاعات :
                  </Text>
                  <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                    {biz.insertDateTime}
                  </Text>
                </div>
              </div>
            </div>

            {/* شبکه و اتصال */}
            <div className="border border-gray-400 dark:border-gray-400 rounded-lg overflow-hidden">
              <div className="bg-[#FBFBFB] dark:bg-gray-700 px-4 py-3 border-b border-gray-400 dark:border-gray-400 flex items-center gap-8">
                <NetworkIcon
                  width={20}
                  height={20}
                  color={isDark ? "#F2F2F2" : "#625F6D"}
                />
                <Text className="!text-base !font-semibold dark:!text-gray-50">
                  شبکه و اتصال
                </Text>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    شماره پورت ورودی :
                  </Text>
                  <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                    {biz.inputPort}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    نوع کانال خروجی :
                  </Text>
                  <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                    {biz.outPutChannelType}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    آدرس خروجی :
                  </Text>
                  <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                    {biz.outPutHost}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    پورت ورودی کانال ISO :
                  </Text>
                  <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                    {biz.outPutPort}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    زمان تاخیر دریافت پاسخ از سوئیچ :
                  </Text>
                  <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                    {biz.outPutTimeOut}
                  </Text>
                </div>
              </div>
            </div>

            {/* امنیت */}
            <div className="border border-gray-400 dark:border-gray-400 rounded-lg overflow-hidden">
              <div className="bg-[#FBFBFB] dark:bg-gray-700 px-4 py-3 border-b border-gray-400 dark:border-gray-400 flex items-center gap-8">
                <SecurityIcon
                  width={20}
                  height={20}
                  color={isDark ? "#F2F2F2" : "#625F6D"}
                />
                <Text className="!text-base !font-semibold dark:!text-gray-50">
                  امنیت
                </Text>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    کانال ورودی به کسب و کار TLS می باشد :
                  </Text>
                  <Text
                    className={`!text-sm md:!text-base !font-medium ${
                      biz.isInputTls ? "!text-green-600" : "!text-red-600"
                    }`}
                  >
                    {biz.isInputTls ? "بلی" : "خیر"}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    کانال خروجی به کسب و کار به سوئیچ هاب TLS می باشد :
                  </Text>
                  <Text
                    className={`!text-sm md:!text-base !font-medium ${
                      biz.isOutPutTls ? "!text-green-600" : "!text-red-600"
                    }`}
                  >
                    {biz.isOutPutTls ? "بلی" : "خیر"}
                  </Text>
                </div>
              </div>
            </div>

            {/* سرویس‌ها */}
            <div className="border border-gray-400 dark:border-gray-400 rounded-lg overflow-hidden">
              <div className="bg-[#FBFBFB] dark:bg-gray-700 px-4 py-3 border-b border-gray-400 dark:border-gray-400 flex items-center gap-8">
                <ServiceIcon
                  width={20}
                  height={20}
                  color={isDark ? "#F2F2F2" : "#625F6D"}
                />
                <Text className="!text-base !font-semibold dark:!text-gray-50">
                  سرویس‌ها
                </Text>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    آدرس سرویس هریم :
                  </Text>
                  <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                    {biz.pinApi || "-"}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    نوع کارت مجازی جهت صدور :
                  </Text>
                  <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                    {ServiceType[biz.serviceType]}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                    سطح دسترسی :
                  </Text>
                  <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                    {AccessType[biz.accessLevel]}
                  </Text>
                </div>
              </div>
            </div>

            {/* اطلاعات حساب */}
            <div className="border border-gray-400 dark:border-gray-400 rounded-lg overflow-hidden">
              <div className="bg-[#FBFBFB] dark:bg-gray-700 px-4 py-3 border-b border-gray-400 dark:border-gray-400 flex items-center gap-8">
                <AccountIcon
                  width={20}
                  height={20}
                  color={isDark ? "#F2F2F2" : "#625F6D"}
                />
                <Text className="!text-base !font-semibold dark:!text-gray-50">
                  اطلاعات حساب
                </Text>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800">
                <Spin spinning={depositLoading}>
                  {depositDataCache[biz.businessId] ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="flex items-center gap-2">
                        <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                          کد کسب‌وکار :
                        </Text>
                        <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                          {depositDataCache[biz.businessId].businessId}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                          شماره حساب کسب‌وکار :
                        </Text>
                        <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                          {depositDataCache[biz.businessId].depositNumber}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                          شماره حساب کارمزد :
                        </Text>
                        <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                          {depositDataCache[biz.businessId].wageDepositNumber ||
                            "-"}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                          لیست کد مشتریان / امضا داران حساب :
                        </Text>
                        <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                          {Array.isArray(
                            depositDataCache[biz.businessId].cifList
                          )
                            ? depositDataCache[biz.businessId].cifList.join(
                                ", "
                              )
                            : depositDataCache[biz.businessId].cifList}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                          موجودی کسب‌وکار :
                        </Text>
                        <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                          {depositDataCache[biz.businessId].balance}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                          تاریخ ثبت اطلاعات :
                        </Text>
                        <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                          {depositDataCache[biz.businessId].insertDateTime}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <Text className="!text-xs md:!text-sm !text-gray-600 dark:!text-gray-50">
                          تاریخ آخرین ویرایش :
                        </Text>
                        <Text className="!text-sm md:!text-base !font-medium dark:!text-gray-50">
                          {depositDataCache[biz.businessId].updateDateTime}
                        </Text>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-500 dark:text-gray-400">
                        اطلاعات حساب برای این کسب‌وکار ثبت نشده است
                      </div>
                    </div>
                  )}
                </Spin>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pb-6 border-b border-dashed border-gray-400 dark:border-gray-400">
              {biz.status === "ACTIVE" ? (
                <Button
                  className="!w-full sm:!w-auto !bg-white dark:!bg-gray-800 hover:!bg-red-500 !border-red-500 !text-red-500 hover:!text-white"
                  onClick={() => handleChangeStatus(biz)}
                >
                  غیرفعال کردن
                </Button>
              ) : (
                <Button
                  className="!w-full sm:!w-auto !bg-white dark:!bg-gray-800 hover:!bg-green-500 !border-green-500 !text-green-500 hover:!text-white"
                  onClick={() => handleChangeStatus(biz)}
                >
                  فعال کردن
                </Button>
              )}
              <Button
                className="!w-full sm:!w-auto !bg-blue-300 hover:!bg-blue-400 !border-blue-300 !text-white"
                onClick={() => {
                  navigate(
                    `${UrlRoutes.businessManagement}${UrlRoutes.addBusinessManagement}`,
                    {
                      state: {
                        businessInfo: biz,
                        depositData: depositDataCache[biz.businessId],
                      },
                    }
                  );
                }}
              >
                ویرایش
              </Button>
              <Button
                className="!w-full sm:!w-auto !bg-blue-600 hover:!bg-blue-700 !border-blue-600 !text-white"
                onClick={() => handleResetMasterKey(biz.businessId)}
              >
                بازنشانی کلید سوییچ
              </Button>
              <Button
                className="!w-full sm:!w-auto !bg-blue-600 hover:!bg-blue-700 !border-blue-600 !text-white"
                onClick={() => handleResetServiceTemplate(biz.abbreviationName)}
              >
                بازنشانی کلید سرویس
              </Button>
              <Button
                className="!w-full sm:!w-auto !bg-blue-600 hover:!bg-blue-700 !border-blue-600 !text-white"
                loading={loadBusinessLoading}
                onClick={() => handleLoadBusiness(biz.businessId)}
              >
                به‌روزرسانی حسابداری
              </Button>

              {!depositDataCache[biz.businessId] && (
                <Button
                  className="!w-full sm:!w-auto !bg-green-600 hover:!bg-green-700 !border-green-600 !text-white"
                  onClick={() =>
                    navigate(
                      `${UrlRoutes.businessManagement}${UrlRoutes.addBusinessManagement}`,
                      {
                        state: {
                          businessId: biz.businessId,
                          addBusinessDeposit: true,
                          depositData: depositDataCache[biz.businessId],
                        },
                      }
                    )
                  }
                >
                  افزودن اطلاعات حساب
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onFinish = () => {
    getBusinessInfo();
  };

  const handleChangeStatus = (item: BusinessInfoItem) => {
    setSelectedBusiness(item);
    setChangeStatusModal(true);
  };

  const handleLoadBusiness = (businessId: number) => {
    mutateLoadBusiness(
      { businessId: businessId.toString() },
      {
        onSuccess: () => {
          toast.success("به روز رسانی حسابداری با موفقیت به‌روزرسانی شد");
          getBusinessInfo();
        },
        onError: () => {
          toast.error("خطا در به‌روزرسانی حسابداری");
        },
      }
    );
  };

  const handlePrintMasterKey = (
    businessInfo: BusinessInfoItem,
    masterKey: string
  ) => {
    const printContent = `
      <div style="font-family: 'IranSans', sans-serif; direction: rtl; text-align: right; padding: 20px;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          بازنشانی کلید سوییچ
        </h2>
        
        <div style="margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; background-color: #f9fafb; width: 40%;">
                نام کسب و کار:
              </td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">
                ${businessInfo.name}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; background-color: #f9fafb;">
                شناسه کسب و کار:
              </td>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace; font-size: 16px; color: #059669;">
                ${businessInfo.businessId}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; background-color: #f9fafb;">
                کلید سوییچ:
              </td>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace; font-size: 14px; color: #dc2626; word-break: break-all;">
                ${masterKey}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; background-color: #f9fafb;">
                تاریخ بازنشانی:
              </td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">
                ${toJalali(new Date(), "string")}
              </td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
          این سند به صورت خودکار تولید شده است  
        </div>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const handlePrintServiceKey = (
    businessInfo: BusinessInfoItem,
    userKey: string
  ) => {
    const printContent = `
      <div style="font-family: 'IranSans', sans-serif; direction: rtl; text-align: right; padding: 20px;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          بازنشانی کلید سرویس
        </h2>
        
        <div style="margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; background-color: #f9fafb; width: 40%;">
                نام کسب و کار:
              </td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">
                ${businessInfo.name}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; background-color: #f9fafb;">
                شناسه کسب و کار:
              </td>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace; font-size: 16px; color: #059669;">
                ${businessInfo.businessId}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; background-color: #f9fafb;">
                نام اختصاری:
              </td>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace; font-size: 14px; color: #059669;">
                ${businessInfo.abbreviationName}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; background-color: #f9fafb;">
                کلید سرویس :
              </td>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace; font-size: 14px; color: #dc2626; word-break: break-all;">
                ${userKey}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; background-color: #f9fafb;">
                تاریخ بازنشانی:
              </td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">
                ${toJalali(new Date(), "string")}
              </td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
          این سند به صورت خودکار تولید شده است  
        </div>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleResetMasterKey = (businessId: number) => {
    const businessInfo = data.find((biz) => biz.businessId === businessId);
    if (!businessInfo) return;

    resetMasterKey(
      { businessId },
      {
        onSuccess: (data) => {
          if (data.resultCode === ResultType.Success) {
            toast.success("کلید سوییچ با موفقیت بازنشانی شد");
            if (data.masterKey) {
              setPrintedBusiness(businessInfo);
              setLastMasterKey(data.masterKey);
              setShowMasterKeyModal(true);
            }
          }
        },
        onError: () => {
          toast.error("خطا در بازنشانی کلید سوییچ");
        },
      }
    );
  };

  const handleResetServiceTemplate = (abbreviationName: string) => {
    const businessInfo = data.find(
      (biz) => biz.abbreviationName === abbreviationName
    );
    if (!businessInfo) return;

    resetServiceTemplate(
      { username: abbreviationName },
      {
        onSuccess: (data) => {
          if (data.resultCode === ResultType.Success) {
            toast.success("کلید سرویس با موفقیت بازنشانی شد");
            if (data.userKey) {
              setPrintedBusiness(businessInfo);
              setLastServiceKey(data.userKey);
              setShowServiceKeyModal(true);
            }
          }
        },
        onError: () => {
          toast.error("خطا در بازنشانی کلید سرویس");
        },
      }
    );
  };

  return (
    <div className="p-2 sm:p-3 md:p-4 h-full flex flex-col">
      <div className="!bg-white dark:bg-gray-800 shadow-md rounded-lg p-3 md:p-4 mb-4 md:mb-6 border border-gray-100 dark:border-gray-400">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <Form
              form={searchForm}
              layout="vertical"
              onFinish={onFinish}
              className="flex-1"
            >
              <Form.Item
                label={<span className="dark:text-gray-50">جستجو</span>}
                name="businessId"
                className="!w-[350px]"
              >
                <InputNumber className="!w-full" />
              </Form.Item>
            </Form>
            <Button
              type="primary"
              htmlType="submit"
              className="!w-[180px] !bg-blue-500 hover:!bg-blue-600 !border-blue-500"
              onClick={onFinish}
            >
              جستجو
            </Button>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="!w-full sm:!w-auto !bg-blue-500 hover:!bg-blue-600 !border-blue-500"
            onClick={() =>
              navigate(
                `${UrlRoutes.businessManagement}${UrlRoutes.addBusinessManagement}`
              )
            }
          >
            ثبت کسب‌وکار جدید
          </Button>
        </div>
      </div>

      <Spin spinning={isLoading} className="flex-1">
        <SimpleBar className="h-[calc(100vh-220px)] sm:h-[calc(100vh-240px)] md:h-[calc(100vh-260px)] lg:h-[calc(100vh-280px)] !bg-white dark:bg-gray-800 border border-gray-400 !rounded-lg">
          {data.length > 0 ? (
            <div className="bg-white dark:bg-gray-800rounded-lg min-h-full">
              {/* List Items */}
              <div className="divide-y divide-dashed divide-gray-400">
                {data.map((biz, index) => renderBusinessRow(biz, index))}
              </div>
            </div>
          ) : (
            !isLoading && (
              <div className="!bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center border border-gray-400">
                <div className="text-gray-500 dark:text-gray-50">
                  هیچ کسب‌وکاری یافت نشد
                </div>
              </div>
            )
          )}
        </SimpleBar>
      </Spin>
      {openChangeStatusModal && selectedBusiness && (
        <ChangeStatusBusinessModal
          openModal={openChangeStatusModal}
          handleConfirm={() => getBusinessInfo()}
          onClose={() => {
            setChangeStatusModal(false);
            setSelectedBusiness(undefined);
          }}
          selectedBusiness={selectedBusiness}
        />
      )}
      <Modal
        title={
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircleOutlined />
            <span className="!text-green-600 dark:!text-green-400">
              بازنشانی کلید سوییچ با موفقیت انجام شد
            </span>
          </div>
        }
        open={showMasterKeyModal}
        onCancel={() => setShowMasterKeyModal(false)}
        footer={null}
        width={500}
        centered
        className="dark:!bg-gray-800"
        styles={{
          header: {
            backgroundColor: "var(--ant-color-bg-container)",
            borderBottom: "1px solid var(--ant-color-border)",
          },
          body: {
            backgroundColor: "var(--ant-color-bg-container)",
          },
          mask: {
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          },
        }}
      >
        <div className="text-center py-4">
          <div className="bg-blue-50 dark:!bg-gray-700 border border-blue-300 dark:!border-gray-400 rounded-lg p-6 mb-4">
            <div className="space-y-4">
              <div className="text-center">
                <Text strong className="text-sm text-gray-600">
                  نام کسب و کار:
                </Text>
                <div className="mt-1 text-base font-semibold text-[#00BCD4]">
                  {printedBusiness?.name}
                </div>
              </div>
              <div className="text-center">
                <Text strong className="text-sm text-gray-600">
                  شناسه کسب و کار:
                </Text>
                <div className="mt-1 text-lg font-bold text-[#00BCD4]">
                  {printedBusiness?.businessId}
                </div>
              </div>
              <div className="text-center">
                <Text strong className="text-sm text-gray-600">
                  کلید سوییچ:
                </Text>
                <div className="mt-1 text-sm md:text-base text-red-600 break-all">
                  {lastMasterKey}
                </div>
              </div>
            </div>
          </div>

          <Space size="middle">
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={() =>
                printedBusiness &&
                handlePrintMasterKey(printedBusiness, lastMasterKey)
              }
              className="!bg-blue-500 hover:!bg-blue-600 !border-blue-500 !text-white dark:!bg-blue-600 dark:hover:!bg-blue-700 dark:!border-blue-600"
            >
              پرینت
            </Button>
            <Button
              onClick={() => setShowMasterKeyModal(false)}
              className="!bg-white dark:!bg-transparent !border-blue-500 dark:!border-gray-250 !text-blue-500 dark:!text-gray-50 hover:!bg-blue-50 dark:hover:!bg-gray-700"
            >
              بستن
            </Button>
          </Space>
        </div>
      </Modal>

      <Modal
        title={
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircleOutlined />
            <span className="!text-green-600 dark:!text-green-400">
              بازنشانی کلید سرویس با موفقیت انجام شد
            </span>
          </div>
        }
        open={showServiceKeyModal}
        onCancel={() => setShowServiceKeyModal(false)}
        footer={null}
        width={500}
        centered
        className="dark:!bg-gray-800"
        styles={{
          header: {
            backgroundColor: "var(--ant-color-bg-container)",
            borderBottom: "1px solid var(--ant-color-border)",
          },
          body: {
            backgroundColor: "var(--ant-color-bg-container)",
          },
          mask: {
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          },
        }}
      >
        <div className="text-center py-4">
          <div className="bg-blue-50 dark:!bg-gray-700 border border-blue-300 dark:!border-gray-400 rounded-lg p-6 mb-4">
            <div className="space-y-4">
              <div className="text-center">
                <Text strong className="text-sm text-gray-600">
                  نام کسب و کار:
                </Text>
                <div className="mt-1 text-base font-semibold text-[#00BCD4]">
                  {printedBusiness?.name}
                </div>
              </div>
              <div className="text-center">
                <Text strong className="text-sm text-gray-600">
                  شناسه کسب و کار:
                </Text>
                <div className="mt-1 text-lg font-bold text-[#00BCD4]">
                  {printedBusiness?.businessId}
                </div>
              </div>
              <div className="text-center">
                <Text strong className="text-sm text-gray-600">
                  نام اختصاری:
                </Text>
                <div className="mt-1 text-base font-semibold text-[#00BCD4]">
                  {printedBusiness?.abbreviationName}
                </div>
              </div>
              <div className="text-center">
                <Text strong className="text-sm text-gray-600">
                  کلید سرویس:
                </Text>
                <div className="mt-1 text-sm md:text-base text-red-600 break-all">
                  {lastServiceKey}
                </div>
              </div>
            </div>
          </div>

          <Space size="middle">
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={() =>
                printedBusiness &&
                handlePrintServiceKey(printedBusiness, lastServiceKey)
              }
              className="!bg-blue-500 hover:!bg-blue-600 !border-blue-500 !text-white dark:!bg-blue-600 dark:hover:!bg-blue-700 dark:!border-blue-600"
            >
              پرینت
            </Button>
            <Button
              onClick={() => setShowServiceKeyModal(false)}
              className="!bg-white dark:!bg-transparent !border-blue-500 dark:!border-gray-250 !text-blue-500 dark:!text-gray-50 hover:!bg-blue-50 dark:hover:!bg-gray-700"
            >
              بستن
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

// Print Modals
// MasterKey Modal
// ServiceKey Modal

export default BusinessManagementListView;
