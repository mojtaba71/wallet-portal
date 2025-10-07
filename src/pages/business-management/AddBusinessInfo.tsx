import InputNumber from "@/components/kits/number-input/NumberInput";
import Select from "@/components/kits/select-box/SelectBox";
import {
  accessLevelOptions,
  channelOptions,
  serviceTypeOptions,
  type RegisterBusinessResponse,
} from "@/models/businessManagement.model";
import { ResultType } from "@/models/enum/enum";
import { UrlRoutes } from "@/routes/url.routes";
import {
  useModifyBusinessInfo,
  useRegisterBusinessInfo,
} from "@/services/hook/businessManagementService.hook";
import { Button, Form, Input, Typography, Modal, Space } from "antd";
import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PrinterOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { toJalali } from "@/utils/dateConfig";

const { Title, Text } = Typography;

const AddBusinessInfo = ({
  handleSuccess,
  bindSubmit,
}: {
  handleSuccess: (businessId: number) => void;
  bindSubmit?: (submitFn: () => void) => void;
}) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] =
    useState<RegisterBusinessResponse | null>(null);
  const [submittedName, setSubmittedName] = useState<string>("");

  const { mutate: mutateRegisterBusiness, isLoading } =
    useRegisterBusinessInfo();

  const { mutate: mutateModifyBusinessInfo, isLoading: isLoadingModify } =
    useModifyBusinessInfo();

  const hasInitialized = useRef(false);

  const setFormValues = useCallback(
    (businessInfo: any) => {
      if (businessInfo) {
        const {
          name,
          abbreviationName,
          inputPort,
          inputVolume,
          inputRate,
          outPutChannelType,
          outPutPort,
          outPutTimeOut,
          outPutHost,
          pinApi,
          serviceType,
          accessLevel,
        } = businessInfo;

        form.setFieldsValue({
          name,
          abbreviationName,
          inputPort,
          inputVolume,
          inputRate,
          outPutChannelType,
          outPutPort,
          outPutTimeOut,
          outPutHost,
          pinAPI: pinApi,
          serviceType,
          accessLevel,
        });
      }
    },
    [form]
  );

  useEffect(() => {
    // اتصال متد submit فرم به والد برای دکمه ثبت پایین صفحه
    if (bindSubmit) {
      bindSubmit(() => form.submit());
    }
  }, [bindSubmit]);

  useEffect(() => {
    if (hasInitialized.current) return;

    if (!state?.businessInfo?.businessId) {
      form.resetFields();
    }

    if (state?.businessInfo) {
      setFormValues(state.businessInfo);
      hasInitialized.current = true;
    }
  }, [state?.businessInfo, setFormValues]);

  interface FormValues {
    name: string;
    abbreviationName: string;
    inputPort?: number;
    inputVolume?: number;
    inputRate?: number;
    outPutChannelType: string;
    outPutHost?: string;
    outPutPort?: number;
    outPutTimeOut?: number;
    pinAPI: string;
    serviceType: string;
    accessLevel: string;
  }

  const onFinish = async (values: FormValues) => {
    if (isLoading || isLoadingModify) {
      return;
    }

    const transformedValues = {
      ...values,
      isInputTls: true,
      isOutPutTls: true,
      outPutPort:
        values.outPutChannelType === "REST" ? undefined : values.outPutPort,
    };

    if (state?.businessInfo.businessId) {
      mutateModifyBusinessInfo(
        {
          businessId: state.businessInfo.businessId,
          ...transformedValues,
        },
        {
          onSuccess: (successData: RegisterBusinessResponse) => {
            if (successData.resultCode === ResultType.Success) {
              toast.success("اطلاعات کسب و کار با موفقیت ویرایش شد");
              setTimeout(() => {
                navigate(`${UrlRoutes.businessManagement}${UrlRoutes.businessManagementList}`);
              }, 1500);
            }
          },
        }
      );
    } else {
      mutateRegisterBusiness(transformedValues, {
        onSuccess: (successData: RegisterBusinessResponse) => {
          if (successData.resultCode === ResultType.Success) {
            if (successData.walletServiceUserInfo?.registerResultCode !== 0) {
              toast.warning("تعریف کاربر سرویس ناموفق بوده است");
            }
            setSuccessData(successData);
            setSubmittedName(values.name);
            setShowSuccessModal(true);
            handleSuccess(successData.businessId);
            form.resetFields();
          }
        },
      });
    }
  };

  const outPutChannelType = Form.useWatch("outPutChannelType", form);

  const handlePrint = () => {
    const printContent = `
      <div style="font-family: 'IranSans', sans-serif; direction: rtl; text-align: right; padding: 20px;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          اطلاعات ثبت کسب و کار
        </h2>
        
        <div style="margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; background-color: #f9fafb; width: 40%;">
                نام کسب و کار:
              </td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">
                ${form.getFieldValue("name") || ""}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; background-color: #f9fafb;">
                شناسه کسب و کار:
              </td>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace; font-size: 16px; color: #059669;">
                ${successData?.businessId || ""}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; background-color: #f9fafb;">
                کلید سوییچ:
              </td>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace; font-size: 14px; color: #dc2626; word-break: break-all;">
                ${successData?.masterKey || ""}
              </td>
            </tr>
            ${successData?.walletServiceUserInfo?.userKey ? `
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; background-color: #f9fafb;">
                کلید سرویس:
              </td>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace; font-size: 14px; color: #dc2626; word-break: break-all;">
                ${successData.walletServiceUserInfo.userKey}
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold; background-color: #f9fafb;">
                تاریخ ثبت:
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
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  return (
    <>
      <div>
        <div className="mb-6">
          <Title level={4} className="!text-lg !font-semibold !mb-4 !text-gray-800 dark:!text-gray-50">
            فرم ثبت اطلاعات کسب‌وکار
          </Title>
          <div className="border-b border-dashed border-gray-300 dark:border-gray-400"></div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label={<span className="dark:text-gray-50">نام کسب‌وکار</span>}
                rules={[{ required: true, message: "نام کسب‌وکار الزامی است" }]}
              >
                <Input className="dir-rtl !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100" />
              </Form.Item>

              <Form.Item
                name="abbreviationName"
                label={<span className="dark:text-gray-50">نام اختصاری</span>}
                rules={[
                  { required: true, message: "نام اختصاری الزامی است" },
                  {
                    min: 4,
                    message: "نام اختصاری باید حداقل 4 حرف باشد",
                  },
                  {
                    max: 10,
                    message: "نام اختصاری باید حداکثر 10 حرف باشد",
                  },
                  {
                    pattern: /^[a-zA-Z]+$/,
                    message: "نام اختصاری باید فقط شامل حروف انگلیسی باشد",
                  },
                ]}
              >
                <Input 
                  className="dir-rtl !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100"
                  maxLength={10}
                />
              </Form.Item>

              <Form.Item
                name="inputPort"
                label={<span className="dark:text-gray-50">پورت ورودی</span>}
                rules={[
                  {
                    required: true,
                    message: "پورت ورودی الزامی است",
                  },
                ]}
              >
                <InputNumber className="!w-full dir-ltr" />
              </Form.Item>

              <Form.Item name="inputVolume" label={<span className="dark:text-gray-50">حجم تراکنش ورودی مجاز</span>}>
                <InputNumber
                  className="!w-full dir-ltr"
                  max={999}
                  min={0}
                  maxLength={3}
                  placeholder="0-999"
                />
              </Form.Item>

              <Form.Item name="inputRate" label={<span className="dark:text-gray-50">نرخ تراکنش ورودی مجاز</span>}>
                <InputNumber
                  className="!w-full dir-ltr"
                  max={999}
                  min={0}
                  maxLength={3}
                  placeholder="0-999"
                />
              </Form.Item>

              <Form.Item
                name="outPutChannelType"
                label={<span className="dark:text-gray-50">نوع کانال خروجی</span>}
                rules={[
                  { required: true, message: "نوع کانال خروجی الزامی است" },
                ]}
              >
                <Select options={channelOptions} />
              </Form.Item>

              <Form.Item
                name="outPutPort"
                label={<span className="dark:text-gray-50">پورت خروجی</span>}
                rules={[
                  {
                    required: outPutChannelType === "ISO",
                    message: "پورت خروجی برای کانال ISO الزامی است",
                  },
                ]}
              >
                <InputNumber
                  className="!w-full dir-ltr"
                  disabled={outPutChannelType === "REST"}
                />
              </Form.Item>

              <Form.Item name="outPutTimeOut" label={<span className="dark:text-gray-50">محدودیت زمان پاسخ (ms)</span>}>
                <InputNumber className="!w-full dir-ltr" />
              </Form.Item>

              <Form.Item
                name="outPutHost"
                label={<span className="dark:text-gray-50">آدرس خروجی</span>}
                rules={[
                  {
                    required: outPutChannelType === "ISO",
                    message: "آدرس خروجی برای کانال ISO الزامی است",
                  },
                ]}
              >
                <Input
                  className="dir-rtl !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100"
                  placeholder={
                    outPutChannelType === "REST"
                      ? "مثال: https://api.example.com"
                      : "مثال: 192.168.1.100"
                  }
                />
              </Form.Item>

              <Form.Item
                name="pinAPI"
                label={<span className="dark:text-gray-50">آدرس سرویس هریم</span>}
                rules={[
                  {
                    required: true,
                    message: "آدرس سرویس هریم الزامی است",
                  },
                ]}
              >
                <Input
                  className="dir-ltr !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-250 !text-gray-900 dark:!text-gray-100"
                  placeholder="https://api.example.com/change-password"
                />
              </Form.Item>

              <Form.Item
                name="serviceType"
                label={<span className="dark:text-gray-50">نوع سرویس</span>}
                rules={[{ required: true, message: "نوع سرویس الزامی است" }]}
              >
                <Select options={serviceTypeOptions} />
              </Form.Item>

              <Form.Item
                name="accessLevel"
                label={<span className="dark:text-gray-50">سطح دسترسی</span>}
                rules={[{ required: true, message: "سطح دسترسی الزامی است" }]}
              >
                <Select options={accessLevelOptions} />
              </Form.Item>
            </div>
        </Form>
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircleOutlined />
            <span className="!text-green-600 dark:!text-green-400">ثبت کسب و کار با موفقیت انجام شد</span>
          </div>
        }
        open={showSuccessModal}
        onCancel={() => setShowSuccessModal(false)}
        footer={null}
        width={500}
        centered
        className="dark:!bg-gray-800"
        styles={{
          header: {
            backgroundColor: 'var(--ant-color-bg-container)',
            borderBottom: '1px solid var(--ant-color-border)',
          },
          body: {
            backgroundColor: 'var(--ant-color-bg-container)',
          },
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
          },
        }}
      >
        <div className="text-center py-4">
          <div className="bg-blue-50 dark:!bg-gray-700 border border-blue-300 dark:!border-gray-400 rounded-lg p-6 mb-4">
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="text-center">
                  <Text strong className="text-sm text-gray-600">
                    نام کسب و کار:
                  </Text>
                  <div className="mt-1 text-base font-semibold text-[#00BCD4]">
                    {submittedName || form.getFieldValue("name") || "-"}
                  </div>
                </div>

                <div className="text-center">
                  <Text strong className="text-sm text-gray-600">
                    شناسه کسب و کار:
                  </Text>
                  <div className="mt-1 text-lg font-bold text-[#00BCD4]">
                    {successData?.businessId}
                  </div>
                </div>

                <div className="text-center">
                  <Text strong className="text-sm text-gray-600">
                    کلید سوییچ:
                  </Text>
                  <div className="mt-1 text-sm md:text-base text-red-600 break-all">
                    {successData?.masterKey}
                  </div>
                </div>

                {successData?.walletServiceUserInfo?.userKey && (
                  <div className="text-center">
                    <Text strong className="text-sm text-gray-600">
                      کلید سرویس:
                    </Text>
                    <div className="mt-1 text-sm md:text-base text-red-600 break-all">
                      {successData.walletServiceUserInfo.userKey}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

                      <Space size="middle">
              <Button
                type="primary"
                icon={<PrinterOutlined />}
                onClick={() => {
                  handlePrint();
                }}
                size="large"
                className="!bg-blue-500 hover:!bg-blue-600 !border-blue-500 !text-white dark:!bg-blue-600 dark:hover:!bg-blue-700 dark:!border-blue-600"
              >
                پرینت
              </Button>
              <Button
                type="default"
                onClick={() => {
                  navigate(
                    `${UrlRoutes.businessManagement}${UrlRoutes.addBusinessManagement}`,
                    {
                      state: {
                        businessId: successData?.businessId,
                        addBusinessDeposit: true,
                      },
                    }
                  );
                }}
                size="large"
                className="!bg-blue-500 hover:!bg-blue-600 !border-blue-500 !text-white dark:!bg-blue-600 dark:hover:!bg-blue-700 dark:!border-blue-600"
              >
                ادامه به اطلاعات حساب
              </Button>
              <Button
                onClick={() => {
                  setShowSuccessModal(false);
                  form.resetFields();
                }}
                size="large"
                className="!bg-white dark:!bg-transparent !border-blue-500 dark:!border-gray-250 !text-blue-500 dark:!text-gray-50 hover:!bg-blue-50 dark:hover:!bg-gray-700"
              >
                بستن
              </Button>
            </Space>
        </div>
      </Modal>
    </>
  );
};

export default AddBusinessInfo;
